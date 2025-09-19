# 🔐 GUIA DE CONFIGURAÇÃO SEGURA - VPS ARENA COLIGADOS

## 🎯 **SITUAÇÃO ATUAL:**
- ✅ API rodando na VPS
- ✅ Plataforma funcionando localmente
- ⚠️ Precisa configurar variáveis de ambiente na VPS

## 🚀 **PASSOS PARA CONFIGURAR A VPS:**

### 1. **Verificar Status Atual da VPS**

Execute na VPS:
```bash
# Verificar se a API está rodando
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/sheets/read?sheet=Reservas

# Verificar containers Docker
docker ps

# Verificar processos Node.js
ps aux | grep node
```

### 2. **Obter Variáveis de Ambiente Necessárias**

Execute na VPS para encontrar as configurações:
```bash
# Procurar arquivos .env
find /srv /root /home -name "*.env" 2>/dev/null

# Procurar credenciais Google
find /root /srv /home -name "*credencial*" 2>/dev/null

# Verificar variáveis do sistema
env | grep -E "(GOOGLE|SUPABASE|NODE)"
```

### 3. **Configurar Variáveis de Ambiente**

#### **Opção A: Arquivo .env na VPS**
```bash
# Criar/editar arquivo .env
nano /srv/arena/.env

# Adicionar as variáveis (use o template env-template.txt)
```

#### **Opção B: Variáveis de Sistema**
```bash
# Exportar variáveis no sistema
export GOOGLE_SERVICE_ACCOUNT_EMAIL="arenasheets@credencial-n8n-471801.iam.gserviceaccount.com"
export GOOGLE_SHEETS_SPREADSHEET_ID="174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew"
# ... outras variáveis
```

### 4. **Testar Configuração**

```bash
# Testar API de leitura
curl "http://localhost:3000/api/sheets/read?sheet=Reservas"

# Testar API de dashboard
curl "http://localhost:3000/api/dashboard-simple"

# Testar inserção (exemplo)
curl -X POST "http://localhost:3000/api/sheets/append" \
  -H "Content-Type: application/json" \
  -d '{"sheet":"Reservas","values":["teste","cliente","quadra","professor","2024-01-15 10:00:00","2024-01-15 11:00:00","aula","pendente","50.00","Teste VPS","2024-01-15 09:00:00","individual"]}'
```

## 🔑 **VARIÁVEIS ESSENCIAIS:**

### **Google Sheets (OBRIGATÓRIAS):**
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SHEETS_SPREADSHEET_ID`

### **Supabase (OBRIGATÓRIAS):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### **Aplicação (OBRIGATÓRIAS):**
- `NEXT_PUBLIC_SITE_URL`
- `NODE_ENV=production`
- `PORT=3000`

## 🛡️ **SEGURANÇA:**

### **NUNCA FAÇA:**
- ❌ Cole chaves secretas em chats públicos
- ❌ Commite arquivos .env no Git
- ❌ Deixe credenciais em logs públicos

### **SEMPRE FAÇA:**
- ✅ Use secret manager do Cursor/Vercel
- ✅ Configure variáveis de ambiente na VPS
- ✅ Use HTTPS em produção
- ✅ Configure firewall adequadamente

## 🔧 **COMANDOS ÚTEIS:**

### **Verificar Logs:**
```bash
# Logs da aplicação
tail -f /var/log/arena/app.log

# Logs do Docker
docker logs nome_do_container -f

# Logs do sistema
journalctl -u arena-api -f
```

### **Reiniciar Serviços:**
```bash
# Reiniciar aplicação
systemctl restart arena-api

# Reiniciar container
docker restart nome_do_container

# Reiniciar nginx
systemctl restart nginx
```

### **Verificar Status:**
```bash
# Status dos serviços
systemctl status arena-api
systemctl status nginx

# Status dos containers
docker ps -a
```

## 📊 **TESTES DE FUNCIONALIDADE:**

### **1. Teste de Leitura:**
```bash
curl "http://localhost:3000/api/sheets/read?sheet=Reservas"
# Deve retornar: {"ok":true,"sheet":"Reservas","count":25,"values":[...]}
```

### **2. Teste de Dashboard:**
```bash
curl "http://localhost:3000/api/dashboard-simple"
# Deve retornar: {"ok":true,"data":{"total_clientes":7,"total_quadras":4,...}}
```

### **3. Teste de Inserção:**
```bash
curl -X POST "http://localhost:3000/api/sheets/append" \
  -H "Content-Type: application/json" \
  -d '{"sheet":"Reservas","values":["teste-vps","cliente","quadra","professor","2024-01-15 10:00:00","2024-01-15 11:00:00","aula","pendente","50.00","Teste VPS","2024-01-15 09:00:00","individual"]}'
# Deve retornar: {"ok":true,"message":"Dados adicionados com sucesso"}
```

## 🚨 **SOLUÇÃO DE PROBLEMAS:**

### **Erro 500 na API:**
1. Verificar variáveis de ambiente
2. Verificar logs da aplicação
3. Verificar conectividade com Google Sheets
4. Verificar credenciais

### **Erro de Conectividade:**
1. Verificar firewall
2. Verificar DNS
3. Verificar certificados SSL
4. Verificar proxy/nginx

### **Dados não aparecem:**
1. Verificar se planilha tem dados
2. Verificar permissões da service account
3. Verificar formato dos dados
4. Verificar logs de erro

## 📞 **PRÓXIMOS PASSOS:**

1. **Execute o script de verificação** na VPS
2. **Configure as variáveis de ambiente** necessárias
3. **Teste todas as APIs** para confirmar funcionamento
4. **Configure monitoramento** e logs
5. **Configure backup** das configurações

---

**Status:** ✅ Plataforma funcionando localmente  
**Próximo:** ⚠️ Configurar VPS com variáveis de ambiente  
**Meta:** 🎯 API funcionando 100% na VPS
