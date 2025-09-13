// setup-complete-sheets.js
const { google } = require('googleapis');

async function setupCompleteSheets() {
  try {
    const email = process.env.GOOGLE_SERVICE_EMAIL;
    const rawKey = process.env.GOOGLE_PRIVATE_KEY;
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    
    console.log('=== CONFIGURAÇÃO COMPLETA DA PLANILHA ===');
    console.log('Spreadsheet ID:', spreadsheetId);
    
    const auth = new google.auth.JWT({
      email,
      key: rawKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Lista de abas necessárias
    const requiredSheets = [
      'leads',
      'clientes', 
      'reservas',
      'professores',
      'quadras',
      'avaliacoes',
      'pagamentos',
      'dashboard',
      'logs'
    ];

    // Verificar abas existentes
    console.log('\n=== VERIFICANDO ABAS EXISTENTES ===');
    const { data: spreadsheet } = await sheets.spreadsheets.get({
      spreadsheetId
    });

    const existingSheets = spreadsheet.sheets.map(sheet => sheet.properties.title);
    console.log('Abas existentes:', existingSheets);

    // Criar abas que faltam
    const missingSheets = requiredSheets.filter(name => !existingSheets.includes(name));
    
    if (missingSheets.length > 0) {
      console.log('\n=== CRIANDO ABAS FALTANTES ===');
      console.log('Abas a criar:', missingSheets);

      const requests = missingSheets.map(name => ({
        addSheet: {
          properties: {
            title: name
          }
        }
      }));

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests
        }
      });

      console.log('✅ Abas criadas com sucesso!');
    } else {
      console.log('✅ Todas as abas já existem!');
    }

    // Adicionar cabeçalhos para todas as abas
    console.log('\n=== CONFIGURANDO CABEÇALHOS ===');
    
    const headers = {
      leads: ['id', 'nome', 'telefone', 'email', 'origem', 'status', 'observacoes', 'created_at', 'updated_at'],
      clientes: ['id', 'nome', 'telefone', 'email', 'endereco', 'data_nascimento', 'created_at', 'updated_at'],
      reservas: ['id', 'cliente_id', 'quadra_id', 'professor_id', 'data_inicio', 'data_fim', 'tipo', 'status', 'valor_total', 'observacoes', 'created_at', 'updated_at'],
      professores: ['id', 'nome', 'telefone', 'email', 'especialidade', 'status', 'created_at', 'updated_at'],
      quadras: ['id', 'nome', 'tipo', 'preco_hora', 'status', 'descricao', 'created_at', 'updated_at'],
      avaliacoes: ['id', 'cliente_id', 'professor_id', 'reserva_id', 'nota', 'comentario', 'created_at', 'updated_at'],
      pagamentos: ['id', 'reserva_id', 'valor', 'metodo', 'status', 'data_pagamento', 'created_at', 'updated_at'],
      dashboard: ['metrica', 'valor', 'data', 'observacoes'],
      logs: ['id', 'acao', 'usuario', 'dados', 'created_at']
    };

    // Adicionar cabeçalhos para cada aba
    for (const sheetName of requiredSheets) {
      try {
        // Verificar se já tem cabeçalho
        const { data } = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `${sheetName}!A1:Z1`,
        });

        if (!data.values || data.values.length === 0) {
          // Adicionar cabeçalho
          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!A1`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [headers[sheetName]]
            },
          });
          console.log(`✅ Cabeçalho adicionado em: ${sheetName}`);
        } else {
          console.log(`ℹ️  Cabeçalho já existe em: ${sheetName}`);
        }
      } catch (error) {
        console.log(`⚠️  Erro ao configurar ${sheetName}:`, error.message);
      }
    }

    console.log('\n🎉 PLANILHA ARENA COLIGADOS CONFIGURADA COM SUCESSO!');
    console.log('🔗 Link:', `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`);
    console.log('\n📋 Abas configuradas:');
    requiredSheets.forEach(sheet => {
      console.log(`  - ${sheet}`);
    });

  } catch (error) {
    console.error('❌ ERRO:', error.message);
  }
}

setupCompleteSheets();
