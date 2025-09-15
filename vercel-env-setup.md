# 🔧 CONFIGURAÇÃO DE VARIÁVEIS DE AMBIENTE NO VERCEL

## ❌ PROBLEMA IDENTIFICADO:
- APIs híbridas retornando 404 (não deployadas)
- Google Sheets API retornando 500 (variáveis de ambiente faltando)

## ✅ SOLUÇÃO:

### 1. CONFIGURAR VARIÁVEIS NO VERCEL:

Acesse: https://vercel.com/dashboard → Seu Projeto → Settings → Environment Variables

Adicione estas variáveis:

```
GOOGLE_SERVICE_EMAIL=arenasheets@credencial-n8n-471801.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----
SHEETS_SPREADSHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=production
```

### 2. REDEPLOY APÓS CONFIGURAR:

No Vercel Dashboard → Deployments → Redeploy

### 3. TESTAR APÓS REDEPLOY:

```bash
# APIs híbridas
curl https://arenacoligados.com.br/api/hybrid/dashboard
curl https://arenacoligados.com.br/api/hybrid/clientes
curl https://arenacoligados.com.br/api/hybrid/quadras

# Google Sheets direto
curl "https://arenacoligados.com.br/api/sheets/read?sheet=clientes"
```

## 🎯 RESULTADO ESPERADO:
- APIs híbridas: Status 200 + JSON com dados
- Google Sheets: Status 200 + dados da planilha
- UI populada com dados reais

## 📋 CHECKLIST:
- [ ] Variáveis configuradas no Vercel
- [ ] Redeploy realizado
- [ ] APIs testadas e funcionando
- [ ] UI populada com dados
