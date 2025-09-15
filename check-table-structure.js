// check-table-structure.js
// Script para verificar a estrutura atual das tabelas

const { createClient } = require('@supabase/supabase-js')

// Configurações do Supabase
const supabaseUrl = 'https://fksahbiajrccraxvowtv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2FoYmlhanJjY3JheHZvd3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTM1MjQsImV4cCI6MjA3MDY4OTUyNH0.zW0CAWuOkZaRAXVcd0uNRADnf_ADMn9FjtCySFlLKeM'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTableStructure() {
  console.log('🔍 Verificando estrutura das tabelas...\n')

  try {
    // Verificar estrutura da tabela profiles
    console.log('📋 Estrutura da tabela PROFILES:')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (profilesError) {
      console.log('❌ Erro ao acessar profiles:', profilesError.message)
    } else {
      console.log('✅ Profiles acessível')
      if (profiles && profiles.length > 0) {
        console.log('   Colunas disponíveis:', Object.keys(profiles[0]))
      } else {
        console.log('   Tabela vazia, mas acessível')
      }
    }

    // Verificar estrutura da tabela reservas
    console.log('\n📋 Estrutura da tabela RESERVAS:')
    const { data: reservas, error: reservasError } = await supabase
      .from('reservas')
      .select('*')
      .limit(1)
    
    if (reservasError) {
      console.log('❌ Erro ao acessar reservas:', reservasError.message)
    } else {
      console.log('✅ Reservas acessível')
      if (reservas && reservas.length > 0) {
        console.log('   Colunas disponíveis:', Object.keys(reservas[0]))
      } else {
        console.log('   Tabela vazia, mas acessível')
      }
    }

    // Verificar estrutura da tabela quadras
    console.log('\n📋 Estrutura da tabela QUADRAS:')
    const { data: quadras, error: quadrasError } = await supabase
      .from('quadras')
      .select('*')
      .limit(1)
    
    if (quadrasError) {
      console.log('❌ Erro ao acessar quadras:', quadrasError.message)
    } else {
      console.log('✅ Quadras acessível')
      if (quadras && quadras.length > 0) {
        console.log('   Colunas disponíveis:', Object.keys(quadras[0]))
      } else {
        console.log('   Tabela vazia, mas acessível')
      }
    }

    // Verificar estrutura da tabela leads
    console.log('\n📋 Estrutura da tabela LEADS:')
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .limit(1)
    
    if (leadsError) {
      console.log('❌ Erro ao acessar leads:', leadsError.message)
    } else {
      console.log('✅ Leads acessível')
      if (leads && leads.length > 0) {
        console.log('   Colunas disponíveis:', Object.keys(leads[0]))
      } else {
        console.log('   Tabela vazia, mas acessível')
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

checkTableStructure()
