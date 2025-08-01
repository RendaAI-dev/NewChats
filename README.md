# New Chats - Sistema Disparador WhatsApp

Sistema completo para automação de disparos no WhatsApp Business com funcionalidades avançadas como IA para geração de mensagens, sistema anti-bloqueio e chamada perdida estratégica.

## 🚀 Funcionalidades

### Core Features
- **Integração WhatsApp Business**: Conecte até 10 contas via QR Code
- **Disparos Inteligentes**: Mensagens individuais e em grupo com intervalos anti-bloqueio
- **Gestão de Contatos**: Importação, validação e remoção de duplicatas
- **Listas Dinâmicas**: Criação e gestão de listas de contatos
- **Grupos Automáticos**: Sincronização automática de grupos do WhatsApp

### Funcionalidades Avançadas
- **IA para Mensagens**: Geração automática de conteúdo personalizado
- **Sistema Anti-Bloqueio**: Tecnologia avançada de proteção
- **Chamada Perdida**: Estratégia exclusiva para engajamento
- **Variáveis Dinâmicas**: Nome, tempo, data e variáveis personalizadas
- **Campanhas Ilimitadas**: Criação e gestão de campanhas automatizadas
- **Dashboard Analytics**: Relatórios em tempo real

## 🛠 Tecnologias

### Backend
- **Node.js** + Express.js
- **PostgreSQL** para dados
- **Redis** para cache e sessões
- **WhatsApp Web.js** para integração
- **OpenAI API** para IA
- **Stripe** para pagamentos
- **Socket.IO** para tempo real

### Frontend
- **React** + TypeScript
- **Tailwind CSS** para styling
- **Socket.IO Client** para tempo real
- **React Query** para estado
- **Recharts** para gráficos

### Infraestrutura
- **Docker** + Docker Compose
- **Nginx** como reverse proxy
- **SSL/TLS** ready
- **Rate limiting** e segurança

## 🚀 Instalação e Execução

### Pré-requisitos
- Docker e Docker Compose instalados
- Portas 80, 443, 3000, 3001, 5432, 6379 disponíveis

### 1. Clone o repositório
```bash
git clone <repository-url>
cd newchats-system
```

### 2. Configure as variáveis de ambiente
```bash
# Copie e edite o arquivo de ambiente
cp .env.example .env

# Edite as seguintes variáveis:
# - STRIPE_SECRET_KEY: Sua chave secreta do Stripe
# - OPENAI_API_KEY: Sua chave da OpenAI
# - JWT_SECRET: Uma chave secreta forte
# - Outras configurações conforme necessário
```

### 3. Execute o sistema
```bash
# Iniciar todos os serviços
docker-compose up -d

# Verificar logs
docker-compose logs -f

# Parar o sistema
docker-compose down
```

### 4. Acesse o sistema
- **Frontend**: http://localhost (porta 80)
- **API**: http://localhost/api
- **Health Check**: http://localhost/health

## 📊 Estrutura do Projeto

```
newchats-system/
├── docker-compose.yml          # Orquestração dos serviços
├── backend/                    # API Node.js
│   ├── Dockerfile
│   ├── server.js              # Servidor principal
│   ├── routes/                # Rotas da API
│   ├── database/              # Schema e migrações
│   ├── middleware/            # Middlewares
│   ├── services/              # Serviços (IA, WhatsApp)
│   └── utils/                 # Utilitários
├── frontend/                  # Interface React
│   ├── Dockerfile
│   ├── src/                   # Código fonte
│   └── nginx.conf             # Configuração Nginx
└── nginx/                     # Proxy reverso
    └── nginx.conf
```

## 🔧 Configuração

### Banco de Dados
O PostgreSQL é inicializado automaticamente com:
- Schema completo das tabelas
- Índices otimizados
- Triggers para timestamps
- Usuário admin padrão

### WhatsApp Integration
- Suporte a múltiplas conexões (até 10)
- QR Code automático via Socket.IO
- Sincronização de contatos e grupos
- Sistema anti-bloqueio integrado

### Stripe Integration
Configure no arquivo `.env`:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### OpenAI Integration
Para funcionalidades de IA:
```env
OPENAI_API_KEY=sk-...
```

## 📈 Monitoramento

### Health Checks
- **Backend**: `GET /health`
- **Database**: Verificação automática de conexão
- **Redis**: Verificação de cache

### Logs
```bash
# Logs de todos os serviços
docker-compose logs -f

# Logs específicos
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Métricas
- Dashboard em tempo real
- Estatísticas de campanhas
- Monitoramento de conexões WhatsApp
- Relatórios de entrega

## 🔒 Segurança

### Implementado
- Rate limiting por IP
- Headers de segurança
- Validação de entrada
- Autenticação JWT
- CORS configurado
- SQL injection protection

### SSL/HTTPS
Para produção, descomente e configure o bloco HTTPS no `nginx/nginx.conf` e adicione seus certificados SSL.

## 🚀 Deploy em Produção

### 1. Configurar domínio
```bash
# Editar nginx/nginx.conf
server_name seu-dominio.com;
```

### 2. SSL/TLS
```bash
# Adicionar certificados em nginx/ssl/
# Descomentar bloco HTTPS no nginx.conf
```

### 3. Variáveis de produção
```env
NODE_ENV=production
FRONTEND_URL=https://seu-dominio.com
DB_PASSWORD=senha-forte-producao
JWT_SECRET=chave-jwt-super-secreta
```

### 4. Backup automático
Configure backup automático do PostgreSQL:
```bash
# Adicionar ao crontab
0 2 * * * docker exec newchats_db pg_dump -U newchats_user newchats > backup_$(date +%Y%m%d).sql
```

## 📞 Suporte

Para suporte técnico:
- Email: suporte@newchats.io
- WhatsApp: +55 11 99999-9999
- Documentação: https://docs.newchats.io

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**New Chats** - Sistema Disparador WhatsApp Profissional
Desenvolvido com ❤️ para automatizar e otimizar suas comunicações no WhatsApp Business.