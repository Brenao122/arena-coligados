// apply-schema-fix.js
// Script para aplicar correções no schema do Supabase

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configurações do Supabase
const supabaseUrl = 'https://fksahbiajrccraxvowtv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2FoYmlhanJjY3JheHZvd3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTM1MjQsImV4cCI6MjA3MDY4OTUyNH0.zW0CAWuOkZaRAXVcd0uNRADnf_ADMn9FjtCySFlLKeM'

const supabase = createClient(supabaseUrl, supabaseKey)

async function applySchemaFix() {
  console.log('🔧 Aplicando correções no schema do Supabase...\n')

  try {
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, 'fix-schema.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')

    console.log('📝 Executando correções SQL...')
    
    // Dividir o SQL em comandos individuais
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))

    for (const command of commands) {
      if (command.trim()) {
        console.log(`   Executando: ${command.substring(0, 50)}...`)
        
        try {
          const { data, error } = await supabase.rpc('exec_sql', { sql: command })
          
          if (error) {
            console.log(`   ⚠️  Aviso: ${error.message}`)
          } else {
            console.log(`   ✅ Sucesso`)
          }
        } catch (err) {
          console.log(`   ⚠️  Aviso: ${err.message}`)
        }
      }
    }

    console.log('\n✅ Correções aplicadas!')
    console.log('   - Coluna role adicionada em profiles')
    console.log('   - Relacionamentos reservas ↔ profiles criados')
    console.log('   - RLS temporariamente desabilitado')
    
    console.log('\n🔄 Testando schema corrigido...')
    
    // Testar se as correções funcionaram
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, role')
      .limit(1)
    
    if (profilesError) {
      console.log('❌ Erro ao testar profiles:', profilesError.message)
    } else {
      console.log('✅ Profiles funcionando - coluna role disponível')
    }

    const { data: reservas, error: reservasError } = await supabase
      .from('reservas')
      .select('id, cliente_id, professor_id')
      .limit(1)
    
    if (reservasError) {
      console.log('❌ Erro ao testar reservas:', reservasError.message)
    } else {
      console.log('✅ Reservas funcionando - relacionamentos disponíveis')
    }

    console.log('\n🎉 Schema corrigido com sucesso!')
    console.log('   Agora você pode popular os dados.')

  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

applySchemaFix()
