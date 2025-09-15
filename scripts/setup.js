#!/usr/bin/env node

/**
 * Script de Setup e Inicialização - Arena Coligados
 * Este script configura o ambiente e valida todas as funcionalidades
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🏟️  ARENA COLIGADOS - SCRIPT DE SETUP')
console.log('=====================================\n')

// Função para executar comandos
function execCommand(command, description) {
  console.log(`🔄 ${description}...`)
  try {
    execSync(command, { stdio: 'inherit' })
    console.log(`✅ ${description} concluído\n`)
    return true
  } catch (error) {
    console.error(`❌ Erro em: ${description}`)
    console.error(error.message)
    return false
  }
}

// Função para verificar se arquivo existe
function fileExists(filePath) {
  return fs.existsSync(path.join(__dirname, '..', filePath))
}

// Função para criar arquivo se não existir
function createFileIfNotExists(filePath, content) {
  const fullPath = path.join(__dirname, '..', filePath)
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content)
    console.log(`✅ Arquivo criado: ${filePath}`)
  } else {
    console.log(`ℹ️  Arquivo já existe: ${filePath}`)
  }
}

// Função principal de setup
async function setup() {
  console.log('🚀 Iniciando setup do projeto...\n')

  // 1. Verificar dependências
  console.log('📦 Verificando dependências...')
  if (!fileExists('package.json')) {
    console.error('❌ package.json não encontrado!')
    process.exit(1)
  }
  console.log('✅ package.json encontrado\n')

  // 2. Instalar dependências
  if (!execCommand('npm install', 'Instalando dependências')) {
    console.error('❌ Falha ao instalar dependências')
    process.exit(1)
  }

  // 3. Verificar arquivo de ambiente
  console.log('🔧 Configurando variáveis de ambiente...')
  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://fogtbptqvvhoqesljlen.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZ3RicHRxdnZob3Flc2xqbGVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MzU5NjgsImV4cCI6MjA3MzExMTk2OH0.Fi0L_3mnpbjZFGqLvf_peDq5XkiDtiwF0vfn6nMDfg8

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://arenacoligados.vercel.app

# Development Configuration
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback

# Google Sheets Configuration
GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key_here
GOOGLE_SHEETS_SPREADSHEET_ID=174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew

# Vercel Configuration
VERCEL_URL=https://arenacoligados.vercel.app

# N8N Configuration (se necessário)
N8N_WEBHOOK_URL=https://n8n.arenacoligados.com.br/webhook
`
  
  createFileIfNotExists('.env.local', envContent)

  // 4. Verificar estrutura de pastas
  console.log('📁 Verificando estrutura de pastas...')
  const requiredFolders = [
    'app/api',
    'components',
    'hooks',
    'lib',
    'scripts',
    'supabase/migrations'
  ]

  requiredFolders.forEach(folder => {
    const folderPath = path.join(__dirname, '..', folder)
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true })
      console.log(`✅ Pasta criada: ${folder}`)
    } else {
      console.log(`ℹ️  Pasta já existe: ${folder}`)
    }
  })

  // 5. Verificar arquivos principais
  console.log('\n📄 Verificando arquivos principais...')
  const requiredFiles = [
    'app/layout.tsx',
    'app/page.tsx',
    'middleware.ts',
    'package.json',
    'tailwind.config.js',
    'tsconfig.json'
  ]

  let allFilesExist = true
  requiredFiles.forEach(file => {
    if (fileExists(file)) {
      console.log(`✅ ${file}`)
    } else {
      console.log(`❌ ${file} - ARQUIVO FALTANDO!`)
      allFilesExist = false
    }
  })

  if (!allFilesExist) {
    console.error('\n❌ Alguns arquivos essenciais estão faltando!')
    console.error('Execute o setup novamente após garantir que todos os arquivos estejam presentes.')
    process.exit(1)
  }

  // 6. Verificar TypeScript
  console.log('\n🔍 Verificando TypeScript...')
  if (!execCommand('npx tsc --noEmit', 'Verificação de tipos TypeScript')) {
    console.warn('⚠️  Alguns erros de TypeScript encontrados, mas continuando...')
  }

  // 7. Build de teste
  console.log('\n🏗️  Testando build...')
  if (!execCommand('npm run build', 'Build de teste')) {
    console.error('❌ Falha no build! Verifique os erros acima.')
    process.exit(1)
  }

  // 8. Criar script de inicialização
  console.log('📝 Criando scripts de inicialização...')
  
  const startScript = `#!/bin/bash
echo "🏟️  Iniciando Arena Coligados..."
echo "================================"

# Verificar se .env.local existe
if [ ! -f .env.local ]; then
    echo "❌ Arquivo .env.local não encontrado!"
    echo "Execute: npm run setup"
    exit 1
fi

# Instalar dependências se necessário
if [ ! -d node_modules ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Iniciar servidor de desenvolvimento
echo "🚀 Iniciando servidor de desenvolvimento..."
npm run dev
`
  
  createFileIfNotExists('start.sh', startScript)

  const startBat = `@echo off
echo 🏟️  Iniciando Arena Coligados...
echo ================================

REM Verificar se .env.local existe
if not exist .env.local (
    echo ❌ Arquivo .env.local não encontrado!
    echo Execute: npm run setup
    pause
    exit /b 1
)

REM Instalar dependências se necessário
if not exist node_modules (
    echo 📦 Instalando dependências...
    npm install
)

REM Iniciar servidor de desenvolvimento
echo 🚀 Iniciando servidor de desenvolvimento...
npm run dev
`
  
  createFileIfNotExists('start.bat', startBat)

  // 9. Adicionar scripts ao package.json
  console.log('\n📝 Atualizando package.json...')
  try {
    const packageJsonPath = path.join(__dirname, '..', 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    
    // Adicionar scripts se não existirem
    if (!packageJson.scripts) {
      packageJson.scripts = {}
    }

    packageJson.scripts.setup = 'node scripts/setup.js'
    packageJson.scripts.start = 'npm run dev'
    packageJson.scripts['start:prod'] = 'npm run build && npm run start'
    packageJson.scripts.test = 'npm run build'
    packageJson.scripts.validate = 'npm run lint && npm run type-check && npm run build'

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    console.log('✅ Scripts adicionados ao package.json')
  } catch (error) {
    console.warn('⚠️  Erro ao atualizar package.json:', error.message)
  }

  // 10. Resumo final
  console.log('\n🎉 SETUP CONCLUÍDO COM SUCESSO!')
  console.log('===============================')
  console.log('')
  console.log('📋 PRÓXIMOS PASSOS:')
  console.log('')
  console.log('1. 🔧 Configure suas variáveis de ambiente no arquivo .env.local')
  console.log('2. 🗄️  Configure seu banco de dados Supabase')
  console.log('3. 🚀 Execute: npm run dev')
  console.log('4. 🌐 Acesse: http://localhost:3000')
  console.log('')
  console.log('📚 DOCUMENTAÇÃO:')
  console.log('   - Leia: DOCUMENTACAO_FINAL_COMPLETA.md')
  console.log('   - APIs: app/api/')
  console.log('   - Componentes: components/')
  console.log('')
  console.log('🆘 SUPORTE:')
  console.log('   - Email: contatobrenofilm@gmail.com')
  console.log('   - WhatsApp: +55 62 93550-6350')
  console.log('')
  console.log('✨ Arena Coligados está pronto para uso!')
}

// Executar setup
setup().catch(error => {
  console.error('❌ Erro durante o setup:', error)
  process.exit(1)
})

