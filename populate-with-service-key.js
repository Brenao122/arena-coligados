// populate-with-service-key.js
// Script para popular dados usando service key (bypassa RLS)

const { createClient } = require('@supabase/supabase-js')

// Configurações do Supabase com service key
const supabaseUrl = 'https://fksahbiajrccraxvowtv.supabase.co'
// IMPORTANTE: Substitua pela sua service key real
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2FoYmlhanJjY3JheHZvd3R2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTExMzUyNCwiZXhwIjoyMDcwNjg5NTI0fQ.REPLACE_WITH_YOUR_SERVICE_KEY'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function populateWithServiceKey() {
  console.log('🚀 Populando dados com service key (bypassa RLS)...\n')

  try {
    // 1. Popular quadras (seguindo POPs)
    console.log('🏟️ Populando quadras...')
    const quadras = [
      {
        id: 'quadra-001',
        nome: 'Quadra 1 - Futsal',
        tipo: 'Futsal',
        capacidade: 10,
        preco_hora: 80.00,
        descricao: 'Quadra de futsal coberta com piso sintético',
        ativo: true
      },
      {
        id: 'quadra-002', 
        nome: 'Quadra 2 - Society',
        tipo: 'Society',
        capacidade: 14,
        preco_hora: 100.00,
        descricao: 'Quadra de futebol society com gramado natural',
        ativo: true
      },
      {
        id: 'quadra-003',
        nome: 'Quadra 3 - Vôlei',
        tipo: 'Vôlei',
        capacidade: 12,
        preco_hora: 70.00,
        descricao: 'Quadra de vôlei de areia',
        ativo: true
      },
      {
        id: 'quadra-004',
        nome: 'Quadra 4 - Basquete',
        tipo: 'Basquete',
        capacidade: 10,
        preco_hora: 60.00,
        descricao: 'Quadra de basquete coberta',
        ativo: true
      },
      {
        id: 'quadra-005',
        nome: 'Quadra 5 - Beach Tennis',
        tipo: 'Beach Tennis',
        capacidade: 6,
        preco_hora: 80.00,
        descricao: 'Quadra de beach tennis com areia',
        ativo: true
      }
    ]

    const { data: insertedQuadras, error: quadrasError } = await supabase
      .from('quadras')
      .upsert(quadras, { onConflict: 'id' })
      .select()

    if (quadrasError) {
      console.log('❌ Erro ao inserir quadras:', quadrasError.message)
    } else {
      console.log(`✅ ${insertedQuadras.length} quadras inseridas`)
    }

    // 2. Popular profiles (admin, professores, clientes)
    console.log('\n👥 Populando profiles...')
    const profiles = [
      {
        id: 'admin-001',
        email: 'admin@arenacoligados.com.br',
        nome: 'Administrador Arena',
        telefone: '(62) 99999-9999',
        role: 'admin'
      },
      {
        id: 'professor-001',
        email: 'prof.silva@arenacoligados.com.br',
        nome: 'Professor Silva',
        telefone: '(62) 88888-8888',
        role: 'professor'
      },
      {
        id: 'professor-002',
        email: 'prof.santos@arenacoligados.com.br',
        nome: 'Professor Santos',
        telefone: '(62) 77777-7777',
        role: 'professor'
      },
      {
        id: 'cliente-001',
        email: 'joao@email.com',
        nome: 'João Silva',
        telefone: '(62) 99999-1111',
        role: 'aluno'
      },
      {
        id: 'cliente-002',
        email: 'maria@email.com',
        nome: 'Maria Santos',
        telefone: '(62) 99999-2222',
        role: 'aluno'
      },
      {
        id: 'cliente-003',
        email: 'pedro@email.com',
        nome: 'Pedro Costa',
        telefone: '(62) 99999-3333',
        role: 'aluno'
      }
    ]

    const { data: insertedProfiles, error: profilesError } = await supabase
      .from('profiles')
      .upsert(profiles, { onConflict: 'id' })
      .select()

    if (profilesError) {
      console.log('❌ Erro ao inserir profiles:', profilesError.message)
    } else {
      console.log(`✅ ${insertedProfiles.length} profiles inseridos`)
    }

    // 3. Popular leads (seguindo POP Aula Experimental)
    console.log('\n🎯 Populando leads...')
    const leads = [
      {
        nome: 'Ana Oliveira',
        email: 'ana@email.com',
        telefone: '(62) 77777-7777',
        interesse: 'Aula Experimental - Beach Tennis',
        origem: 'Instagram',
        status: 'novo'
      },
      {
        nome: 'Carlos Lima',
        email: 'carlos@email.com',
        telefone: '(62) 88888-8888',
        interesse: 'Aula Experimental - Futevôlei',
        origem: 'Facebook',
        status: 'contatado'
      },
      {
        nome: 'Fernanda Costa',
        email: 'fernanda@email.com',
        telefone: '(62) 99999-9999',
        interesse: 'Aluguel de Quadras',
        origem: 'Google',
        status: 'convertido'
      },
      {
        nome: 'Roberto Alves',
        email: 'roberto@email.com',
        telefone: '(62) 66666-6666',
        interesse: 'Aula Experimental - Vôlei',
        origem: 'Indicação',
        status: 'novo'
      },
      {
        nome: 'Juliana Mendes',
        email: 'juliana@email.com',
        telefone: '(62) 55555-5555',
        interesse: 'Aluguel de Quadras',
        origem: 'WhatsApp',
        status: 'contatado'
      }
    ]

    const { data: insertedLeads, error: leadsError } = await supabase
      .from('leads')
      .insert(leads)
      .select()

    if (leadsError) {
      console.log('❌ Erro ao inserir leads:', leadsError.message)
    } else {
      console.log(`✅ ${insertedLeads.length} leads inseridos`)
    }

    // 4. Popular reservas (seguindo POP Aluguel de Quadras)
    console.log('\n📅 Populando reservas...')
    const reservas = [
      {
        cliente_id: 'cliente-001',
        quadra_id: 'quadra-001',
        professor_id: 'professor-001',
        tipo: 'aula_particular',
        data_inicio: '2024-01-23T09:00:00Z',
        data_fim: '2024-01-23T11:00:00Z'
      },
      {
        cliente_id: 'cliente-002',
        quadra_id: 'quadra-002',
        professor_id: null,
        tipo: 'locacao',
        data_inicio: '2024-01-24T15:00:00Z',
        data_fim: '2024-01-24T17:00:00Z'
      },
      {
        cliente_id: 'cliente-003',
        quadra_id: 'quadra-003',
        professor_id: 'professor-002',
        tipo: 'locacao',
        data_inicio: '2024-01-25T18:00:00Z',
        data_fim: '2024-01-25T20:00:00Z'
      },
      {
        cliente_id: 'cliente-001',
        quadra_id: 'quadra-005',
        professor_id: 'professor-001',
        tipo: 'aula_experimental',
        data_inicio: '2024-01-26T10:00:00Z',
        data_fim: '2024-01-26T12:00:00Z'
      },
      {
        cliente_id: 'cliente-002',
        quadra_id: 'quadra-004',
        professor_id: null,
        tipo: 'locacao',
        data_inicio: '2024-01-27T14:00:00Z',
        data_fim: '2024-01-27T16:00:00Z'
      }
    ]

    const { data: insertedReservas, error: reservasError } = await supabase
      .from('reservas')
      .insert(reservas)
      .select()

    if (reservasError) {
      console.log('❌ Erro ao inserir reservas:', reservasError.message)
    } else {
      console.log(`✅ ${insertedReservas.length} reservas inseridas`)
    }

    // 5. Verificar dados finais
    console.log('\n📊 Verificando dados finais...')
    
    const { data: finalQuadras } = await supabase.from('quadras').select('*')
    const { data: finalProfiles } = await supabase.from('profiles').select('*')
    const { data: finalLeads } = await supabase.from('leads').select('*')
    const { data: finalReservas } = await supabase.from('reservas').select('*')
    
    console.log(`✅ Quadras: ${finalQuadras?.length || 0}`)
    console.log(`✅ Profiles: ${finalProfiles?.length || 0}`)
    console.log(`✅ Leads: ${finalLeads?.length || 0}`)
    console.log(`✅ Reservas: ${finalReservas?.length || 0}`)
    
    console.log('\n🎉 Dados populados com sucesso!')
    console.log('   Agora você pode testar as APIs híbridas.')

  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

populateWithServiceKey()