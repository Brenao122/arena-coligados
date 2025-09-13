# 🔄 GUIA DE TESTE - SINCRONIZAÇÃO COM PLANILHA

## ✅ **CONFIGURAÇÃO ATUAL:**

### **Planilha Configurada:**
- **URL:** https://docs.google.com/spreadsheets/d/174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew/edit
- **ID:** `174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew`
- **Status:** ✅ **CONFIGURADA E FUNCIONANDO**

### **Abas Disponíveis:**
- ✅ `leads` - 2 linhas (1 lead de exemplo)
- ✅ `clientes` - 2 linhas (1 cliente de exemplo)  
- ✅ `quadras` - 3 linhas (2 quadras de exemplo)
- ✅ `professores` - 2 linhas (1 professor de exemplo)
- ✅ `Página1` - 21 linhas (dados reais de reservas)
- ✅ `pagamentos` - 1 linha (estrutura criada)
- ✅ `avaliacoes` - 1 linha (estrutura criada)
- ✅ `usuarios` - 7 linhas (dados de usuários)

## 🔧 **BOTÕES DE SINCRONIZAÇÃO:**

### **1. Dashboard Admin (Principal)**
- **Localização:** Canto superior direito
- **Botão:** "Sincronizar" com ícone de refresh
- **Função:** Sincroniza todos os dados do dashboard

### **2. Páginas Individuais**
- **Leads:** Refresh automático ao carregar
- **Reservas:** Refresh automático ao carregar  
- **Clientes:** Refresh automático ao carregar
- **Quadras:** Refresh automático ao carregar
- **Professores:** Refresh automático ao carregar

### **3. Página de Diagnóstico**
- **Localização:** `/dashboard/diagnostico`
- **Botão:** "Executar Diagnóstico"
- **Função:** Testa todas as conexões

## 🧪 **COMO TESTAR SINCRONIZAÇÃO:**

### **TESTE 1: Adicionar Novo Lead**
1. **Abra a planilha:** https://docs.google.com/spreadsheets/d/174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew/edit
2. **Vá para a aba "leads"**
3. **Adicione uma nova linha:**
   ```
   lead-2 | João Silva | 5562999888777 | joao@email.com | whatsapp | Aulas de tênis | novo | Interessado em aulas particulares | 2024-01-15 | 2024-01-15
   ```
4. **Inicie o servidor:** `npm run dev`
5. **Acesse:** http://localhost:3000/dashboard/leads
6. **Clique em "Sincronizar"** no dashboard admin
7. **Verifique:** O novo lead deve aparecer na lista

### **TESTE 2: Adicionar Novo Cliente**
1. **Vá para a aba "clientes"**
2. **Adicione uma nova linha:**
   ```
   cliente-2 | Maria Santos | 5562888777666 | maria@email.com | Rua das Flores, 123 | 1990-05-20 | ativo | 2024-01-15 | 2024-01-15
   ```
3. **Acesse:** http://localhost:3000/dashboard/clientes
4. **Clique em "Sincronizar"** no dashboard admin
5. **Verifique:** O novo cliente deve aparecer na lista

### **TESTE 3: Adicionar Nova Reserva**
1. **Vá para a aba "Página1"**
2. **Adicione uma nova linha:**
   ```
   Ana Costa | 5562777666555 | ana@email.com | 2024-01-20 | 14:00 | Aula de Tênis | Confirmada
   ```
3. **Acesse:** http://localhost:3000/dashboard/reservas
4. **Clique em "Sincronizar"** no dashboard admin
5. **Verifique:** A nova reserva deve aparecer na lista

### **TESTE 4: Adicionar Nova Quadra**
1. **Vá para a aba "quadras"**
2. **Adicione uma nova linha:**
   ```
   quadra-3 | Quadra de Vôlei | Vôlei | 40 | 12 | true | Quadra de vôlei coberta | /volei-court.png | Rede, Bolas | 2024-01-15 | 2024-01-15
   ```
3. **Acesse:** http://localhost:3000/dashboard/quadras
4. **Clique em "Sincronizar"** no dashboard admin
5. **Verifique:** A nova quadra deve aparecer na lista

## ⚠️ **IMPORTANTE - SINCRONIZAÇÃO:**

### **Como Funciona:**
- ❌ **NÃO é automática** - mudanças na planilha não aparecem instantaneamente
- ✅ **É sob demanda** - dados são buscados quando solicitado
- 🔄 **Requer ação manual** - clique em "Sincronizar" ou recarregue a página

### **Para Sincronização Automática:**
- Seria necessário implementar **Webhooks do Google Sheets**
- Ou usar **polling** (verificação periódica)
- Atualmente não está implementado

## 🚀 **COMANDOS PARA TESTAR:**

### **1. Verificar Conexão:**
```bash
node test-google-sheets.js
```

### **2. Testar Sincronização:**
```bash
node test-sincronizacao-automatica.js
```

### **3. Iniciar Servidor:**
```bash
npm run dev
```

### **4. Testar APIs:**
```bash
node test-apis-sheets.js
```

## 📊 **URLs PARA TESTAR:**

- **Dashboard Admin:** http://localhost:3000/dashboard/dashboard-admin
- **Leads:** http://localhost:3000/dashboard/leads
- **Clientes:** http://localhost:3000/dashboard/clientes
- **Reservas:** http://localhost:3000/dashboard/reservas
- **Quadras:** http://localhost:3000/dashboard/quadras
- **Professores:** http://localhost:3000/dashboard/professores
- **Diagnóstico:** http://localhost:3000/dashboard/diagnostico

## 🎯 **RESULTADO ESPERADO:**

✅ **Planilha configurada corretamente**
✅ **Todas as abas acessíveis**
✅ **APIs funcionando**
✅ **Botões de sincronização funcionais**
✅ **Dados aparecem após sincronização**

**Status:** 🟢 **PRONTO PARA TESTE**
