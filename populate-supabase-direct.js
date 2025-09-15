// populate-supabase-direct.js
// Script para popular dados diretamente no Supabase

const { createClient } = require('@supabase/supabase-js')

// Configurações do Supabase
const supabaseUrl = 'https://fksahbiajrccraxvowtv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2FoYmlhanJjY3JheHZvd3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTM1MjQsImV4cCI6MjA3MDY4OTUyNH0.zW0CAWuOkZaRAXVcd0uNRADnf_ADMn9FjtCySFlLKeM'

const supabase = createClient(supabaseUrl, supabaseKey)

async function populateSupabase() {
  console.log('🚀 Populando dados diretamente no Supabase...\n')

  try {
    // 1. Inserir quadras
    console.log('🏟️ Inserindo quadras...')
    const quadras = [
      { nome: 'Quadra 1', tipo: 'Futebol Society', capacidade: 14, preco_hora: 80.00, descricao: 'Quadra de futebol society com gramado sintético', ativo: true },
      { nome: 'Quadra 2', tipo: 'Futebol Society', capacidade: 14, preco_hora: 80.00, descricao: 'Quadra de futebol society com gramado sintético', ativo: true },
      { nome: 'Quadra 3', tipo: 'Futebol 7', capacidade: 16, preco_hora: 100.00, descricao: 'Quadra de futebol 7 com gramado natural', ativo: true }
    ]

    const { data: quadrasData, error: quadrasError } = await supabase
      .from('quadras')
      .insert(quadras)
      .select()

    if (quadrasError) {
      console.log('❌ Erro ao inserir quadras:', quadrasError.message)
    } else {
      console.log(`✅ ${quadrasData.length} quadras inseridas`)
    }

    // 2. Inserir leads
    console.log('\n🎯 Inserindo leads...')
    const leads = [
      { nome: 'João Silva', telefone: '(11) 99999-1111', interesse: 'Aula particular', origem: 'Facebook', status: 'novo' },
      { nome: 'Maria Santos', telefone: '(11) 99999-2222', interesse: 'Locação', origem: 'Instagram', status: 'contatado' },
      { nome: 'Pedro Costa', telefone: '(11) 99999-3333', interesse: 'Evento', origem: 'Indicação', status: 'novo' },
      { nome: 'Ana Oliveira', telefone: '(11) 99999-4444', interesse: 'Aula particular', origem: 'Google', status: 'convertido' },
      { nome: 'Carlos Lima', telefone: '(11) 99999-5555', interesse: 'Locação', origem: 'Facebook', status: 'novo' }
    ]

    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .insert(leads)
      .select()

    if (leadsError) {
      console.log('❌ Erro ao inserir leads:', leadsError.message)
    } else {
      console.log(`✅ ${leadsData.length} leads inseridos`)
    }

    // 3. Inserir profiles (clientes e professores)
    console.log('\n👥 Inserindo profiles...')
    const profiles = [
      { id: 'cliente-001', email: 'joao@email.com', full_name: 'João Silva', phone: '(11) 99999-1111' },
      { id: 'cliente-002', email: 'maria@email.com', full_name: 'Maria Santos', phone: '(11) 99999-2222' },
      { id: 'cliente-003', email: 'pedro@email.com', full_name: 'Pedro Costa', phone: '(11) 99999-3333' },
      { id: 'cliente-004', email: 'ana@email.com', full_name: 'Ana Oliveira', phone: '(11) 99999-4444' },
      { id: 'cliente-005', email: 'carlos@email.com', full_name: 'Carlos Lima', phone: '(11) 99999-5555' },
      { id: 'prof-001', email: 'professor1@arena.com', full_name: 'Professor N8N', phone: '(11) 99999-9999' },
      { id: 'prof-002', email: 'professor2@arena.com', full_name: 'Professor Arena', phone: '(11) 88888-8888' }
    ]

    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .insert(profiles)
      .select()

    if (profilesError) {
      console.log('❌ Erro ao inserir profiles:', profilesError.message)
    } else {
      console.log(`✅ ${profilesData.length} profiles inseridos`)
    }

    // 4. Inserir reservas
    console.log('\n📅 Inserindo reservas...')
    const reservas = [
      { 
        cliente_id: 'cliente-001', 
        quadra_id: quadrasData?.[0]?.id || 'quadra-1', 
        professor_id: 'prof-001',
        tipo: 'locacao',
        data_inicio: '2024-01-20T10:00:00Z',
        data_fim: '2024-01-20T12:00:00Z',
        valor_total: 160.00,
        status: 'confirmada'
      },
      { 
        cliente_id: 'cliente-002', 
        quadra_id: quadrasData?.[1]?.id || 'quadra-2', 
        professor_id: 'prof-002',
        tipo: 'locacao',
        data_inicio: '2024-01-21T14:00:00Z',
        data_fim: '2024-01-21T16:00:00Z',
        valor_total: 160.00,
        status: 'pendente'
      },
      { 
        cliente_id: 'cliente-003', 
        quadra_id: quadrasData?.[2]?.id || 'quadra-3', 
        professor_id: 'prof-001',
        tipo: 'aula_particular',
        data_inicio: '2024-01-22T18:00:00Z',
        data_fim: '2024-01-22T20:00:00Z',
        valor_total: 200.00,
        status: 'confirmada'
      }
    ]

    const { data: reservasData, error: reservasError } = await supabase
      .from('reservas')
      .insert(reservas)
      .select()

    if (reservasError) {
      console.log('❌ Erro ao inserir reservas:', reservasError.message)
    } else {
      console.log(`✅ ${reservasData.length} reservas inseridas`)
    }

    // 5. Verificar dados finais
    console.log('\n📊 Verificando dados inseridos...')
    
    const { data: finalQuadras } = await supabase.from('quadras').select('*')
    const { data: finalLeads } = await supabase.from('leads').select('*')
    const { data: finalProfiles } = await supabase.from('profiles').select('*')
    const { data: finalReservas } = await supabase.from('reservas').select('*')
    
    console.log(`✅ Quadras: ${finalQuadras?.length || 0}`)
    console.log(`✅ Leads: ${finalLeads?.length || 0}`)
    console.log(`✅ Profiles: ${finalProfiles?.length || 0}`)
    console.log(`✅ Reservas: ${finalReservas?.length || 0}`)
    
    console.log('\n🎉 Dados populados com sucesso no Supabase!')

  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

populateSupabase()
