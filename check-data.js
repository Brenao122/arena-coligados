// check-data.js
// Script para verificar dados no Supabase

const { createClient } = require('@supabase/supabase-js')

// Configurações do Supabase
const supabaseUrl = 'https://fksahbiajrccraxvowtv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2FoYmlhanJjY3JheHZvd3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTM1MjQsImV4cCI6MjA3MDY4OTUyNH0.zW0CAWuOkZaRAXVcd0uNRADnf_ADMn9FjtCySFlLKeM'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkData() {
  console.log('🔍 Verificando dados no Supabase...\n')

  try {
    // Verificar quadras
    console.log('🏟️ Verificando QUADRAS...')
    const { data: quadras, error: quadrasError } = await supabase
      .from('quadras')
      .select('*')
    
    if (quadrasError) {
      console.log('❌ Erro ao buscar quadras:', quadrasError.message)
    } else {
      console.log(`✅ Quadras encontradas: ${quadras.length}`)
      quadras.forEach(q => {
        console.log(`   - ${q.nome} (${q.tipo}) - R$ ${q.preco_hora}/h - ${q.ativo ? 'Ativa' : 'Inativa'}`)
      })
    }
    console.log('')

    // Verificar clientes
    console.log('👥 Verificando CLIENTES...')
    const { data: clientes, error: clientesError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'cliente')
    
    if (clientesError) {
      console.log('❌ Erro ao buscar clientes:', clientesError.message)
    } else {
      console.log(`✅ Clientes encontrados: ${clientes.length}`)
      clientes.forEach(c => {
        console.log(`   - ${c.nome} (${c.email}) - ${c.telefone}`)
      })
    }
    console.log('')

    // Verificar professores
    console.log('👨‍🏫 Verificando PROFESSORES...')
    const { data: professores, error: professoresError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'professor')
    
    if (professoresError) {
      console.log('❌ Erro ao buscar professores:', professoresError.message)
    } else {
      console.log(`✅ Professores encontrados: ${professores.length}`)
      professores.forEach(p => {
        console.log(`   - ${p.nome} (${p.email}) - ${p.telefone}`)
      })
    }
    console.log('')

    // Verificar reservas
    console.log('📅 Verificando RESERVAS...')
    const { data: reservas, error: reservasError } = await supabase
      .from('reservas')
      .select(`
        *,
        cliente:profiles!reservas_cliente_id_fkey(nome),
        quadra:quadras!reservas_quadra_id_fkey(nome, tipo),
        professor:profiles!reservas_professor_id_fkey(nome)
      `)
    
    if (reservasError) {
      console.log('❌ Erro ao buscar reservas:', reservasError.message)
    } else {
      console.log(`✅ Reservas encontradas: ${reservas.length}`)
      reservas.forEach(r => {
        const dataInicio = new Date(r.data_inicio).toLocaleDateString('pt-BR')
        const horaInicio = new Date(r.data_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        console.log(`   - ${r.cliente?.nome || 'Cliente'} - ${r.quadra?.nome || 'Quadra'} (${r.quadra?.tipo || 'Tipo'})`)
        console.log(`     Data: ${dataInicio} às ${horaInicio} - R$ ${r.valor_total} - Status: ${r.status}`)
        if (r.professor) {
          console.log(`     Professor: ${r.professor.nome}`)
        }
        console.log('')
      })
    }
    console.log('')

    // Verificar leads
    console.log('🎯 Verificando LEADS...')
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
    
    if (leadsError) {
      console.log('❌ Erro ao buscar leads:', leadsError.message)
    } else {
      console.log(`✅ Leads encontrados: ${leads.length}`)
      leads.forEach(l => {
        console.log(`   - ${l.nome} (${l.telefone}) - ${l.interesse} - Status: ${l.status} - Origem: ${l.origem}`)
      })
    }
    console.log('')

    // Estatísticas gerais
    console.log('📊 ESTATÍSTICAS GERAIS:')
    console.log(`   - Quadras: ${quadras?.length || 0}`)
    console.log(`   - Clientes: ${clientes?.length || 0}`)
    console.log(`   - Professores: ${professores?.length || 0}`)
    console.log(`   - Reservas: ${reservas?.length || 0}`)
    console.log(`   - Leads: ${leads?.length || 0}`)
    console.log('')

    // Verificar se precisa popular dados
    const totalDados = (quadras?.length || 0) + (clientes?.length || 0) + (reservas?.length || 0) + (leads?.length || 0)
    
    if (totalDados === 0) {
      console.log('⚠️  NENHUM DADO ENCONTRADO!')
      console.log('   É necessário popular o banco com dados de teste.')
      console.log('   Execute: node populate-data.js')
    } else {
      console.log('✅ DADOS CONFIRMADOS!')
      console.log('   A plataforma está populada e pronta para uso.')
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

// Executar verificação
checkData()
