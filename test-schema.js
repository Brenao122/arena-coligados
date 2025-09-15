// test-schema.js
// Script para testar se as correções do schema foram aplicadas

const { createClient } = require('@supabase/supabase-js')

// Configurações do Supabase
const supabaseUrl = 'https://fksahbiajrccraxvowtv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2FoYmlhanJjY3JheHZvd3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTM1MjQsImV4cCI6MjA3MDY4OTUyNH0.zW0CAWuOkZaRAXVcd0uNRADnf_ADMn9FjtCySFlLKeM'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSchema() {
  console.log('🔍 Testando schema do Supabase...\n')

  try {
    // Teste 1: Verificar se a coluna role existe
    console.log('1️⃣ Testando coluna role em profiles...')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, role')
      .limit(1)
    
    if (profilesError) {
      console.log('❌ Erro:', profilesError.message)
    } else {
      console.log('✅ Coluna role existe!')
      console.log('   Dados:', profiles)
    }

    // Teste 2: Verificar se as colunas de relacionamento existem
    console.log('\n2️⃣ Testando relacionamentos em reservas...')
    const { data: reservas, error: reservasError } = await supabase
      .from('reservas')
      .select('id, cliente_id, professor_id')
      .limit(1)
    
    if (reservasError) {
      console.log('❌ Erro:', reservasError.message)
    } else {
      console.log('✅ Relacionamentos existem!')
      console.log('   Dados:', reservas)
    }

    // Teste 3: Verificar RLS
    console.log('\n3️⃣ Testando RLS...')
    const { data: testInsert, error: insertError } = await supabase
      .from('profiles')
      .insert([{
        id: 'test-' + Date.now(),
        email: 'test@test.com',
        nome: 'Teste',
        role: 'aluno'
      }])
      .select()
    
    if (insertError) {
      console.log('❌ RLS ainda ativo:', insertError.message)
    } else {
      console.log('✅ RLS desabilitado! Inserção funcionou.')
      console.log('   Dados inseridos:', testInsert)
      
      // Limpar dados de teste
      await supabase
        .from('profiles')
        .delete()
        .eq('id', testInsert[0].id)
      console.log('   Dados de teste removidos.')
    }

    // Teste 4: Verificar estrutura das tabelas
    console.log('\n4️⃣ Verificando estrutura das tabelas...')
    
    const tables = ['profiles', 'reservas', 'quadras', 'leads']
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        console.log(`❌ Tabela ${table}:`, error.message)
      } else {
        console.log(`✅ Tabela ${table}: OK`)
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

testSchema()
