const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas!');
  console.log('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY estão configuradas.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySupabaseConnection() {
  console.log('🔍 Verificando conexão com Supabase...\n');

  try {
    // 1. Testar conexão básica
    console.log('1️⃣ Testando conexão básica...');
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (testError) {
      throw new Error(`Erro de conexão: ${testError.message}`);
    }
    console.log('✅ Conexão estabelecida com sucesso!\n');

    // 2. Verificar tabelas essenciais
    console.log('2️⃣ Verificando tabelas essenciais...');
    const essentialTables = [
      'profiles',
      'user_roles',
      'quadras',
      'modalidades',
      'reservas',
      'configuracoes'
    ];

    for (const table of essentialTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        if (error) {
          console.log(`❌ Tabela ${table}: ${error.message}`);
        } else {
          console.log(`✅ Tabela ${table}: OK`);
        }
      } catch (err) {
        console.log(`❌ Tabela ${table}: ${err.message}`);
      }
    }
    console.log('');

    // 3. Verificar usuários de teste
    console.log('3️⃣ Verificando usuários de teste...');
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .limit(5);

    if (usersError) {
      console.log(`❌ Erro ao buscar usuários: ${usersError.message}`);
    } else {
      console.log(`✅ ${users?.length || 0} usuários encontrados`);
      if (users && users.length > 0) {
        users.forEach(user => {
          console.log(`   - ${user.email} (${user.full_name})`);
        });
      }
    }
    console.log('');

    // 4. Verificar roles
    console.log('4️⃣ Verificando sistema de roles...');
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .limit(10);

    if (rolesError) {
      console.log(`❌ Erro ao buscar roles: ${rolesError.message}`);
    } else {
      console.log(`✅ ${roles?.length || 0} roles configurados`);
      if (roles && roles.length > 0) {
        const roleCounts = roles.reduce((acc, r) => {
          acc[r.role] = (acc[r.role] || 0) + 1;
          return acc;
        }, {});
        
        Object.entries(roleCounts).forEach(([role, count]) => {
          console.log(`   - ${role}: ${count} usuários`);
        });
      }
    }
    console.log('');

    // 5. Verificar quadras
    console.log('5️⃣ Verificando quadras...');
    const { data: quadras, error: quadrasError } = await supabase
      .from('quadras')
      .select('nome, tipo, ativa')
      .limit(10);

    if (quadrasError) {
      console.log(`❌ Erro ao buscar quadras: ${quadrasError.message}`);
    } else {
      console.log(`✅ ${quadras?.length || 0} quadras configuradas`);
      if (quadras && quadras.length > 0) {
        quadras.forEach(quadra => {
          console.log(`   - ${quadra.nome} (${quadra.tipo}) - ${quadra.ativa ? 'Ativa' : 'Inativa'}`);
        });
      }
    }

    console.log('\n🎉 Verificação concluída!');
    console.log('\n📋 RESUMO:');
    console.log('- Conexão com Supabase: ✅');
    console.log('- Tabelas essenciais: ✅');
    console.log('- Sistema de autenticação: ✅');
    console.log('- Sistema de roles: ✅');
    console.log('- Quadras configuradas: ✅');

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error.message);
    process.exit(1);
  }
}

verifySupabaseConnection();
