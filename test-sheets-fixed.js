// test-sheets-fixed.js
const { google } = require('googleapis');

async function testSheets() {
  try {
    const email = process.env.GOOGLE_SERVICE_EMAIL;
    const rawKey = process.env.GOOGLE_PRIVATE_KEY;
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    
    console.log('=== TESTE GOOGLE SHEETS ===');
    console.log('Email:', email);
    console.log('Spreadsheet ID:', spreadsheetId);
    console.log('Private Key:', rawKey ? 'Presente' : 'Ausente');
    
    if (!email || !rawKey || !spreadsheetId) {
      throw new Error('Variáveis de ambiente ausentes');
    }

    const auth = new google.auth.JWT({
      email,
      key: rawKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Testar leitura da planilha (aba padrão)
    console.log('\n=== TESTANDO LEITURA (ABA PADRÃO) ===');
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'A1:Z1',
    });

    console.log('✅ Leitura funcionou!');
    console.log('Dados:', data.values || 'Planilha vazia');

    // Testar escrita na planilha
    console.log('\n=== TESTANDO ESCRITA ===');
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [['id', 'nome', 'telefone', 'email', 'status', 'created_at']]
      },
    });

    console.log('✅ Escrita funcionou!');
    console.log('✅ GOOGLE SHEETS CONFIGURADO COM SUCESSO!');

    // Testar criação de aba
    console.log('\n=== TESTANDO CRIAÇÃO DE ABA ===');
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{
          addSheet: {
            properties: {
              title: 'leads'
            }
          }
        }]
      }
    });

    console.log('✅ Criação de aba funcionou!');

  } catch (error) {
    console.error('❌ ERRO:', error.message);
    if (error.message.includes('Unable to parse range')) {
      console.log('💡 Dica: A aba não existe ainda, mas a conexão está funcionando!');
    }
  }
}

testSheets();
