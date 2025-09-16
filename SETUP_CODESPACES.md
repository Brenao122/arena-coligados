# 🚀 Setup em Codespaces - Arena Coligados

## Instruções para rodar o projeto do zero em ambiente limpo

### 1. **Clone e Setup Inicial**
```bash
# Clone o repositório
git clone https://github.com/Brenao122/arena-coligados.git
cd arena-coligados

# Instale as dependências
npm install

# Verifique se tudo está funcionando
npm run verify
```

### 2. **Configuração de Variáveis de Ambiente**
Crie o arquivo `.env.local` com as seguintes variáveis:

```env
# Supabase (obrigatório)
NEXT_PUBLIC_SUPABASE_URL=https://fogtbptqvvhoqesljlen.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
SUPABASE_URL=https://fogtbptqvvhoqesljlen.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

# Site (obrigatório)
NEXT_PUBLIC_SITE_URL=https://arenacoligados.com.br
AUTH_COOKIE_DOMAIN=arenacoligados.com.br
AUTH_COOKIE_SECURE=true

# Google Sheets (opcional - para backup)
GOOGLE_SERVICE_EMAIL=seu_service_account@projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nsua_chave_privada_aqui\n-----END PRIVATE KEY-----"
SHEETS_SPREADSHEET_ID=id_da_sua_planilha
```

### 3. **Teste de Funcionamento**
```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Em outro terminal, teste as APIs
curl http://localhost:3000/api/test
curl http://localhost:3000/api/diag
curl http://localhost:3000/api/hybrid/dashboard
```

### 4. **Verificação de Saúde**
- ✅ Site carrega em `http://localhost:3000`
- ✅ Login funciona em `http://localhost:3000/login`
- ✅ Dashboard carrega após login
- ✅ APIs retornam dados corretos

### 5. **Build de Produção**
```bash
# Teste o build
npm run build

# Inicie em modo produção
npm run start
```

## ✅ **Checklist de Verificação**

- [ ] Dependências instaladas sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] Servidor de desenvolvimento inicia
- [ ] Site carrega corretamente
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] APIs respondem
- [ ] Build de produção funciona

## 🚨 **Problemas Comuns**

### **Erro de ENV**
- Verifique se todas as variáveis estão no `.env.local`
- Confirme que não há espaços extras nas chaves

### **Erro de Build**
- Execute `npm run type-check` para verificar tipos
- Execute `npm run lint` para verificar código

### **APIs não respondem**
- Verifique se o Supabase está configurado
- Confirme se as chaves estão corretas

## 📞 **Suporte**
Se encontrar problemas, verifique:
1. Logs do terminal
2. Console do navegador
3. Network tab do DevTools
