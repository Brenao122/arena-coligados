# 🚀 CONFIGURAÇÃO ESPECÍFICA - VPS ARENA COLIGADOS

## 📋 **INFORMAÇÕES DA VPS:**
- **Domínio:** srv998805.hstgr.cloud
- **IP Público:** 31.97.72.137
- **Status:** Ativa
- **Plano:** KVM 2
- **Expiração:** 8/set/2026

## 🔧 **COMANDOS PARA EXECUTAR NA VPS:**

### **1. CONECTAR NA VPS**
```bash
# Conectar via SSH
ssh root@31.97.72.137
# OU
ssh root@srv998805.hstgr.cloud
```

### **2. VERIFICAR STATUS DA VPS**
```bash
# Verificar IP público
curl -s ifconfig.me

# Verificar sistema operacional
cat /etc/os-release

# Verificar se Docker está instalado
docker --version

# Verificar se Node.js está instalado
node --version
npm --version

# Verificar portas em uso
netstat -tlnp | grep :3000
```

### **3. INSTALAR DEPENDÊNCIAS (se necessário)**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y docker.io docker-compose nginx

# CentOS/RHEL
sudo yum install -y docker docker-compose nginx

# Iniciar Docker
sudo systemctl start docker
sudo systemctl enable docker
```

### **4. CONFIGURAR APLICAÇÃO**
```bash
# Criar diretório da aplicação
sudo mkdir -p /srv/arena-coligados
cd /srv/arena-coligados

# Fazer upload do código (via Git ou SCP)
git clone <seu-repositorio> .
# OU
# scp -r ./arenacoligados/* root@31.97.72.137:/srv/arena-coligados/

# Instalar dependências
npm install
```

### **5. CONFIGURAR VARIÁVEIS DE AMBIENTE**
```bash
# Criar arquivo .env
sudo nano /srv/arena-coligados/.env

# Adicionar as variáveis:
NEXT_PUBLIC_SITE_URL=https://srv998805.hstgr.cloud
NODE_ENV=production
PORT=3000

# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL=arenasheets@credencial-n8n-471801.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n<SUA_CHAVE_AQUI>\n-----END PRIVATE KEY-----"
GOOGLE_SHEETS_SPREADSHEET_ID=174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://fogtbptqvvhoqesljlen.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUA_CHAVE_AQUI>
SUPABASE_URL=https://fogtbptqvvhoqesljlen.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<SUA_CHAVE_AQUI>

# Segurança
JWT_SECRET=<SEU_JWT_SECRET>
AUTH_COOKIE_SECURE=true
AUTH_COOKIE_DOMAIN=srv998805.hstgr.cloud
```

### **6. CONFIGURAR NGINX (PROXY REVERSO)**
```bash
# Criar configuração do Nginx
sudo nano /etc/nginx/sites-available/arena-coligados

# Conteúdo da configuração:
server {
    listen 80;
    server_name srv998805.hstgr.cloud;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Ativar site
sudo ln -s /etc/nginx/sites-available/arena-coligados /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### **7. INICIAR APLICAÇÃO**
```bash
# Opção 1: PM2 (recomendado para produção)
npm install -g pm2
pm2 start npm --name "arena-coligados" -- start
pm2 startup
pm2 save

# Opção 2: Docker
docker build -t arena-coligados .
docker run -d --name arena-coligados -p 3000:3000 --env-file .env arena-coligados

# Opção 3: Systemd
sudo nano /etc/systemd/system/arena-coligados.service
sudo systemctl daemon-reload
sudo systemctl start arena-coligados
sudo systemctl enable arena-coligados
```

---

## 🧪 **TESTES DE VALIDAÇÃO**

### **1. TESTE LOCAL NA VPS**
```bash
# Testar API de leitura
curl "http://localhost:3000/api/sheets/read?sheet=Reservas"

# Testar API de dashboard
curl "http://localhost:3000/api/dashboard-simple"

# Testar API de inserção
curl -X POST "http://localhost:3000/api/sheets/append" \
  -H "Content-Type: application/json" \
  -d '{"sheet":"Reservas","values":["teste-vps","cliente","quadra","professor","2024-01-15 10:00:00","2024-01-15 11:00:00","aula","pendente","50.00","Teste VPS","2024-01-15 09:00:00","individual"]}'
```

### **2. TESTE EXTERNO**
```bash
# Testar via IP público
curl "http://31.97.72.137/api/sheets/read?sheet=Reservas"

# Testar via domínio
curl "http://srv998805.hstgr.cloud/api/sheets/read?sheet=Reservas"
```

### **3. TESTE DO DASHBOARD**
```bash
# Acessar dashboard via navegador
http://srv998805.hstgr.cloud/dashboard/dashboard-admin
```

---

## 🔐 **VARIÁVEIS DE AMBIENTE ESPECÍFICAS**

### **OBRIGATÓRIAS:**
```bash
# Aplicação
NEXT_PUBLIC_SITE_URL=https://srv998805.hstgr.cloud
NODE_ENV=production
PORT=3000

# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL=arenasheets@credencial-n8n-471801.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n<SUA_CHAVE_AQUI>\n-----END PRIVATE KEY-----"
GOOGLE_SHEETS_SPREADSHEET_ID=174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://fogtbptqvvhoqesljlen.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUA_CHAVE_AQUI>
SUPABASE_URL=https://fogtbptqvvhoqesljlen.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<SUA_CHAVE_AQUI>

# Segurança
JWT_SECRET=<SEU_JWT_SECRET>
AUTH_COOKIE_SECURE=true
AUTH_COOKIE_DOMAIN=srv998805.hstgr.cloud
```

### **OPCIONAIS:**
```bash
# Monitoramento
SENTRY_DSN=<SENTRY_DSN>

# Email
MAILER_SMTP_HOST=<SMTP_HOST>
MAILER_SMTP_USER=<SMTP_USER>
MAILER_SMTP_PASS=<SMTP_PASS>

# VPS Info
VPS_PUBLIC_IP=31.97.72.137
VPS_SSH_USER=root
VPS_SSH_PORT=22
DOMAIN=srv998805.hstgr.cloud
```

---

## 🚨 **SOLUÇÃO DE PROBLEMAS**

### **Erro 500 na API:**
1. Verificar variáveis de ambiente
2. Verificar logs: `pm2 logs arena-coligados`
3. Verificar conectividade com Google Sheets
4. Verificar credenciais

### **Erro de Conectividade:**
1. Verificar firewall: `sudo ufw status`
2. Verificar Nginx: `sudo nginx -t`
3. Verificar DNS
4. Verificar certificados SSL

### **Dados não aparecem:**
1. Verificar se planilha tem dados
2. Verificar permissões da service account
3. Verificar formato dos dados
4. Verificar logs de erro

---

## 📊 **MONITORAMENTO**

### **Logs da Aplicação:**
```bash
# PM2
pm2 logs arena-coligados

# Docker
docker logs arena-coligados

# Systemd
journalctl -u arena-coligados -f
```

### **Status dos Serviços:**
```bash
# PM2
pm2 status

# Docker
docker ps

# Systemd
systemctl status arena-coligados
```

### **Reiniciar Serviços:**
```bash
# PM2
pm2 restart arena-coligados

# Docker
docker restart arena-coligados

# Systemd
sudo systemctl restart arena-coligados
```

---

## 🎯 **RESULTADO ESPERADO**

Após seguir este plano, você deve ter:

✅ **VPS funcionando igual ao local**  
✅ **APIs respondendo em:** http://srv998805.hstgr.cloud  
✅ **Dashboard exibindo dados**  
✅ **Integração Google Sheets funcionando**  
✅ **Fluxo completo: Inserir → Ler → Exibir**  

---

## 📞 **PRÓXIMOS PASSOS**

1. **Conectar na VPS:** `ssh root@31.97.72.137`
2. **Executar os comandos da Fase 1** (verificar status)
3. **Configurar as variáveis de ambiente** (Fase 2)
4. **Testar as APIs** (Fase 3)
5. **Me informar o resultado** para ajustes finais

**Status:** ✅ Plano específico criado para sua VPS  
**Próximo:** ⚠️ Executar na VPS  
**Meta:** 🎯 VPS funcionando 100% em srv998805.hstgr.cloud
