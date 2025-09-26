// test-sheets.js
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

    // Testar leitura da planilha
    console.log('\n=== TESTANDO LEITURA ===');
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'leads!A1:Z1',
    });

    console.log('✅ Leitura funcionou!');
    console.log('Dados:', data.values || 'Planilha vazia');

    // Testar escrita na planilha
    console.log('\n=== TESTANDO ESCRITA ===');
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'leads!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [['id', 'nome', 'telefone', 'email', 'status', 'created_at']]
      },
    });

    console.log('✅ Escrita funcionou!');
    console.log('✅ GOOGLE SHEETS CONFIGURADO COM SUCESSO!');

  } catch (error) {
    console.error('❌ ERRO:', error.message);
    console.error('Detalhes:', error);
  }
}

testSheets();
