# 🚀 Guia de Deploy - Arena Coligados

## 📋 Opções de Deploy Disponíveis

### 1. 🟢 Vercel (Recomendado)
**Mais fácil e rápido para Next.js**

#### Passos:
1. **Acesse**: https://vercel.com
2. **Conecte sua conta GitHub**
3. **Importe o repositório**: `Brenao122/arena-coligados`
4. **Configure as variáveis de ambiente**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://fksahbiajrccraxvowtv.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2FoYmlhanJjY3JheHZvd3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTM1MjQsImV4cCI6MjA3MDY4OTUyNH0.zW0CAWuOkZaRAXVcd0uNRADnf_ADMn9FjtCySFlLKeM
   SUPABASE_SERVICE_ROLE_KEY=sua_service_key_aqui
   GOOGLE_SHEETS_PRIVATE_KEY=sua_private_key_aqui
   GOOGLE_SHEETS_CLIENT_EMAIL=seu_client_email_aqui
   GOOGLE_SHEETS_SPREADSHEET_ID=seu_spreadsheet_id_aqui
   ```
5. **Deploy automático** - cada push no main faz deploy

### 2. 🟡 Netlify
**Boa alternativa gratuita**

#### Passos:
1. **Acesse**: https://netlify.com
2. **Conecte sua conta GitHub**
3. **Importe o repositório**: `Brenao122/arena-coligados`
4. **Configure as variáveis de ambiente** (mesmas do Vercel)
5. **Deploy automático**

### 3. 🔵 Railway
**Para aplicações com banco de dados**

#### Passos:
1. **Acesse**: https://railway.app
2. **Conecte sua conta GitHub**
3. **Importe o repositório**: `Brenao122/arena-coligados`
4. **Configure as variáveis de ambiente**
5. **Deploy automático**

### 4. 🐳 Docker (VPS/Cloud)
**Para controle total**

#### Passos:
1. **Configure um VPS** (DigitalOcean, AWS, etc.)
2. **Clone o repositório**:
   ```bash
   git clone https://github.com/Brenao122/arena-coligados.git
   cd arena-coligados
   ```
3. **Configure as variáveis de ambiente**:
   ```bash
   cp .env.example .env.local
   # Edite o arquivo .env.local com suas credenciais
   ```
4. **Execute com Docker**:
   ```bash
   docker-compose up -d
   ```

## 🔧 Configurações Necessárias

### Variáveis de Ambiente Obrigatórias:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://fksahbiajrccraxvowtv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2FoYmlhanJjY3JheHZvd3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTM1MjQsImV4cCI6MjA3MDY4OTUyNH0.zW0CAWuOkZaRAXVcd0uNRADnf_ADMn9FjtCySFlLKeM
SUPABASE_SERVICE_ROLE_KEY=sua_service_key_aqui

# Google Sheets
GOOGLE_SHEETS_PRIVATE_KEY=sua_private_key_aqui
GOOGLE_SHEETS_CLIENT_EMAIL=seu_client_email_aqui
GOOGLE_SHEETS_SPREADSHEET_ID=seu_spreadsheet_id_aqui
```

### Como obter as credenciais:

#### Supabase Service Key:
1. Acesse: https://supabase.com/dashboard/project/fogtbptqvvhoqesljlen/settings/api
2. Copie a "service_role" key

#### Google Sheets Credenciais:
1. Acesse: https://console.cloud.google.com
2. Crie um projeto ou selecione existente
3. Ative a Google Sheets API
4. Crie uma service account
5. Baixe o JSON com as credenciais
6. Extraia: `private_key`, `client_email`
7. Compartilhe a planilha com o `client_email`

## 🧪 Testes Pós-Deploy

### 1. Teste de Conectividade:
```bash
curl https://sua-url-deploy.com/api/health
```

### 2. Teste das APIs:
```bash
curl https://sua-url-deploy.com/api/hybrid/quadras
curl https://sua-url-deploy.com/api/hybrid/clientes
curl https://sua-url-deploy.com/api/hybrid/dashboard
```

### 3. Teste da Interface:
- Acesse: `https://sua-url-deploy.com`
- Teste login/logout
- Verifique dashboard
- Teste CRUD de clientes/quadras/reservas

## 📊 Monitoramento

### Vercel:
- Dashboard: https://vercel.com/dashboard
- Logs em tempo real
- Métricas de performance

### Netlify:
- Dashboard: https://app.netlify.com
- Logs de deploy
- Analytics

### Railway:
- Dashboard: https://railway.app/dashboard
- Logs em tempo real
- Métricas de recursos

## 🚨 Troubleshooting

### Erro 500:
- Verifique variáveis de ambiente
- Confirme credenciais do Supabase/Google Sheets
- Verifique logs da plataforma

### Erro de CORS:
- Configure domínio permitido no Supabase
- Verifique configurações de rede

### Erro de Build:
- Verifique dependências no package.json
- Confirme Node.js version (18+)

## 🎯 Próximos Passos

1. **Deploy em produção**
2. **Configurar domínio personalizado**
3. **Configurar SSL/HTTPS**
4. **Implementar monitoramento**
5. **Configurar backup automático**

---

**🎉 Sua aplicação Arena Coligados está pronta para produção!**
