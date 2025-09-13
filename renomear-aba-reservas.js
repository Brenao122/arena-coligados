require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');

async function renomearAbaReservas() {
  try {
    console.log('🔄 Iniciando renomeação da aba Página1 para reservas...');
    
    // Configurar autenticação
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_EMAIL,
      key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID não encontrado no .env.local');
    }

    console.log('📊 Buscando informações da planilha...');
    
    // Buscar informações da planilha
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId
    });

    console.log('📋 Abas encontradas:');
    spreadsheet.data.sheets.forEach(sheet => {
      console.log(`  - ${sheet.properties.title} (ID: ${sheet.properties.sheetId})`);
    });

    // Encontrar a aba Página1
    const pagina1Sheet = spreadsheet.data.sheets.find(sheet => 
      sheet.properties.title === 'Página1'
    );

    if (!pagina1Sheet) {
      throw new Error('Aba "Página1" não encontrada na planilha');
    }

    console.log(`✅ Aba "Página1" encontrada (ID: ${pagina1Sheet.properties.sheetId})`);

    // Renomear a aba
    console.log('🔄 Renomeando aba "Página1" para "reservas"...');
    
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: spreadsheetId,
      resource: {
        requests: [{
          updateSheetProperties: {
            properties: {
              sheetId: pagina1Sheet.properties.sheetId,
              title: 'reservas'
            },
            fields: 'title'
          }
        }]
      }
    });

    console.log('✅ Aba renomeada com sucesso!');
    
    // Verificar se a renomeação foi bem-sucedida
    const updatedSpreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId
    });

    console.log('📋 Abas após renomeação:');
    updatedSpreadsheet.data.sheets.forEach(sheet => {
      console.log(`  - ${sheet.properties.title} (ID: ${sheet.properties.sheetId})`);
    });

    console.log('🎉 Renomeação concluída com sucesso!');
    console.log('📝 Agora você precisa atualizar os componentes que referenciam "Página1" para "reservas"');

  } catch (error) {
    console.error('❌ Erro ao renomear aba:', error.message);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
    }
  }
}

renomearAbaReservas();
