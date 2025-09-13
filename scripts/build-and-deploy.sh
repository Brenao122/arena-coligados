#!/bin/bash

echo "🚀 Iniciando processo de build e deploy do Arena Coligados..."

# 1. Verificar se as variáveis de ambiente estão configuradas
echo "📋 Verificando variáveis de ambiente..."
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "❌ Variáveis de ambiente do Supabase não encontradas!"
    echo "Certifique-se de configurar:"
    echo "- NEXT_PUBLIC_SUPABASE_URL"
    echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY"
    exit 1
fi

echo "✅ Variáveis de ambiente configuradas"

# 2. Limpar console.logs
echo "🧹 Limpando console.logs..."
node scripts/cleanup-production.js

# 3. Verificar conexão com Supabase
echo "🔍 Verificando conexão com Supabase..."
node scripts/verify-supabase-connection.js

if [ $? -ne 0 ]; then
    echo "❌ Falha na verificação do Supabase"
    exit 1
fi

# 4. Instalar dependências
echo "📦 Instalando dependências..."
npm install

# 5. Build do projeto
echo "🔨 Fazendo build do projeto..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Falha no build"
    exit 1
fi

echo "✅ Build concluído com sucesso!"

# 6. Deploy (se estiver no Vercel)
if [ ! -z "$VERCEL" ]; then
    echo "🚀 Deploy automático no Vercel..."
else
    echo "📋 Para fazer deploy:"
    echo "1. Faça push para o repositório"
    echo "2. O Vercel fará deploy automático"
    echo "3. Ou use: vercel --prod"
fi

echo "🎉 Processo concluído!"
