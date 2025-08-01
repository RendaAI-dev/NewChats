const express = require('express');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const QRCode = require('qrcode');
const { authenticateToken } = require('../middleware/auth');
const { validateWhatsAppConnection } = require('../middleware/validation');
const db = require('../config/database');
const logger = require('../utils/logger');

const router = express.Router();
const whatsappClients = new Map();

// Conectar nova instância WhatsApp
router.post('/connect', authenticateToken, validateWhatsAppConnection, async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    // Verificar limite de conexões (máximo 10)
    const existingConnections = await db.query(
      'SELECT COUNT(*) as count FROM whatsapp_connections WHERE user_id = $1',
      [userId]
    );

    if (existingConnections.rows[0].count >= 10) {
      return res.status(400).json({ 
        error: 'Limite máximo de 10 conexões WhatsApp atingido' 
      });
    }

    // Criar nova conexão no banco
    const result = await db.query(
      'INSERT INTO whatsapp_connections (user_id, name, status) VALUES ($1, $2, $3) RETURNING *',
      [userId, name, 'connecting']
    );

    const connection = result.rows[0];
    const connectionId = connection.id;

    // Configurar cliente WhatsApp
    const client = new Client({
      authStrategy: new LocalAuth({ clientId: connectionId }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      }
    });

    // Event listeners
    client.on('qr', async (qr) => {
      try {
        const qrCodeDataURL = await QRCode.toDataURL(qr);
        
        // Salvar QR code no banco
        await db.query(
          'UPDATE whatsapp_connections SET qr_code = $1, status = $2 WHERE id = $3',
          [qrCodeDataURL, 'qr_ready', connectionId]
        );

        // Emitir QR code via Socket.IO
        req.io.to(`user-${userId}`).emit('qr-code', {
          connectionId,
          qrCode: qrCodeDataURL
        });

        logger.info(`QR Code gerado para conexão ${connectionId}`);
      } catch (error) {
        logger.error('Erro ao gerar QR code:', error);
      }
    });

    client.on('ready', async () => {
      try {
        const info = client.info;
        
        await db.query(
          'UPDATE whatsapp_connections SET phone_number = $1, status = $2, qr_code = NULL, last_seen = CURRENT_TIMESTAMP WHERE id = $3',
          [info.wid.user, 'connected', connectionId]
        );

        req.io.to(`user-${userId}`).emit('whatsapp-connected', {
          connectionId,
          phoneNumber: info.wid.user,
          name: info.pushname
        });

        logger.info(`WhatsApp conectado: ${connectionId} - ${info.wid.user}`);
      } catch (error) {
        logger.error('Erro ao processar conexão:', error);
      }
    });

    client.on('disconnected', async (reason) => {
      try {
        await db.query(
          'UPDATE whatsapp_connections SET status = $1 WHERE id = $2',
          ['disconnected', connectionId]
        );

        req.io.to(`user-${userId}`).emit('whatsapp-disconnected', {
          connectionId,
          reason
        });

        whatsappClients.delete(connectionId);
        logger.info(`WhatsApp desconectado: ${connectionId} - ${reason}`);
      } catch (error) {
        logger.error('Erro ao processar desconexão:', error);
      }
    });

    client.on('auth_failure', async (msg) => {
      try {
        await db.query(
          'UPDATE whatsapp_connections SET status = $1 WHERE id = $2',
          ['auth_failed', connectionId]
        );

        req.io.to(`user-${userId}`).emit('whatsapp-auth-failed', {
          connectionId,
          message: msg
        });

        logger.error(`Falha na autenticação: ${connectionId} - ${msg}`);
      } catch (error) {
        logger.error('Erro ao processar falha de autenticação:', error);
      }
    });

    // Armazenar cliente
    whatsappClients.set(connectionId, client);

    // Inicializar cliente
    client.initialize();

    res.json({
      success: true,
      connection: {
        id: connectionId,
        name,
        status: 'connecting'
      }
    });

  } catch (error) {
    logger.error('Erro ao conectar WhatsApp:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar conexões do usuário
router.get('/connections', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await db.query(
      'SELECT id, name, phone_number, status, last_seen, created_at FROM whatsapp_connections WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      success: true,
      connections: result.rows
    });

  } catch (error) {
    logger.error('Erro ao listar conexões:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Desconectar WhatsApp
router.post('/disconnect/:connectionId', authenticateToken, async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.user.id;

    // Verificar se a conexão pertence ao usuário
    const connection = await db.query(
      'SELECT * FROM whatsapp_connections WHERE id = $1 AND user_id = $2',
      [connectionId, userId]
    );

    if (connection.rows.length === 0) {
      return res.status(404).json({ error: 'Conexão não encontrada' });
    }

    // Desconectar cliente
    const client = whatsappClients.get(connectionId);
    if (client) {
      await client.destroy();
      whatsappClients.delete(connectionId);
    }

    // Atualizar status no banco
    await db.query(
      'UPDATE whatsapp_connections SET status = $1 WHERE id = $2',
      ['disconnected', connectionId]
    );

    res.json({
      success: true,
      message: 'WhatsApp desconectado com sucesso'
    });

  } catch (error) {
    logger.error('Erro ao desconectar WhatsApp:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar grupos automaticamente
router.post('/sync-groups/:connectionId', authenticateToken, async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.user.id;

    const client = whatsappClients.get(connectionId);
    if (!client) {
      return res.status(400).json({ error: 'WhatsApp não conectado' });
    }

    // Buscar grupos
    const chats = await client.getChats();
    const groups = chats.filter(chat => chat.isGroup);

    // Salvar grupos no banco
    for (const group of groups) {
      await db.query(
        `INSERT INTO whatsapp_groups (user_id, whatsapp_connection_id, group_id, name, description, participant_count, is_admin)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (whatsapp_connection_id, group_id) 
         DO UPDATE SET name = $4, description = $5, participant_count = $6, is_admin = $7, updated_at = CURRENT_TIMESTAMP`,
        [
          userId,
          connectionId,
          group.id._serialized,
          group.name,
          group.description || '',
          group.participants.length,
          group.participants.some(p => p.id._serialized === client.info.wid._serialized && p.isAdmin)
        ]
      );
    }

    res.json({
      success: true,
      message: `${groups.length} grupos sincronizados`,
      groupCount: groups.length
    });

  } catch (error) {
    logger.error('Erro ao sincronizar grupos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar contatos do WhatsApp
router.post('/sync-contacts/:connectionId', authenticateToken, async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.user.id;

    const client = whatsappClients.get(connectionId);
    if (!client) {
      return res.status(400).json({ error: 'WhatsApp não conectado' });
    }

    // Buscar contatos
    const contacts = await client.getContacts();
    let syncedCount = 0;

    for (const contact of contacts) {
      if (contact.isMyContact && contact.number) {
        try {
          await db.query(
            `INSERT INTO contacts (user_id, name, phone_number, is_whatsapp)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (user_id, phone_number) 
             DO UPDATE SET name = $2, is_whatsapp = $4, updated_at = CURRENT_TIMESTAMP`,
            [userId, contact.name || contact.pushname, contact.number, true]
          );
          syncedCount++;
        } catch (error) {
          logger.error(`Erro ao salvar contato ${contact.number}:`, error);
        }
      }
    }

    res.json({
      success: true,
      message: `${syncedCount} contatos sincronizados`,
      contactCount: syncedCount
    });

  } catch (error) {
    logger.error('Erro ao sincronizar contatos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Enviar mensagem individual
router.post('/send-message', authenticateToken, async (req, res) => {
  try {
    const { connectionId, phoneNumber, message } = req.body;
    const userId = req.user.id;

    const client = whatsappClients.get(connectionId);
    if (!client) {
      return res.status(400).json({ error: 'WhatsApp não conectado' });
    }

    // Formatar número
    const formattedNumber = phoneNumber.includes('@') ? phoneNumber : `${phoneNumber}@c.us`;

    // Enviar mensagem
    await client.sendMessage(formattedNumber, message);

    // Log da ação
    await db.query(
      'INSERT INTO system_logs (user_id, action, details) VALUES ($1, $2, $3)',
      [userId, 'send_message', { connectionId, phoneNumber, messageLength: message.length }]
    );

    res.json({
      success: true,
      message: 'Mensagem enviada com sucesso'
    });

  } catch (error) {
    logger.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
});

// Fazer chamada perdida
router.post('/missed-call', authenticateToken, async (req, res) => {
  try {
    const { connectionId, phoneNumber } = req.body;
    const userId = req.user.id;

    const client = whatsappClients.get(connectionId);
    if (!client) {
      return res.status(400).json({ error: 'WhatsApp não conectado' });
    }

    // Simular chamada perdida (funcionalidade específica do WhatsApp Web)
    // Nota: Esta é uma funcionalidade avançada que pode precisar de implementação específica
    
    // Log da ação
    await db.query(
      'INSERT INTO system_logs (user_id, action, details) VALUES ($1, $2, $3)',
      [userId, 'missed_call', { connectionId, phoneNumber }]
    );

    res.json({
      success: true,
      message: 'Chamada perdida executada'
    });

  } catch (error) {
    logger.error('Erro ao fazer chamada perdida:', error);
    res.status(500).json({ error: 'Erro ao executar chamada perdida' });
  }
});

module.exports = router;