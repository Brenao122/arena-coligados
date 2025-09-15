// setup-database.js
// Script para configurar o banco de dados Supabase

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configurações do Supabase
const supabaseUrl = 'https://fksahbiajrccraxvowtv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2FoYmlhanJjY3JheHZvd3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTM1MjQsImV4cCI6MjA3MDY4OTUyNH0.zW0CAWuOkZaRAXVcd0uNRADnf_ADMn9FjtCySFlLKeM'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  console.log('🚀 Configurando banco de dados Supabase...\n')

  try {
    // Ler o arquivo de migração
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '001_initial_schema.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

    console.log('📝 Aplicando migração inicial...')
    
    // Executar a migração
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL })
    
    if (error) {
      console.log('⚠️  Erro ao aplicar migração (pode ser normal se já existir):', error.message)
    } else {
      console.log('✅ Migração aplicada com sucesso!')
    }

    // Verificar se as tabelas existem
    console.log('\n🔍 Verificando estrutura das tabelas...')
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['profiles', 'quadras', 'reservas', 'leads'])

    if (tablesError) {
      console.log('❌ Erro ao verificar tabelas:', tablesError.message)
    } else {
      console.log('✅ Tabelas encontradas:', tables.map(t => t.table_name).join(', '))
    }

    // Popular dados de teste
    console.log('\n📊 Populando dados de teste...')
    
    // Inserir quadras
    const quadras = [
      { nome: 'Quadra 1', tipo: 'Futebol Society', capacidade: 14, preco_hora: 80.00, descricao: 'Quadra de futebol society com gramado sintético' },
      { nome: 'Quadra 2', tipo: 'Futebol Society', capacidade: 14, preco_hora: 80.00, descricao: 'Quadra de futebol society com gramado sintético' },
      { nome: 'Quadra 3', tipo: 'Futebol 7', capacidade: 16, preco_hora: 100.00, descricao: 'Quadra de futebol 7 com gramado natural' }
    ]

    const { data: quadrasData, error: quadrasError } = await supabase
      .from('quadras')
      .upsert(quadras, { onConflict: 'nome' })
      .select()

    if (quadrasError) {
      console.log('❌ Erro ao inserir quadras:', quadrasError.message)
    } else {
      console.log(`✅ ${quadrasData.length} quadras inseridas/atualizadas`)
    }

    // Inserir leads
    const leads = [
      { nome: 'João Silva', telefone: '(11) 99999-1111', interesse: 'Aula particular', origem: 'Facebook', status: 'novo' },
      { nome: 'Maria Santos', telefone: '(11) 99999-2222', interesse: 'Locação', origem: 'Instagram', status: 'contatado' },
      { nome: 'Pedro Costa', telefone: '(11) 99999-3333', interesse: 'Evento', origem: 'Indicação', status: 'novo' },
      { nome: 'Ana Oliveira', telefone: '(11) 99999-4444', interesse: 'Aula particular', origem: 'Google', status: 'convertido' },
      { nome: 'Carlos Lima', telefone: '(11) 99999-5555', interesse: 'Locação', origem: 'Facebook', status: 'novo' }
    ]

    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .upsert(leads, { onConflict: 'telefone' })
      .select()

    if (leadsError) {
      console.log('❌ Erro ao inserir leads:', leadsError.message)
    } else {
      console.log(`✅ ${leadsData.length} leads inseridos/atualizados`)
    }

    // Verificar dados finais
    console.log('\n📊 Verificando dados finais...')
    
    const { data: finalQuadras } = await supabase.from('quadras').select('*')
    const { data: finalLeads } = await supabase.from('leads').select('*')
    
    console.log(`✅ Quadras: ${finalQuadras?.length || 0}`)
    console.log(`✅ Leads: ${finalLeads?.length || 0}`)
    
    console.log('\n🎉 Configuração do banco concluída!')
    console.log('   Agora você pode acessar a plataforma e ver os dados.')

  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

// Executar configuração
setupDatabase()
