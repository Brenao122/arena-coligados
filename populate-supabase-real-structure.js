// populate-supabase-real-structure.js
// Script para popular dados com a estrutura REAL das tabelas

const { createClient } = require('@supabase/supabase-js')

// Configurações do Supabase
const supabaseUrl = 'https://fksahbiajrccraxvowtv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2FoYmlhanJjY3JheHZvd3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTM1MjQsImV4cCI6MjA3MDY4OTUyNH0.zW0CAWuOkZaRAXVcd0uNRADnf_ADMn9FjtCySFlLKeM'

const supabase = createClient(supabaseUrl, supabaseKey)

async function populateSupabaseReal() {
  console.log('🚀 Populando dados com estrutura REAL das tabelas...\n')

  try {
    // 1. Verificar dados existentes
    console.log('📊 Verificando dados existentes...')
    
    const { data: existingQuadras } = await supabase.from('quadras').select('*')
    const { data: existingLeads } = await supabase.from('leads').select('*')
    const { data: existingProfiles } = await supabase.from('profiles').select('*')
    const { data: existingReservas } = await supabase.from('reservas').select('*')
    
    console.log(`   - Quadras: ${existingQuadras?.length || 0}`)
    console.log(`   - Leads: ${existingLeads?.length || 0}`)
    console.log(`   - Profiles: ${existingProfiles?.length || 0}`)
    console.log(`   - Reservas: ${existingReservas?.length || 0}`)

    // 2. Adicionar mais leads se necessário
    if (existingLeads?.length < 5) {
      console.log('\n🎯 Adicionando leads adicionais...')
      const additionalLeads = [
        { nome: 'Ana Oliveira', email: 'ana@email.com', telefone: '(62) 77777-7777', interesse: 'Aula Particular', origem: 'Google', status: 'convertido' },
        { nome: 'Carlos Lima', email: 'carlos@email.com', telefone: '(62) 88888-8888', interesse: 'Locação', origem: 'Facebook', status: 'novo' }
      ]

      const { data: newLeads, error: leadsError } = await supabase
        .from('leads')
        .insert(additionalLeads)
        .select()

      if (leadsError) {
        console.log('❌ Erro ao inserir leads:', leadsError.message)
      } else {
        console.log(`✅ ${newLeads.length} leads adicionais inseridos`)
      }
    }

    // 3. Adicionar mais profiles se necessário
    if (existingProfiles?.length < 5) {
      console.log('\n👥 Adicionando profiles adicionais...')
      const additionalProfiles = [
        { id: 'cliente-001', email: 'joao@email.com', nome: 'João Silva', telefone: '(62) 99999-1111' },
        { id: 'cliente-002', email: 'maria@email.com', nome: 'Maria Santos', telefone: '(62) 99999-2222' },
        { id: 'cliente-003', email: 'pedro@email.com', nome: 'Pedro Costa', telefone: '(62) 99999-3333' }
      ]

      const { data: newProfiles, error: profilesError } = await supabase
        .from('profiles')
        .insert(additionalProfiles)
        .select()

      if (profilesError) {
        console.log('❌ Erro ao inserir profiles:', profilesError.message)
      } else {
        console.log(`✅ ${newProfiles.length} profiles adicionais inseridos`)
      }
    }

    // 4. Adicionar mais reservas se necessário
    if (existingReservas?.length < 5) {
      console.log('\n📅 Adicionando reservas adicionais...')
      
      // Buscar IDs das quadras e profiles existentes
      const { data: quadras } = await supabase.from('quadras').select('id').limit(3)
      const { data: profiles } = await supabase.from('profiles').select('id').limit(3)
      
      if (quadras && profiles && quadras.length > 0 && profiles.length > 0) {
        const additionalReservas = [
          { 
            cliente_id: profiles[0].id, 
            quadra_id: quadras[0].id, 
            professor_id: profiles[1].id,
            tipo: 'aula_particular',
            data_inicio: '2024-01-23T09:00:00Z',
            data_fim: '11:00:00'
          },
          { 
            cliente_id: profiles[1].id, 
            quadra_id: quadras[1].id, 
            professor_id: profiles[2].id,
            tipo: 'locacao',
            data_inicio: '2024-01-24T15:00:00Z',
            data_fim: '17:00:00'
          },
          { 
            cliente_id: profiles[2].id, 
            quadra_id: quadras[2].id, 
            professor_id: profiles[0].id,
            tipo: 'locacao',
            data_inicio: '2024-01-25T18:00:00Z',
            data_fim: '20:00:00'
          }
        ]

        const { data: newReservas, error: reservasError } = await supabase
          .from('reservas')
          .insert(additionalReservas)
          .select()

        if (reservasError) {
          console.log('❌ Erro ao inserir reservas:', reservasError.message)
        } else {
          console.log(`✅ ${newReservas.length} reservas adicionais inseridas`)
        }
      }
    }

    // 5. Verificar dados finais
    console.log('\n📊 Verificando dados finais...')
    
    const { data: finalQuadras } = await supabase.from('quadras').select('*')
    const { data: finalLeads } = await supabase.from('leads').select('*')
    const { data: finalProfiles } = await supabase.from('profiles').select('*')
    const { data: finalReservas } = await supabase.from('reservas').select('*')
    
    console.log(`✅ Quadras: ${finalQuadras?.length || 0}`)
    console.log(`✅ Leads: ${finalLeads?.length || 0}`)
    console.log(`✅ Profiles: ${finalProfiles?.length || 0}`)
    console.log(`✅ Reservas: ${finalReservas?.length || 0}`)
    
    console.log('\n🎉 Dados populados com sucesso!')
    console.log('   Agora você pode testar as APIs híbridas.')

  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

populateSupabaseReal()
