# QA Artifacts - Arena Coligados

Este diretório contém todos os artefatos de Quality Assurance (QA) e testes automatizados.

## Estrutura de Diretórios

\`\`\`
qa-artifacts/
├── screens/          # Screenshots dos testes
├── videos/           # Vídeos dos testes
├── seeds/            # Dados de teste (JSON)
├── report/           # Relatórios HTML do Playwright
├── .output/          # Artefatos temporários dos testes
└── README.md         # Este arquivo
\`\`\`

## Comandos Disponíveis

### PowerShell (Windows)
\`\`\`powershell
# Criar diretórios manualmente (se necessário)
@(
  "qa-artifacts",
  "qa-artifacts/screens",
  "qa-artifacts/videos",
  "qa-artifacts/seeds",
  "qa-artifacts/report",
  "qa-artifacts/.output",
  "e2e"
) | ForEach-Object { New-Item -ItemType Directory -Path $_ -Force | Out-Null }

# Executar testes
npm run qa:run
\`\`\`

### Bash (macOS/Linux/Git Bash)
\`\`\`bash
# Criar diretórios manualmente (se necessário)
mkdir -p qa-artifacts/screens qa-artifacts/videos qa-artifacts/seeds qa-artifacts/report qa-artifacts/.output e2e

# Executar testes
npm run qa:run
\`\`\`

## Scripts NPM

- `npm run qa:init` - Cria todos os diretórios de QA
- `npm run qa:test` - Executa testes Playwright
- `npm run qa:run` - Inicializa QA e executa testes

## Fluxo Recomendado

1. **Garantir pastas (portável):**
   \`\`\`bash
   npm run qa:init
   \`\`\`

2. **Rodar testes:**
   \`\`\`bash
   npm run qa:run
   \`\`\`

3. **Ver evidências:**
   - Relatório HTML: `qa-artifacts/report/index.html`
   - Saída bruta dos testes: `qa-artifacts/.output`
   - Screenshots: `qa-artifacts/screens/`
   - Vídeos: `qa-artifacts/videos/`

## Testes Disponíveis

- **login-crm.spec.ts** - Testa fluxo de login → redirecionamento para CRM
  - Login válido redireciona para /crm
  - Login inválido permanece em /login
  - Acesso direto a /crm sem sessão redireciona para /login
  - Validação de campos obrigatórios
  - Página CRM carrega corretamente

## Solução Cross-Platform

O script `tools/ensureQaArtifacts.mjs` garante que todos os diretórios sejam criados independentemente do sistema operacional (Windows, macOS, Linux).

## Troubleshooting

### Erro: "mkdir -p não funciona no PowerShell"
**Solução:** Use `npm run qa:init` que executa o script Node.js cross-platform.

### Erro: "Playwright não instalado"
**Solução:** Execute `npx playwright install` para instalar os navegadores.

### Erro: "Porta 3000 em uso"
**Solução:** O Playwright tentará usar uma porta disponível automaticamente.
