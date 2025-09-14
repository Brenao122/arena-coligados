# Configuração Google Sheets - Arena Coligados

## Variáveis de Ambiente Necessárias

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```bash
# Google Sheets Configuration
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCawgYIQEudz88x\nf/Uq0ubuJoncEZ0W6P0GdppirPS1cikKf/gFm74HozaPDi2AZtPMqtcr3RwlzJ8o\nhyCBLqCwowm9m7Q1qk8b+EVnIu0D4NVEYkaxml9R5Ex8bc0VBVhKime+wFhU7OUa\nrbHjG60WPwMAkXqOGtT9jKC22+Yv89ADC+U0p+3F7WbcW5Xif3+PYMDfM30/Cfdd\nP/WrqlWfdDDGKG57SKrMdMWZxinUg0S3UruZSWwKNxBLtGNS58pUiBRjObsy/rtJ\nvcNOTH3GgrDpludcYqqVXbJzh/cQd2M2kGCHI53yLvqhZLPawOpk3/cqa9PHKxbp\nNqqqYO9bAgMBAAECggEAQEKimJiCDZR1t1snpVGPvIHaKrxRm2rBbgafkqu4rQMr\nUYXTqhiCbs9x3zMG59NKzSh/UmJsxrFRwVVixOFkrhP0/nuB9+qxEK8lum7BNiQM\nyml4a1TrkaiXre82Ai2G/OS9sXJS+2imtU48mE4ssBkYGQtPdWRk3qefMG7dBTm1\nqI+6y6465P+8G1Xo+TMjqQ0z9HR4AmiOLGvv8LqWBHVepfXpzLHTDIqFPGHQYvYh\nt5TNtWMDQ8vHOn/mLtenD0J+CnIpgcf8Q6QUrEl4PBsPr6zjb6iS6/V5HaPM5k+h\nxPb8ZGwpF0Wp91gPdeOpWuIfJOlAxi2BSPgJ7rX98QKBgQDS+e3OADEog60fkJei\n1EyB81OCkddTMHD04bJvvqomc0//jxzdnUx5y8WBj/GOB6p1M88HOqA1Lfw1AJcS\nJgalspHgRoSup2F5heIrUQmUYig1/xWzdKOirQNCjezqm1+cY+QhgXQy+/vuv+T+\n5tvqxlcV82sje6paSjZcQIBdkwKBgQC7yMSnAo7ip4Owo0zGdsdaoHl0gpUVUxYy\nNx+RTWRdWi+yQsVQjaaM0G3sy9rd2clUSmXmTUAx4E/wJY87kboYLaK65AH5AcsN\nEa5N3bBx7HbkXVV1OWRNPlw24N18tDEcE02WPhhtI9++KG3tz4svXY3f72Z1niSi\noj5gWwiEGQKBgHhNH3bJ0T4i54MKNg0ZNY8cKtBXTQsYojBgyhjCBc/rDQDSoEkW\nOtdwhGy+oaS1ZlNyeWjL2zK3yAqJDZvBpySw0FGspFfbBc//sdm1WdsMpZU0oTE1\nH2HRefxnZWLZugk5RIp+gL3Zxex7654WEeyrsFjJ9pvDFn5pttmfxhKVAoGAPItM\nrDQs8XLlCKx98ncVa2jV//SiMI/rViFjsitrspWDT0wr5f7ltfz1lCVd2a2ANgcO\nt6QskGgsHddeSOyBPY5pKyycXjZvyzTqJ/zUCMcexh45kWQBrM3wWVlC0BQgyVaH\n62r14Spx1xOd7dC+pXTaa1r6g+2LDkyVI+f15PECgYEAu0GyPoIIkNvCxqmyiR6C\n6ni9EyiHSqyLXf5Md/6GMuKHXQwCCMgGKM71AsLe8g2EDyXLryrf91jMbQnlIKha\ntY5guBukQJkJK1AF3h+wmlus1loCb3arovJwf/dKjM/0/eIehgB7Ds27U/TxTb76\nswl0ESpjLR4aHSbFnzXL+6g=\n-----END PRIVATE KEY-----\n"
GOOGLE_SERVICE_ACCOUNT_EMAIL="arenasheets@credencial-n8n-471801.iam.gserviceaccount.com"
GOOGLE_SHEETS_SPREADSHEET_ID="174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew"

# Site URL for production
NEXT_PUBLIC_SITE_URL="https://arenacoligados.com.br"
```

## Configuração na Vercel

1. Acesse o painel da Vercel
2. Vá para Settings > Environment Variables
3. Adicione as seguintes variáveis:

### GOOGLE_PRIVATE_KEY
**IMPORTANTE**: Cole a chave EXATAMENTE como está no arquivo JSON, mas substitua todas as quebras de linha por `\n`:

```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCawgYIQEudz88x\nf/Uq0ubuJoncEZ0W6P0GdppirPS1cikKf/gFm74HozaPDi2AZtPMqtcr3RwlzJ8o\nhyCBLqCwowm9m7Q1qk8b+EVnIu0D4NVEYkaxml9R5Ex8bc0VBVhKime+wFhU7OUa\nrbHjG60WPwMAkXqOGtT9jKC22+Yv89ADC+U0p+3F7WbcW5Xif3+PYMDfM30/Cfdd\nP/WrqlWfdDDGKG57SKrMdMWZxinUg0S3UruZSWwKNxBLtGNS58pUiBRjObsy/rtJ\nvcNOTH3GgrDpludcYqqVXbJzh/cQd2M2kGCHI53yLvqhZLPawOpk3/cqa9PHKxbp\nNqqqYO9bAgMBAAECggEAQEKimJiCDZR1t1snpVGPvIHaKrxRm2rBbgafkqu4rQMr\nUYXTqhiCbs9x3zMG59NKzSh/UmJsxrFRwVVixOFkrhP0/nuB9+qxEK8lum7BNiQM\nyml4a1TrkaiXre82Ai2G/OS9sXJS+2imtU48mE4ssBkYGQtPdWRk3qefMG7dBTm1\nqI+6y6465P+8G1Xo+TMjqQ0z9HR4AmiOLGvv8LqWBHVepfXpzLHTDIqFPGHQYvYh\nt5TNtWMDQ8vHOn/mLtenD0J+CnIpgcf8Q6QUrEl4PBsPr6zjb6iS6/V5HaPM5k+h\nxPb8ZGwpF0Wp91gPdeOpWuIfJOlAxi2BSPgJ7rX98QKBgQDS+e3OADEog60fkJei\n1EyB81OCkddTMHD04bJvvqomc0//jxzdnUx5y8WBj/GOB6p1M88HOqA1Lfw1AJcS\nJgalspHgRoSup2F5heIrUQmUYig1/xWzdKOirQNCjezqm1+cY+QhgXQy+/vuv+T+\n5tvqxlcV82sje6paSjZcQIBdkwKBgQC7yMSnAo7ip4Owo0zGdsdaoHl0gpUVUxYy\nNx+RTWRdWi+yQsVQjaaM0G3sy9rd2clUSmXmTUAx4E/wJY87kboYLaK65AH5AcsN\nEa5N3bBx7HbkXVV1OWRNPlw24N18tDEcE02WPhhtI9++KG3tz4svXY3f72Z1niSi\noj5gWwiEGQKBgHhNH3bJ0T4i54MKNg0ZNY8cKtBXTQsYojBgyhjCBc/rDQDSoEkW\nOtdwhGy+oaS1ZlNyeWjL2zK3yAqJDZvBpySw0FGspFfbBc//sdm1WdsMpZU0oTE1\nH2HRefxnZWLZugk5RIp+gL3Zxex7654WEeyrsFjJ9pvDFn5pttmfxhKVAoGAPItM\nrDQs8XLlCKx98ncVa2jV//SiMI/rViFjsitrspWDT0wr5f7ltfz1lCVd2a2ANgcO\nt6QskGgsHddeSOyBPY5pKyycXjZvyzTqJ/zUCMcexh45kWQBrM3wWVlC0BQgyVaH\n62r14Spx1xOd7dC+pXTaa1r6g+2LDkyVI+f15PECgYEAu0GyPoIIkNvCxqmyiR6C\n6ni9EyiHSqyLXf5Md/6GMuKHXQwCCMgGKM71AsLe8g2EDyXLryrf91jMbQnlIKha\ntY5guBukQJkJK1AF3h+wmlus1loCb3arovJwf/dKjM/0/eIehgB7Ds27U/TxTb76\nswl0ESpjLR4aHSbFnzXL+6g=\n-----END PRIVATE KEY-----\n
```

### GOOGLE_SERVICE_ACCOUNT_EMAIL
```
arenasheets@credencial-n8n-471801.iam.gserviceaccount.com
```

### GOOGLE_SHEETS_SPREADSHEET_ID
```
174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew
```

### NEXT_PUBLIC_SITE_URL
```
https://arenacoligados.com.br
```

## Estrutura da Planilha Esperada

A planilha deve ter as seguintes abas:

- **Reservas** - Dados das reservas
- **Clientes** - Dados dos clientes  
- **Quadras** - Dados das quadras
- **Professores** - Dados dos professores
- **Usuarios** - Dados dos usuários
- **Leads** - Dados dos leads

## Teste das APIs

Após configurar as variáveis, teste:

1. **Ping**: `GET /api/sheets/ping`
2. **Read**: `GET /api/sheets/read?sheet=Reservas`
3. **Append**: `POST /api/sheets/append`

## Logs de Debug

As APIs agora incluem logs detalhados para facilitar o debugging em produção.
