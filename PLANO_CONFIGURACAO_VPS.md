# 🚀 PLANO COMPLETO - CONFIGURAR VPS ARENA COLIGADOS

## 📋 **CHECKLIST DE CONFIGURAÇÃO**

### **FASE 1: PREPARAÇÃO DA VPS**
- [ ] 1.1 Conectar na VPS via SSH
- [ ] 1.2 Verificar IP público da VPS
- [ ] 1.3 Instalar Docker (se necessário)
- [ ] 1.4 Instalar Node.js e npm (se necessário)
- [ ] 1.5 Configurar firewall (portas 80, 443, 3000)

### **FASE 2: CONFIGURAÇÃO DA APLICAÇÃO**
- [ ] 2.1 Fazer upload do código para VPS
- [ ] 2.2 Configurar variáveis de ambiente
- [ ] 2.3 Instalar dependências
- [ ] 2.4 Configurar proxy reverso (Nginx)

### **FASE 3: TESTES E VALIDAÇÃO**
- [ ] 3.1 Testar APIs localmente na VPS
- [ ] 3.2 Testar APIs externamente
- [ ] 3.3 Verificar dashboard funcionando
- [ ] 3.4 Configurar SSL/HTTPS

---

## 🔧 **COMANDOS PARA EXECUTAR NA VPS**

### **1. VERIFICAR STATUS DA VPS**
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
```

### **2. INSTALAR DEPENDÊNCIAS (se necessário)**
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

### **3. CONFIGURAR APLICAÇÃO**
```bash
# Criar diretório da aplicação
sudo mkdir -p /srv/arena-coligados
cd /srv/arena-coligados

# Fazer upload do código (via Git ou SCP)
git clone <seu-repositorio> .
# OU
# scp -r ./arenacoligados/* user@vps:/srv/arena-coligados/

# Instalar dependências
npm install
```

### **4. CONFIGURAR VARIÁVEIS DE AMBIENTE**
```bash
# Criar arquivo .env
sudo nano /srv/arena-coligados/.env

# Adicionar as variáveis (use o template env-template.txt)
```

### **5. CONFIGURAR NGINX (PROXY REVERSO)**
```bash
# Criar configuração do Nginx
sudo nano /etc/nginx/sites-available/arena-coligados

# Conteúdo da configuração:
server {
    listen 80;
    server_name SEU_DOMINIO_AQUI;
    
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

### **6. INICIAR APLICAÇÃO**
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
curl "http://SEU_IP_PUBLICO/api/sheets/read?sheet=Reservas"

# Testar via domínio
curl "http://SEU_DOMINIO/api/sheets/read?sheet=Reservas"
```

### **3. TESTE DO DASHBOARD**
```bash
# Acessar dashboard via navegador
http://SEU_DOMINIO/dashboard/dashboard-admin
```

---

## 🔐 **VARIÁVEIS DE AMBIENTE NECESSÁRIAS**

### **OBRIGATÓRIAS:**
```bash
# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL=arenasheets@credencial-n8n-471801.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n<SUA_CHAVE_AQUI>\n-----END PRIVATE KEY-----"
GOOGLE_SHEETS_SPREADSHEET_ID=174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://fogtbptqvvhoqesljlen.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUA_CHAVE_AQUI>
SUPABASE_URL=https://fogtbptqvvhoqesljlen.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<SUA_CHAVE_AQUI>

# Aplicação
NEXT_PUBLIC_SITE_URL=https://SEU_DOMINIO
NODE_ENV=production
PORT=3000
```

### **OPCIONAIS:**
```bash
# Segurança
JWT_SECRET=<SEU_JWT_SECRET>
AUTH_COOKIE_SECURE=true
AUTH_COOKIE_DOMAIN=SEU_DOMINIO

# Monitoramento
SENTRY_DSN=<SENTRY_DSN>

# Email
MAILER_SMTP_HOST=<SMTP_HOST>
MAILER_SMTP_USER=<SMTP_USER>
MAILER_SMTP_PASS=<SMTP_PASS>
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
✅ **APIs respondendo corretamente**  
✅ **Dashboard exibindo dados**  
✅ **Integração Google Sheets funcionando**  
✅ **Fluxo completo: Inserir → Ler → Exibir**  

---

## 📞 **PRÓXIMOS PASSOS**

1. **Execute os comandos da Fase 1** na VPS
2. **Configure as variáveis de ambiente** (Fase 2)
3. **Teste as APIs** (Fase 3)
4. **Me informe o resultado** para ajustes finais

**Status:** ✅ Plano completo criado  
**Próximo:** ⚠️ Executar na VPS  
**Meta:** 🎯 VPS funcionando 100%
