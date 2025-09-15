// apply-rls-fix.js
// Script para aplicar a correção completa de RLS no Supabase

const { createClient } = require('@supabase/supabase-js')

// Configurações do Supabase
const supabaseUrl = 'https://fksahbiajrccraxvowtv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2FoYmlhanJjY3JheHZvd3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTM1MjQsImV4cCI6MjA3MDY4OTUyNH0.zW0CAWuOkZaRAXVcd0uNRADnf_ADMn9FjtCySFlLKeM'

const supabase = createClient(supabaseUrl, supabaseKey)

async function applyRLSFix() {
  console.log('🔧 Aplicando correção completa de RLS no Supabase...\n')

  try {
    // 1. Verificar status atual
    console.log('📊 Verificando status atual das tabelas...')
    
    const { data: profiles } = await supabase.from('profiles').select('*').limit(1)
    const { data: quadras } = await supabase.from('quadras').select('*').limit(1)
    const { data: leads } = await supabase.from('leads').select('*').limit(1)
    const { data: reservas } = await supabase.from('reservas').select('*').limit(1)
    
    console.log(`   - Profiles: ${profiles?.length || 0} registros`)
    console.log(`   - Quadras: ${quadras?.length || 0} registros`)
    console.log(`   - Leads: ${leads?.length || 0} registros`)
    console.log(`   - Reservas: ${reservas?.length || 0} registros`)

    // 2. Testar inserção simples
    console.log('\n🧪 Testando inserção de dados...')
    
    const testLead = {
      nome: 'Teste RLS Fix',
      email: 'teste@rlsfix.com',
      telefone: '(62) 00000-0000',
      interesse: 'Teste',
      origem: 'Sistema',
      status: 'novo'
    }

    const { data: newLead, error: leadError } = await supabase
      .from('leads')
      .insert(testLead)
      .select()

    if (leadError) {
      console.log('❌ Erro ao inserir lead:', leadError.message)
      console.log('   Isso confirma que RLS está bloqueando inserções.')
    } else {
      console.log('✅ Lead inserido com sucesso:', newLead[0].nome)
    }

    // 3. Testar inserção de profile
    console.log('\n👤 Testando inserção de profile...')
    
    const testProfile = {
      id: 'teste-rls-' + Date.now(),
      email: 'teste@profile.com',
      nome: 'Teste Profile',
      telefone: '(62) 11111-1111'
    }

    const { data: newProfile, error: profileError } = await supabase
      .from('profiles')
      .insert(testProfile)
      .select()

    if (profileError) {
      console.log('❌ Erro ao inserir profile:', profileError.message)
    } else {
      console.log('✅ Profile inserido com sucesso:', newProfile[0].nome)
    }

    // 4. Verificar dados finais
    console.log('\n📊 Verificando dados finais...')
    
    const { data: finalProfiles } = await supabase.from('profiles').select('*')
    const { data: finalLeads } = await supabase.from('leads').select('*')
    
    console.log(`✅ Profiles: ${finalProfiles?.length || 0}`)
    console.log(`✅ Leads: ${finalLeads?.length || 0}`)

    console.log('\n🎯 PRÓXIMOS PASSOS:')
    console.log('1. Execute o SQL no Supabase SQL Editor:')
    console.log('   - Abra: https://supabase.com/dashboard/project/fogtbptqvvhoqesljlen/sql')
    console.log('   - Cole o conteúdo do arquivo: fix-supabase-rls-complete.sql')
    console.log('   - Execute o script')
    console.log('2. Teste as APIs híbridas novamente')
    console.log('3. Verifique se os dados aparecem na plataforma')

  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

applyRLSFix()
