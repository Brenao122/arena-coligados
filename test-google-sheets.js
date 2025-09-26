require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');

async function checkData() {
  try {
    console.log('🔍 Verificando dados no Google Sheets...');
    
    const email = process.env.GOOGLE_SERVICE_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY;
    const sheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    
    console.log('📧 Email:', email);
    console.log('📊 Sheet ID:', sheetId);
    
    const auth = new google.auth.JWT({
      email: email,
      key: key.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Verificar abas disponíveis
    const response = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });
    
    console.log('📋 Título da planilha:', response.data.properties.title);
    console.log('📄 Abas disponíveis:', response.data.sheets.map(s => s.properties.title));
    
    // Verificar dados na aba Página1
    console.log('🔍 Verificando dados na Página1...');
    const dataResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Página1!A1:Z100',
    });
    
    if (dataResponse.data.values && dataResponse.data.values.length > 0) {
      console.log('✅ Dados encontrados!');
      console.log('📊 Total de linhas:', dataResponse.data.values.length);
      console.log('📋 Primeiras 3 linhas:');
      dataResponse.data.values.slice(0, 3).forEach((row, i) => {
        console.log(`  Linha ${i + 1}:`, row);
      });
    } else {
      console.log('❌ Nenhum dado encontrado na Página1');
    }
    
    // Verificar outras abas
    for (const sheet of response.data.sheets) {
      const sheetName = sheet.properties.title;
      if (sheetName !== 'Página1') {
        console.log(`🔍 Verificando aba: ${sheetName}`);
        try {
          const sheetData = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: `${sheetName}!A1:Z10`,
          });
          
          if (sheetData.data.values && sheetData.data.values.length > 0) {
            console.log(`✅ ${sheetName}: ${sheetData.data.values.length} linhas`);
          } else {
            console.log(`❌ ${sheetName}: vazia`);
          }
        } catch (err) {
          console.log(`⚠️ ${sheetName}: erro ao ler`);
        }
      }
    }
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
}

checkData();
