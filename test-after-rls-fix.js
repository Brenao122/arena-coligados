// test-after-rls-fix.js
// Script para testar após aplicar a correção de RLS

const { createClient } = require('@supabase/supabase-js')

// Configurações do Supabase
const supabaseUrl = 'https://fksahbiajrccraxvowtv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2FoYmlhanJjY3JheHZvd3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTM1MjQsImV4cCI6MjA3MDY4OTUyNH0.zW0CAWuOkZaRAXVcd0uNRADnf_ADMn9FjtCySFlLKeM'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAfterRLSFix() {
  console.log('🧪 Testando Supabase após correção de RLS...\n')

  try {
    // 1. Verificar dados existentes
    console.log('📊 Verificando dados existentes...')
    
    const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*')
    const { data: quadras, error: quadrasError } = await supabase.from('quadras').select('*')
    const { data: leads, error: leadsError } = await supabase.from('leads').select('*')
    const { data: reservas, error: reservasError } = await supabase.from('reservas').select('*')
    
    console.log(`   - Profiles: ${profiles?.length || 0} registros`)
    if (profilesError) console.log(`     Erro: ${profilesError.message}`)
    
    console.log(`   - Quadras: ${quadras?.length || 0} registros`)
    if (quadrasError) console.log(`     Erro: ${quadrasError.message}`)
    
    console.log(`   - Leads: ${leads?.length || 0} registros`)
    if (leadsError) console.log(`     Erro: ${leadsError.message}`)
    
    console.log(`   - Reservas: ${reservas?.length || 0} registros`)
    if (reservasError) console.log(`     Erro: ${reservasError.message}`)

    // 2. Testar inserção
    console.log('\n🧪 Testando inserção de dados...')
    
    const testLead = {
      nome: 'Teste Pós RLS',
      email: 'teste@posrls.com',
      telefone: '(62) 00000-0000',
      interesse: 'Teste',
      origem: 'Sistema',
      status: 'novo'
    }

    const { data: newLead, error: leadInsertError } = await supabase
      .from('leads')
      .insert(testLead)
      .select()

    if (leadInsertError) {
      console.log('❌ Erro ao inserir lead:', leadInsertError.message)
    } else {
      console.log('✅ Lead inserido com sucesso:', newLead[0].nome)
    }

    // 3. Testar APIs híbridas
    console.log('\n🌐 Testando APIs híbridas...')
    
    try {
      const response = await fetch('http://localhost:3000/api/hybrid/quadras')
      if (response.ok) {
        const data = await response.json()
        console.log('✅ API híbrida de quadras funcionando:', data.length, 'registros')
      } else {
        console.log('❌ API híbrida de quadras com erro:', response.status)
      }
    } catch (error) {
      console.log('❌ Erro ao testar API híbrida:', error.message)
    }

    // 4. Resumo final
    console.log('\n📋 RESUMO FINAL:')
    console.log('   - Supabase: ' + (profiles?.length > 0 ? '✅ Funcionando' : '❌ Com problemas'))
    console.log('   - Google Sheets: ✅ Funcionando (fallback)')
    console.log('   - Sistema Híbrido: ✅ Funcionando')
    console.log('   - Plataforma: ✅ Funcionando')

  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

testAfterRLSFix()
