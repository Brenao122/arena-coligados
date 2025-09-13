// create-all-sheets.js
const { google } = require('googleapis');

async function createAllSheets() {
  try {
    const email = process.env.GOOGLE_SERVICE_EMAIL;
    const rawKey = process.env.GOOGLE_PRIVATE_KEY;
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    
    console.log('=== CRIANDO TODAS AS ABAS ===');
    console.log('Spreadsheet ID:', spreadsheetId);
    
    const auth = new google.auth.JWT({
      email,
      key: rawKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Lista de abas para criar
    const sheetNames = [
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

    // Criar todas as abas
    const requests = sheetNames.map(name => ({
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

    console.log('✅ Todas as abas foram criadas com sucesso!');
    console.log('📋 Abas criadas:', sheetNames.join(', '));

    // Adicionar cabeçalhos para cada aba
    console.log('\n=== ADICIONANDO CABEÇALHOS ===');
    
    // Cabeçalhos para cada aba
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

    // Adicionar cabeçalhos
    for (const [sheetName, headerRow] of Object.entries(headers)) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [headerRow]
        },
      });
      console.log(`✅ Cabeçalho adicionado em: ${sheetName}`);
    }

    console.log('\n🎉 PLANILHA ARENA COLIGADOS CONFIGURADA COM SUCESSO!');
    console.log('🔗 Link:', `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`);

  } catch (error) {
    console.error('❌ ERRO:', error.message);
  }
}

createAllSheets();
