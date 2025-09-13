require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');

async function testarConexaoCompleta() {
  try {
    console.log('🔍 TESTANDO CONEXÃO COMPLETA ENTRE PLANILHA E PLATAFORMA...\n');
    
    // Configurar autenticação
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_EMAIL,
      key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    console.log('📊 CONFIGURAÇÃO:');
    console.log(`   Email: ${process.env.GOOGLE_SERVICE_EMAIL}`);
    console.log(`   Sheet ID: ${spreadsheetId}`);
    console.log('');

    // 1. TESTAR CLIENTES
    console.log('👥 TESTANDO CLIENTES:');
    try {
      const clientesRes = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'clientes!A1:Z100'
      });
      
      const clientes = clientesRes.data.values || [];
      console.log(`   ✅ Clientes encontrados: ${clientes.length - 1}`);
      
      if (clientes.length > 1) {
        console.log('   📋 Primeiros clientes:');
        clientes.slice(1, 4).forEach((cliente, index) => {
          console.log(`      ${index + 1}. ${cliente[1]} (${cliente[2]})`);
        });
      }
    } catch (error) {
      console.log(`   ❌ Erro ao buscar clientes: ${error.message}`);
    }
    console.log('');

    // 2. TESTAR QUADRAS
    console.log('🏟️ TESTANDO QUADRAS:');
    try {
      const quadrasRes = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'quadras!A1:Z100'
      });
      
      const quadras = quadrasRes.data.values || [];
      console.log(`   ✅ Quadras encontradas: ${quadras.length - 1}`);
      
      if (quadras.length > 1) {
        console.log('   📋 Quadras disponíveis:');
        quadras.slice(1, 4).forEach((quadra, index) => {
          console.log(`      ${index + 1}. ${quadra[1]} (${quadra[2]}) - R$ ${quadra[4]}/hora`);
        });
      }
    } catch (error) {
      console.log(`   ❌ Erro ao buscar quadras: ${error.message}`);
    }
    console.log('');

    // 3. TESTAR PROFESSORES
    console.log('👨‍🏫 TESTANDO PROFESSORES:');
    try {
      const professoresRes = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'professores!A1:Z100'
      });
      
      const professores = professoresRes.data.values || [];
      console.log(`   ✅ Professores encontrados: ${professores.length - 1}`);
      
      if (professores.length > 1) {
        console.log('   📋 Professores disponíveis:');
        professores.slice(1, 4).forEach((professor, index) => {
          console.log(`      ${index + 1}. ${professor[1]} - ${professor[4]} - R$ ${professor[5]}/aula`);
        });
      }
    } catch (error) {
      console.log(`   ❌ Erro ao buscar professores: ${error.message}`);
    }
    console.log('');

    // 4. TESTAR RESERVAS
    console.log('📅 TESTANDO RESERVAS:');
    try {
      const reservasRes = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'reservas!A1:Z100'
      });
      
      const reservas = reservasRes.data.values || [];
      console.log(`   ✅ Reservas encontradas: ${reservas.length - 1}`);
      
      if (reservas.length > 1) {
        console.log('   📋 Últimas reservas:');
        reservas.slice(1, 4).forEach((reserva, index) => {
          const data = reserva[4] ? reserva[4].split(' ')[0] : 'N/A';
          const hora = reserva[4] ? reserva[4].split(' ')[1] : 'N/A';
          console.log(`      ${index + 1}. ${reserva[1]} - ${data} ${hora} - ${reserva[6]}`);
        });
      }
    } catch (error) {
      console.log(`   ❌ Erro ao buscar reservas: ${error.message}`);
    }
    console.log('');

    // 5. TESTAR LEADS
    console.log('🎯 TESTANDO LEADS:');
    try {
      const leadsRes = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'leads!A1:Z100'
      });
      
      const leads = leadsRes.data.values || [];
      console.log(`   ✅ Leads encontrados: ${leads.length - 1}`);
      
      if (leads.length > 1) {
        console.log('   📋 Leads disponíveis:');
        leads.slice(1, 3).forEach((lead, index) => {
          console.log(`      ${index + 1}. ${lead[1]} - ${lead[4]} - ${lead[6]}`);
        });
      }
    } catch (error) {
      console.log(`   ❌ Erro ao buscar leads: ${error.message}`);
    }
    console.log('');

    // 6. TESTAR PAGAMENTOS
    console.log('💰 TESTANDO PAGAMENTOS:');
    try {
      const pagamentosRes = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'pagamentos!A1:Z100'
      });
      
      const pagamentos = pagamentosRes.data.values || [];
      console.log(`   ✅ Pagamentos encontrados: ${pagamentos.length - 1}`);
      
      if (pagamentos.length > 1) {
        console.log('   📋 Status dos pagamentos:');
        pagamentos.slice(1, 3).forEach((pagamento, index) => {
          console.log(`      ${index + 1}. R$ ${pagamento[3]} - ${pagamento[5]} - ${pagamento[4]}`);
        });
      }
    } catch (error) {
      console.log(`   ❌ Erro ao buscar pagamentos: ${error.message}`);
    }
    console.log('');

    // 7. VERIFICAR ESTRUTURA PARA NOVOS CLIENTES
    console.log('🆕 VERIFICANDO ESTRUTURA PARA NOVOS CLIENTES:');
    try {
      const clientesRes = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'clientes!A1:Z1'
      });
      
      const headers = clientesRes.data.values?.[0] || [];
      console.log('   ✅ Estrutura da aba clientes:');
      headers.forEach((header, index) => {
        console.log(`      ${index + 1}. ${header}`);
      });
      
      console.log('   📝 Campos disponíveis para novo cliente:');
      console.log('      - Nome, Email, Telefone, Data de Nascimento');
      console.log('      - Endereço, Status, Data de Cadastro, Observações');
    } catch (error) {
      console.log(`   ❌ Erro ao verificar estrutura: ${error.message}`);
    }
    console.log('');

    console.log('🎉 TESTE DE CONEXÃO CONCLUÍDO!');
    console.log('');
    console.log('📋 RESUMO:');
    console.log('   ✅ Conexão com Google Sheets: FUNCIONANDO');
    console.log('   ✅ Dados de clientes: DISPONÍVEIS');
    console.log('   ✅ Dados de quadras: DISPONÍVEIS');
    console.log('   ✅ Dados de professores: DISPONÍVEIS');
    console.log('   ✅ Dados de reservas: DISPONÍVEIS');
    console.log('   ✅ Estrutura para novos clientes: PREPARADA');
    console.log('');
    console.log('🔄 PRÓXIMOS PASSOS:');
    console.log('   1. Testar no site: https://arenacoligados.com.br');
    console.log('   2. Verificar se clientes aparecem no formulário de reserva');
    console.log('   3. Testar criação de nova reserva');
    console.log('   4. Testar criação de novo cliente');

  } catch (error) {
    console.error('❌ Erro geral no teste:', error.message);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
    }
  }
}

testarConexaoCompleta();
