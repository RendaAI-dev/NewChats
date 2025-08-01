const express = require('express');
const cron = require('node-cron');
const { authenticateToken } = require('../middleware/auth');
const { validateCampaign } = require('../middleware/validation');
const db = require('../config/database');
const { generateAIMessage } = require('../services/aiService');
const { processMessageVariables } = require('../utils/messageProcessor');
const logger = require('../utils/logger');

const router = express.Router();
const activeCampaigns = new Map();

// Criar nova campanha
router.post('/', authenticateToken, validateCampaign, async (req, res) => {
  try {
    const {
      name,
      messageTemplate,
      targetType,
      targetIds,
      whatsappConnectionId,
      scheduledAt,
      intervalMin,
      intervalMax,
      useAiGeneration,
      useMissedCall,
      variables
    } = req.body;

    const userId = req.user.id;

    // Verificar se a conexão WhatsApp existe e pertence ao usuário
    const connection = await db.query(
      'SELECT * FROM whatsapp_connections WHERE id = $1 AND user_id = $2 AND status = $3',
      [whatsappConnectionId, userId, 'connected']
    );

    if (connection.rows.length === 0) {
      return res.status(400).json({ error: 'Conexão WhatsApp não encontrada ou não conectada' });
    }

    // Calcular total de contatos
    let totalContacts = 0;
    if (targetType === 'list') {
      const result = await db.query(
        'SELECT COUNT(*) as count FROM list_contacts lc JOIN contacts c ON lc.contact_id = c.id WHERE lc.list_id = ANY($1) AND c.is_valid = true',
        [targetIds]
      );
      totalContacts = parseInt(result.rows[0].count);
    } else if (targetType === 'individual') {
      totalContacts = targetIds.length;
    }

    // Criar campanha
    const result = await db.query(
      `INSERT INTO campaigns (
        user_id, name, message_template, target_type, target_ids, 
        whatsapp_connection_id, scheduled_at, interval_min, interval_max,
        use_ai_generation, use_missed_call, variables, total_contacts, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        userId, name, messageTemplate, targetType, targetIds,
        whatsappConnectionId, scheduledAt, intervalMin || 30, intervalMax || 60,
        useAiGeneration || false, useMissedCall || false, variables || {},
        totalContacts, scheduledAt ? 'scheduled' : 'draft'
      ]
    );

    const campaign = result.rows[0];

    // Se agendada, configurar execução
    if (scheduledAt) {
      scheduleCampaign(campaign);
    }

    res.json({
      success: true,
      campaign: {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        totalContacts: campaign.total_contacts,
        scheduledAt: campaign.scheduled_at
      }
    });

  } catch (error) {
    logger.error('Erro ao criar campanha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar campanhas do usuário
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    let query = `
      SELECT c.*, wc.name as whatsapp_name, wc.phone_number
      FROM campaigns c
      LEFT JOIN whatsapp_connections wc ON c.whatsapp_connection_id = wc.id
      WHERE c.user_id = $1
    `;
    const params = [userId];

    if (status) {
      query += ' AND c.status = $2';
      params.push(status);
    }

    query += ' ORDER BY c.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const result = await db.query(query, params);

    // Contar total
    const countQuery = 'SELECT COUNT(*) as total FROM campaigns WHERE user_id = $1' + (status ? ' AND status = $2' : '');
    const countParams = status ? [userId, status] : [userId];
    const countResult = await db.query(countQuery, countParams);

    res.json({
      success: true,
      campaigns: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit)
      }
    });

  } catch (error) {
    logger.error('Erro ao listar campanhas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Iniciar campanha
router.post('/:campaignId/start', authenticateToken, async (req, res) => {
  try {
    const { campaignId } = req.params;
    const userId = req.user.id;

    // Buscar campanha
    const result = await db.query(
      'SELECT * FROM campaigns WHERE id = $1 AND user_id = $2',
      [campaignId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    const campaign = result.rows[0];

    if (campaign.status !== 'draft' && campaign.status !== 'paused') {
      return res.status(400).json({ error: 'Campanha não pode ser iniciada neste status' });
    }

    // Atualizar status
    await db.query(
      'UPDATE campaigns SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['running', campaignId]
    );

    // Iniciar processamento
    processCampaign(campaign);

    res.json({
      success: true,
      message: 'Campanha iniciada com sucesso'
    });

  } catch (error) {
    logger.error('Erro ao iniciar campanha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Pausar campanha
router.post('/:campaignId/pause', authenticateToken, async (req, res) => {
  try {
    const { campaignId } = req.params;
    const userId = req.user.id;

    await db.query(
      'UPDATE campaigns SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3',
      ['paused', campaignId, userId]
    );

    // Parar processamento
    if (activeCampaigns.has(campaignId)) {
      clearTimeout(activeCampaigns.get(campaignId));
      activeCampaigns.delete(campaignId);
    }

    res.json({
      success: true,
      message: 'Campanha pausada com sucesso'
    });

  } catch (error) {
    logger.error('Erro ao pausar campanha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter estatísticas da campanha
router.get('/:campaignId/stats', authenticateToken, async (req, res) => {
  try {
    const { campaignId } = req.params;
    const userId = req.user.id;

    // Verificar se campanha pertence ao usuário
    const campaign = await db.query(
      'SELECT * FROM campaigns WHERE id = $1 AND user_id = $2',
      [campaignId, userId]
    );

    if (campaign.rows.length === 0) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    // Buscar estatísticas detalhadas
    const stats = await db.query(
      `SELECT 
        status,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM sent_messages WHERE campaign_id = $1), 2) as percentage
       FROM sent_messages 
       WHERE campaign_id = $1 
       GROUP BY status`,
      [campaignId]
    );

    // Mensagens por hora (últimas 24h)
    const hourlyStats = await db.query(
      `SELECT 
        DATE_TRUNC('hour', sent_at) as hour,
        COUNT(*) as count
       FROM sent_messages 
       WHERE campaign_id = $1 AND sent_at >= NOW() - INTERVAL '24 hours'
       GROUP BY DATE_TRUNC('hour', sent_at)
       ORDER BY hour`,
      [campaignId]
    );

    res.json({
      success: true,
      stats: {
        overview: stats.rows,
        hourly: hourlyStats.rows,
        campaign: campaign.rows[0]
      }
    });

  } catch (error) {
    logger.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Função para agendar campanha
function scheduleCampaign(campaign) {
  const scheduleDate = new Date(campaign.scheduled_at);
  const now = new Date();

  if (scheduleDate <= now) {
    // Executar imediatamente
    processCampaign(campaign);
  } else {
    // Agendar execução
    const delay = scheduleDate.getTime() - now.getTime();
    setTimeout(() => {
      processCampaign(campaign);
    }, delay);
  }
}

// Função para processar campanha
async function processCampaign(campaign) {
  try {
    logger.info(`Iniciando processamento da campanha: ${campaign.id}`);

    // Atualizar status para running
    await db.query(
      'UPDATE campaigns SET status = $1 WHERE id = $2',
      ['running', campaign.id]
    );

    // Buscar contatos alvo
    let contacts = [];
    
    if (campaign.target_type === 'list') {
      const result = await db.query(
        `SELECT c.* FROM contacts c
         JOIN list_contacts lc ON c.id = lc.contact_id
         WHERE lc.list_id = ANY($1) AND c.is_valid = true AND c.is_whatsapp = true`,
        [campaign.target_ids]
      );
      contacts = result.rows;
    } else if (campaign.target_type === 'individual') {
      const result = await db.query(
        'SELECT * FROM contacts WHERE id = ANY($1) AND is_valid = true AND is_whatsapp = true',
        [campaign.target_ids]
      );
      contacts = result.rows;
    }

    // Processar cada contato
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      
      // Verificar se campanha ainda está ativa
      const campaignCheck = await db.query(
        'SELECT status FROM campaigns WHERE id = $1',
        [campaign.id]
      );
      
      if (campaignCheck.rows[0].status !== 'running') {
        logger.info(`Campanha ${campaign.id} foi pausada/cancelada`);
        break;
      }

      // Processar mensagem
      let messageContent = campaign.message_template;

      // Aplicar variáveis
      messageContent = processMessageVariables(messageContent, contact, campaign.variables);

      // Gerar com IA se habilitado
      if (campaign.use_ai_generation) {
        try {
          messageContent = await generateAIMessage(messageContent, contact);
        } catch (error) {
          logger.error('Erro ao gerar mensagem com IA:', error);
        }
      }

      // Registrar mensagem
      const messageResult = await db.query(
        `INSERT INTO sent_messages (campaign_id, contact_id, whatsapp_connection_id, message_content, status)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [campaign.id, contact.id, campaign.whatsapp_connection_id, messageContent, 'pending']
      );

      const messageId = messageResult.rows[0].id;

      // Enviar mensagem (implementar integração com WhatsApp)
      try {
        // Aqui seria a integração real com o WhatsApp
        // await sendWhatsAppMessage(campaign.whatsapp_connection_id, contact.phone_number, messageContent);
        
        // Chamada perdida se habilitada
        if (campaign.use_missed_call) {
          // await makeMissedCall(campaign.whatsapp_connection_id, contact.phone_number);
        }

        // Atualizar status da mensagem
        await db.query(
          'UPDATE sent_messages SET status = $1, sent_at = CURRENT_TIMESTAMP WHERE id = $2',
          ['sent', messageId]
        );

        // Atualizar contador da campanha
        await db.query(
          'UPDATE campaigns SET sent_count = sent_count + 1 WHERE id = $1',
          [campaign.id]
        );

      } catch (error) {
        logger.error(`Erro ao enviar mensagem para ${contact.phone_number}:`, error);
        
        await db.query(
          'UPDATE sent_messages SET status = $1, error_message = $2 WHERE id = $3',
          ['failed', error.message, messageId]
        );

        await db.query(
          'UPDATE campaigns SET failed_count = failed_count + 1 WHERE id = $1',
          [campaign.id]
        );
      }

      // Intervalo inteligente entre mensagens
      if (i < contacts.length - 1) {
        const interval = Math.random() * (campaign.interval_max - campaign.interval_min) + campaign.interval_min;
        await new Promise(resolve => setTimeout(resolve, interval * 1000));
      }
    }

    // Finalizar campanha
    await db.query(
      'UPDATE campaigns SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['completed', campaign.id]
    );

    logger.info(`Campanha ${campaign.id} finalizada`);

  } catch (error) {
    logger.error(`Erro ao processar campanha ${campaign.id}:`, error);
    
    await db.query(
      'UPDATE campaigns SET status = $1 WHERE id = $2',
      ['failed', campaign.id]
    );
  }
}

module.exports = router;