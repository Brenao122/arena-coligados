require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');

async function criarReservasCompletasTeste() {
  try {
    console.log('🎯 Criando estrutura completa de teste na planilha...');
    
    // Configurar autenticação
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_EMAIL,
      key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    // 1. ATUALIZAR ESTRUTURA DE CLIENTES
    console.log('👥 Atualizando estrutura de clientes...');
    const clientesCompletos = [
      ['id', 'nome', 'email', 'telefone', 'data_nascimento', 'endereco', 'status', 'data_cadastro', 'observacoes'],
      ['cliente-001', 'João Silva', 'joao.silva@email.com', '(62) 99999-1111', '1990-05-15', 'Rua das Flores, 123', 'ativo', new Date().toISOString(), 'Cliente regular'],
      ['cliente-002', 'Maria Santos', 'maria.santos@email.com', '(62) 99999-2222', '1985-08-20', 'Av. Central, 456', 'ativo', new Date().toISOString(), 'Prefere aulas noturnas'],
      ['cliente-003', 'Pedro Costa', 'pedro.costa@email.com', '(62) 99999-3333', '1992-12-10', 'Rua do Sol, 789', 'ativo', new Date().toISOString(), 'Interessado em vôlei'],
      ['cliente-004', 'Rodrigo Teste', 'rodrigo.teste@email.com', '(62) 99999-4444', '1988-03-25', 'Rua da Paz, 321', 'ativo', new Date().toISOString(), 'Novo cliente'],
      ['cliente-005', 'Lucas Teste', 'lucas.teste@email.com', '(62) 99999-5555', '1995-07-12', 'Av. Brasil, 654', 'ativo', new Date().toISOString(), 'Locação frequente'],
      ['cliente-006', 'Larissa', 'larissa@email.com', '(62) 99999-6666', '1993-11-08', 'Rua das Palmeiras, 987', 'ativo', new Date().toISOString(), 'Prefere quadra 1'],
      ['cliente-007', 'Jheniffer', 'jheniffer@email.com', '(62) 99999-7777', '1991-09-30', 'Rua dos Lírios, 147', 'ativo', new Date().toISOString(), 'Interessada em aulas experimentais']
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: 'clientes!A1:I8',
      valueInputOption: 'RAW',
      resource: { values: clientesCompletos }
    });
    console.log('✅ Clientes atualizados com estrutura completa!');

    // 2. ATUALIZAR ESTRUTURA DE QUADRAS
    console.log('🏟️ Atualizando estrutura de quadras...');
    const quadrasCompletas = [
      ['id', 'nome', 'tipo', 'capacidade', 'preco_hora', 'imagem_url', 'equipamentos', 'ativo', 'descricao'],
      ['quadra-001', 'Quadra 1 - Futsal', 'Futsal', 10, 80, '', 'Bola, cones, cronômetro', 'ativo', 'Quadra principal para futsal'],
      ['quadra-002', 'Quadra 2 - Society', 'Society', 14, 100, '', 'Bola, traves, cronômetro', 'ativo', 'Quadra society com gramado sintético'],
      ['quadra-003', 'Quadra 3 - Vôlei', 'Vôlei', 12, 70, '', 'Rede, bola, cronômetro', 'ativo', 'Quadra especializada em vôlei'],
      ['quadra-004', 'Quadra 4 - Multiuso', 'Multiuso', 16, 90, '', 'Bola futsal, vôlei, basquete', 'ativo', 'Quadra adaptável para vários esportes']
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: 'quadras!A1:I5',
      valueInputOption: 'RAW',
      resource: { values: quadrasCompletas }
    });
    console.log('✅ Quadras atualizadas com estrutura completa!');

    // 3. ATUALIZAR ESTRUTURA DE PROFESSORES
    console.log('👨‍🏫 Atualizando estrutura de professores...');
    const professoresCompletos = [
      ['id', 'nome', 'email', 'telefone', 'especialidades', 'preco_aula', 'disponibilidade', 'ativo', 'experiencia'],
      ['prof-001', 'Carlos Oliveira', 'carlos.oliveira@email.com', '(62) 99999-8888', 'Futsal, Society', 120, 'Manhã e Tarde', 'ativo', '10 anos'],
      ['prof-002', 'Ana Lima', 'ana.lima@email.com', '(62) 99999-9999', 'Vôlei, Futsal', 100, 'Tarde e Noite', 'ativo', '8 anos'],
      ['prof-003', 'Roberto Silva', 'roberto.silva@email.com', '(62) 99999-0000', 'Aulas Experimentais', 80, 'Manhã, Tarde e Noite', 'ativo', '5 anos']
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: 'professores!A1:I4',
      valueInputOption: 'RAW',
      resource: { values: professoresCompletos }
    });
    console.log('✅ Professores atualizados com estrutura completa!');

    // 4. CRIAR RESERVAS COMPLETAS
    console.log('📅 Criando reservas completas de teste...');
    
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    const depoisAmanha = new Date(hoje);
    depoisAmanha.setDate(hoje.getDate() + 2);

    const reservasCompletas = [
      ['id', 'cliente_id', 'quadra_id', 'professor_id', 'data_inicio', 'data_fim', 'tipo', 'status', 'valor_total', 'observacoes', 'created_at', 'tipo_aula'],
      // Reservas existentes
      [
        'reserva-001',
        'cliente-001',
        'quadra-001',
        'prof-001',
        `${amanha.toISOString().split('T')[0]} 14:00:00`,
        `${amanha.toISOString().split('T')[0]} 15:00:00`,
        'aula',
        'confirmada',
        200,
        'Aula de futsal para iniciantes',
        new Date().toISOString(),
        'regular'
      ],
      [
        'reserva-002',
        'cliente-002',
        'quadra-002',
        'prof-002',
        `${amanha.toISOString().split('T')[0]} 16:00:00`,
        `${amanha.toISOString().split('T')[0]} 17:00:00`,
        'locacao',
        'pendente',
        100,
        'Locação para jogo entre amigos',
        new Date().toISOString(),
        ''
      ],
      [
        'reserva-003',
        'cliente-003',
        'quadra-003',
        'prof-001',
        `${amanha.toISOString().split('T')[0]} 18:00:00`,
        `${amanha.toISOString().split('T')[0]} 19:00:00`,
        'aula',
        'confirmada',
        190,
        'Aula de vôlei avançado',
        new Date().toISOString(),
        'regular'
      ],
      [
        'reserva-004',
        'cliente-001',
        'quadra-001',
        '',
        `${amanha.toISOString().split('T')[0]} 20:00:00`,
        `${amanha.toISOString().split('T')[0]} 21:00:00`,
        'locacao',
        'confirmada',
        80,
        'Jogo de futsal noturno',
        new Date().toISOString(),
        ''
      ],
      // Novas reservas solicitadas
      [
        'reserva-005',
        'cliente-004',
        'quadra-004',
        'prof-002',
        `${depoisAmanha.toISOString().split('T')[0]} 10:00:00`,
        `${depoisAmanha.toISOString().split('T')[0]} 11:00:00`,
        'aula',
        'confirmada',
        100,
        'Aula experimental de vôlei',
        new Date().toISOString(),
        'experimental'
      ],
      [
        'reserva-006',
        'cliente-005',
        'quadra-002',
        '',
        `${depoisAmanha.toISOString().split('T')[0]} 15:00:00`,
        `${depoisAmanha.toISOString().split('T')[0]} 16:00:00`,
        'locacao',
        'confirmada',
        100,
        'Lucas locou quadra 2 para jogo',
        new Date().toISOString(),
        ''
      ],
      [
        'reserva-007',
        'cliente-006',
        'quadra-001',
        'prof-001',
        `${depoisAmanha.toISOString().split('T')[0]} 17:00:00`,
        `${depoisAmanha.toISOString().split('T')[0]} 18:00:00`,
        'aula',
        'pendente',
        120,
        'Larissa reservou quadra 1 para aula',
        new Date().toISOString(),
        'regular'
      ],
      [
        'reserva-008',
        'cliente-007',
        'quadra-003',
        'prof-003',
        `${depoisAmanha.toISOString().split('T')[0]} 19:00:00`,
        `${depoisAmanha.toISOString().split('T')[0]} 20:00:00`,
        'locacao',
        'confirmada',
        70,
        'Jheniffer locou quadra para jogo',
        new Date().toISOString(),
        ''
      ],
      [
        'reserva-009',
        'cliente-007',
        'quadra-001',
        'prof-003',
        `${depoisAmanha.toISOString().split('T')[0]} 20:00:00`,
        `${depoisAmanha.toISOString().split('T')[0]} 21:00:00`,
        'aula',
        'confirmada',
        80,
        'Jheniffer agendou aula experimental',
        new Date().toISOString(),
        'experimental'
      ]
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: 'reservas!A1:L10',
      valueInputOption: 'RAW',
      resource: { values: reservasCompletas }
    });
    console.log('✅ Reservas completas criadas!');

    // 5. CRIAR LEADS DE TESTE
    console.log('🎯 Criando leads de teste...');
    const leadsTeste = [
      ['id', 'nome', 'email', 'telefone', 'interesse', 'origem', 'status', 'data_cadastro', 'observacoes'],
      ['lead-001', 'Fernando Souza', 'fernando.souza@email.com', '(62) 99999-1111', 'Futsal', 'Instagram', 'novo', new Date().toISOString(), 'Interessado em aulas'],
      ['lead-002', 'Camila Rocha', 'camila.rocha@email.com', '(62) 99999-2222', 'Vôlei', 'Facebook', 'contatado', new Date().toISOString(), 'Quer fazer aula experimental'],
      ['lead-003', 'Diego Alves', 'diego.alves@email.com', '(62) 99999-3333', 'Society', 'Indicação', 'qualificado', new Date().toISOString(), 'Pronto para agendar']
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: 'leads!A1:I4',
      valueInputOption: 'RAW',
      resource: { values: leadsTeste }
    });
    console.log('✅ Leads de teste criados!');

    // 6. CRIAR PAGAMENTOS DE TESTE
    console.log('💰 Criando pagamentos de teste...');
    const pagamentosTeste = [
      ['id', 'reserva_id', 'cliente_id', 'valor', 'metodo', 'status', 'data_pagamento', 'observacoes'],
      ['pag-001', 'reserva-001', 'cliente-001', 200, 'PIX', 'pago', new Date().toISOString(), 'Pagamento aprovado'],
      ['pag-002', 'reserva-003', 'cliente-003', 190, 'Cartão', 'pago', new Date().toISOString(), 'Pagamento aprovado'],
      ['pag-003', 'reserva-004', 'cliente-001', 80, 'Dinheiro', 'pago', new Date().toISOString(), 'Pagamento em dinheiro'],
      ['pag-004', 'reserva-006', 'cliente-005', 100, 'PIX', 'pendente', '', 'Aguardando pagamento']
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: 'pagamentos!A1:H5',
      valueInputOption: 'RAW',
      resource: { values: pagamentosTeste }
    });
    console.log('✅ Pagamentos de teste criados!');

    console.log('\n🎉 ESTRUTURA COMPLETA CRIADA COM SUCESSO!');
    console.log('\n📋 RESUMO DO QUE FOI CRIADO:');
    console.log('\n👥 CLIENTES (7):');
    console.log('  - João Silva, Maria Santos, Pedro Costa');
    console.log('  - Rodrigo Teste, Lucas Teste, Larissa, Jheniffer');
    
    console.log('\n🏟️ QUADRAS (4):');
    console.log('  - Quadra 1 (Futsal), Quadra 2 (Society)');
    console.log('  - Quadra 3 (Vôlei), Quadra 4 (Multiuso)');
    
    console.log('\n👨‍🏫 PROFESSORES (3):');
    console.log('  - Carlos Oliveira (Futsal/Society)');
    console.log('  - Ana Lima (Vôlei/Futsal)');
    console.log('  - Roberto Silva (Aulas Experimentais)');
    
    console.log('\n📅 RESERVAS (9):');
    console.log('  - 4 reservas existentes (amanhã)');
    console.log('  - 5 novas reservas (depois de amanhã):');
    console.log('    * Rodrigo - Aula experimental de vôlei');
    console.log('    * Lucas - Locou quadra 2');
    console.log('    * Larissa - Reservou quadra 1');
    console.log('    * Jheniffer - Locou quadra + Aula experimental');
    
    console.log('\n🎯 LEADS (3):');
    console.log('  - Fernando Souza, Camila Rocha, Diego Alves');
    
    console.log('\n💰 PAGAMENTOS (4):');
    console.log('  - 3 pagamentos aprovados, 1 pendente');
    
    console.log('\n🔄 AGORA TESTE A SINCRONIZAÇÃO NA PLATAFORMA!');

  } catch (error) {
    console.error('❌ Erro ao criar estrutura completa:', error.message);
    if (error.response) {
      console.error('Detalhes do erro:', error.response.data);
    }
  }
}

criarReservasCompletasTeste();
