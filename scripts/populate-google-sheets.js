#!/usr/bin/env node

/**
 * Script para Popular Google Sheets - Arena Coligados
 * Este script preenche a planilha do Google Sheets com dados estruturados
 */

const { GoogleSpreadsheet } = require('google-spreadsheet')
const { JWT } = require('google-auth-library')

// Configurações do Google Sheets
const SPREADSHEET_ID = '174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew'
const SERVICE_ACCOUNT_EMAIL = 'your-service-account@your-project.iam.gserviceaccount.com'
const PRIVATE_KEY = 'your-private-key-here'

// Função para autenticar com Google Sheets
async function authenticateGoogleSheets() {
  try {
    const serviceAccountAuth = new JWT({
      email: SERVICE_ACCOUNT_EMAIL,
      key: PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    return serviceAccountAuth
  } catch (error) {
    console.error('❌ Erro na autenticação:', error.message)
    throw error
  }
}

// Função para criar e popular aba de Quadras
async function popularQuadras(doc) {
  try {
    console.log('🏟️  Populando aba Quadras...')
    
    // Buscar ou criar aba Quadras
    let sheet = doc.sheetsByTitle['Quadras']
    if (!sheet) {
      sheet = await doc.addSheet({ title: 'Quadras', headerValues: ['ID', 'Nome', 'Tipo', 'Capacidade', 'Preço/Hora', 'Ativa', 'Descrição', 'Regras', 'Equipamentos', 'Criado em', 'Atualizado em'] })
    }

    // Limpar dados existentes (manter cabeçalho)
    await sheet.clearRows()
    
    // Dados das quadras da Arena Coligados
    const quadras = [
      {
        id: 'quadra-matriz-1',
        nome: 'Quadra 1 - Matriz',
        tipo: 'Beach Tennis',
        capacidade: 6,
        preco_hora: 80,
        ativa: 'SIM',
        descricao: 'Quadra de Beach Tennis com areia premium',
        regras: 'Capacidade máxima de 6 pessoas',
        equipamentos: 'Rede oficial, Raquetes, Bolas',
        criado_em: new Date().toISOString().split('T')[0],
        atualizado_em: new Date().toISOString().split('T')[0]
      },
      {
        id: 'quadra-matriz-2',
        nome: 'Quadra 2 - Matriz',
        tipo: 'Vôlei',
        capacidade: 10,
        preco_hora: 80,
        ativa: 'SIM',
        descricao: 'Quadra de Vôlei com piso profissional',
        regras: 'Capacidade máxima de 10 pessoas',
        equipamentos: 'Rede oficial, Bolas oficiais',
        criado_em: new Date().toISOString().split('T')[0],
        atualizado_em: new Date().toISOString().split('T')[0]
      },
      {
        id: 'quadra-matriz-3',
        nome: 'Quadra 3 - Matriz',
        tipo: 'Futevôlei',
        capacidade: 10,
        preco_hora: 80,
        ativa: 'SIM',
        descricao: 'Quadra de Futevôlei com areia especial',
        regras: 'Capacidade máxima de 10 pessoas',
        equipamentos: 'Rede regulamentada, Bolas oficiais',
        criado_em: new Date().toISOString().split('T')[0],
        atualizado_em: new Date().toISOString().split('T')[0]
      },
      {
        id: 'quadra-matriz-4',
        nome: 'Quadra 4 - Matriz',
        tipo: 'Beach Tennis',
        capacidade: 6,
        preco_hora: 80,
        ativa: 'SIM',
        descricao: 'Quadra de Beach Tennis - Matriz',
        regras: 'Capacidade máxima de 6 pessoas',
        equipamentos: 'Rede oficial, Raquetes',
        criado_em: new Date().toISOString().split('T')[0],
        atualizado_em: new Date().toISOString().split('T')[0]
      },
      {
        id: 'quadra-matriz-5',
        nome: 'Quadra 5 - Matriz',
        tipo: 'Vôlei',
        capacidade: 10,
        preco_hora: 80,
        ativa: 'SIM',
        descricao: 'Quadra de Vôlei - Matriz',
        regras: 'Capacidade máxima de 10 pessoas',
        equipamentos: 'Rede oficial, Bolas',
        criado_em: new Date().toISOString().split('T')[0],
        atualizado_em: new Date().toISOString().split('T')[0]
      },
      {
        id: 'quadra-vila-rosa-1',
        nome: 'Quadra Vila Rosa 1',
        tipo: 'Beach Tennis',
        capacidade: 6,
        preco_hora: 70,
        ativa: 'SIM',
        descricao: 'Quadra de Beach Tennis - Vila Rosa',
        regras: 'Capacidade máxima de 6 pessoas',
        equipamentos: 'Rede oficial, Raquetes',
        criado_em: new Date().toISOString().split('T')[0],
        atualizado_em: new Date().toISOString().split('T')[0]
      },
      {
        id: 'quadra-vila-rosa-2',
        nome: 'Quadra Vila Rosa 2',
        tipo: 'Vôlei',
        capacidade: 10,
        preco_hora: 70,
        ativa: 'SIM',
        descricao: 'Quadra de Vôlei - Vila Rosa',
        regras: 'Capacidade máxima de 10 pessoas',
        equipamentos: 'Rede oficial, Bolas',
        criado_em: new Date().toISOString().split('T')[0],
        atualizado_em: new Date().toISOString().split('T')[0]
      }
    ]

    // Adicionar dados
    await sheet.addRows(quadras)
    console.log(`✅ ${quadras.length} quadras adicionadas`)
    
    return quadras.length
  } catch (error) {
    console.error('❌ Erro ao popular quadras:', error.message)
    throw error
  }
}

// Função para criar e popular aba de Clientes
async function popularClientes(doc) {
  try {
    console.log('👥 Populando aba Clientes...')
    
    let sheet = doc.sheetsByTitle['Clientes']
    if (!sheet) {
      sheet = await doc.addSheet({ title: 'Clientes', headerValues: ['ID', 'Nome', 'Email', 'Telefone', 'Data Nascimento', 'Endereço', 'Role', 'Ativo', 'Criado em', 'Atualizado em'] })
    }

    await sheet.clearRows()
    
    const clientes = [
      {
        id: 'cliente-001',
        nome: 'João Silva Santos',
        email: 'joao.silva@email.com',
        telefone: '(62) 99999-1111',
        data_nascimento: '1990-05-15',
        endereco: 'Rua das Flores, 123 - Centro - Goiânia/GO',
        role: 'Cliente',
        ativo: 'SIM',
        criado_em: '2024-01-15',
        atualizado_em: new Date().toISOString().split('T')[0]
      },
      {
        id: 'cliente-002',
        nome: 'Maria Santos Oliveira',
        email: 'maria.santos@email.com',
        telefone: '(62) 99999-2222',
        data_nascimento: '1985-08-22',
        endereco: 'Av. Goiás, 456 - Setor Oeste - Goiânia/GO',
        role: 'Cliente',
        ativo: 'SIM',
        criado_em: '2024-02-10',
        atualizado_em: new Date().toISOString().split('T')[0]
      },
      {
        id: 'cliente-003',
        nome: 'Carlos Eduardo Lima',
        email: 'carlos.lima@email.com',
        telefone: '(62) 99999-3333',
        data_nascimento: '1992-12-03',
        endereco: 'Rua 7, 789 - Setor Marista - Goiânia/GO',
        role: 'Cliente',
        ativo: 'SIM',
        criado_em: '2024-03-05',
        atualizado_em: new Date().toISOString().split('T')[0]
      },
      {
        id: 'cliente-004',
        nome: 'Ana Paula Costa',
        email: 'ana.costa@email.com',
        telefone: '(62) 99999-4444',
        data_nascimento: '1988-07-18',
        endereco: 'Av. T-10, 321 - Setor Bueno - Goiânia/GO',
        role: 'Cliente',
        ativo: 'SIM',
        criado_em: '2024-03-20',
        atualizado_em: new Date().toISOString().split('T')[0]
      },
      {
        id: 'professor-001',
        nome: 'Rafael Henrique Professor',
        email: 'rafael.professor@arenacoligados.com.br',
        telefone: '(62) 99999-5555',
        data_nascimento: '1980-04-12',
        endereco: 'Rua das Palmeiras, 654 - Jardim América - Goiânia/GO',
        role: 'Professor',
        ativo: 'SIM',
        criado_em: '2024-01-01',
        atualizado_em: new Date().toISOString().split('T')[0]
      },
      {
        id: 'admin-001',
        nome: 'Administrador Arena',
        email: 'admin@arenacoligados.com.br',
        telefone: '(62) 99999-0000',
        data_nascimento: '1985-01-01',
        endereco: 'Arena Coligados - Av. Xingu - Goiânia/GO',
        role: 'Administrador',
        ativo: 'SIM',
        criado_em: '2024-01-01',
        atualizado_em: new Date().toISOString().split('T')[0]
      }
    ]

    await sheet.addRows(clientes)
    console.log(`✅ ${clientes.length} clientes adicionados`)
    
    return clientes.length
  } catch (error) {
    console.error('❌ Erro ao popular clientes:', error.message)
    throw error
  }
}

// Função para criar e popular aba de Reservas
async function popularReservas(doc) {
  try {
    console.log('📅 Populando aba Reservas...')
    
    let sheet = doc.sheetsByTitle['Reservas']
    if (!sheet) {
      sheet = await doc.addSheet({ title: 'Reservas', headerValues: ['ID', 'Cliente ID', 'Cliente Nome', 'Quadra ID', 'Quadra Nome', 'Professor ID', 'Tipo', 'Data Início', 'Hora Início', 'Data Fim', 'Hora Fim', 'Valor Total', 'Status', 'Observações', 'Criado em'] })
    }

    await sheet.clearRows()
    
    // Gerar reservas para os próximos 30 dias
    const reservas = []
    const hoje = new Date()
    
    for (let i = 0; i < 50; i++) {
      const dataReserva = new Date(hoje.getTime() + (i * 24 * 60 * 60 * 1000))
      const horaInicio = 8 + Math.floor(Math.random() * 12) // Entre 8h e 19h
      const horaFim = horaInicio + 1 + Math.floor(Math.random() * 3) // Entre 1h e 4h de duração
      
      const quadras = ['Quadra 1 - Matriz', 'Quadra 2 - Matriz', 'Quadra 3 - Matriz', 'Quadra Vila Rosa 1', 'Quadra Vila Rosa 2']
      const clientes = ['João Silva Santos', 'Maria Santos Oliveira', 'Carlos Eduardo Lima', 'Ana Paula Costa']
      const tipos = ['Aula', 'Particular', 'Campeonato', 'Treino']
      const status = ['Confirmada', 'Pendente', 'Cancelada']
      
      const quadraEscolhida = quadras[Math.floor(Math.random() * quadras.length)]
      const clienteEscolhido = clientes[Math.floor(Math.random() * clientes.length)]
      const tipoEscolhido = tipos[Math.floor(Math.random() * tipos.length)]
      const statusEscolhido = status[Math.floor(Math.random() * status.length)]
      
      const valorTotal = (horaFim - horaInicio) * (quadraEscolhida.includes('Vila Rosa') ? 70 : 80)
      
      reservas.push({
        id: `reserva-${String(i + 1).padStart(3, '0')}`,
        cliente_id: `cliente-${String(Math.floor(Math.random() * 4) + 1).padStart(3, '0')}`,
        cliente_nome: clienteEscolhido,
        quadra_id: `quadra-${Math.floor(Math.random() * 7) + 1}`,
        quadra_nome: quadraEscolhida,
        professor_id: tipoEscolhido === 'Aula' ? 'professor-001' : '',
        tipo: tipoEscolhido,
        data_inicio: dataReserva.toISOString().split('T')[0],
        hora_inicio: `${horaInicio.toString().padStart(2, '0')}:00`,
        data_fim: dataReserva.toISOString().split('T')[0],
        hora_fim: `${horaFim.toString().padStart(2, '0')}:00`,
        valor_total: valorTotal,
        status: statusEscolhido,
        observacoes: `${tipoEscolhido} na ${quadraEscolhida}`,
        criado_em: new Date().toISOString().split('T')[0]
      })
    }

    await sheet.addRows(reservas)
    console.log(`✅ ${reservas.length} reservas adicionadas`)
    
    return reservas.length
  } catch (error) {
    console.error('❌ Erro ao popular reservas:', error.message)
    throw error
  }
}

// Função para criar e popular aba de Leads
async function popularLeads(doc) {
  try {
    console.log('🎯 Populando aba Leads...')
    
    let sheet = doc.sheetsByTitle['Leads']
    if (!sheet) {
      sheet = await doc.addSheet({ title: 'Leads', headerValues: ['ID', 'Nome', 'Email', 'Telefone', 'Interesse', 'Origem', 'Status', 'Observações', 'Criado em', 'Atualizado em'] })
    }

    await sheet.clearRows()
    
    const leads = [
      {
        id: 'lead-001',
        nome: 'Pedro Henrique Silva',
        email: 'pedro.henrique@email.com',
        telefone: '(62) 99999-6666',
        interesse: 'Beach Tennis',
        origem: 'Instagram',
        status: 'Novo',
        observacoes: 'Interessado em aulas de Beach Tennis',
        criado_em: new Date().toISOString().split('T')[0],
        atualizado_em: new Date().toISOString().split('T')[0]
      },
      {
        id: 'lead-002',
        nome: 'Ana Beatriz Santos',
        email: 'ana.beatriz@email.com',
        telefone: '(62) 99999-7777',
        interesse: 'Vôlei',
        origem: 'WhatsApp',
        status: 'Contatado',
        observacoes: 'Já foi contatada, aguardando resposta',
        criado_em: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        atualizado_em: new Date().toISOString().split('T')[0]
      },
      {
        id: 'lead-003',
        nome: 'Lucas Oliveira',
        email: 'lucas.oliveira@email.com',
        telefone: '(62) 99999-8888',
        interesse: 'Futevôlei',
        origem: 'Google',
        status: 'Qualificado',
        observacoes: 'Muito interessado, quer agendar aula experimental',
        criado_em: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        atualizado_em: new Date().toISOString().split('T')[0]
      },
      {
        id: 'lead-004',
        nome: 'Fernanda Costa',
        email: 'fernanda.costa@email.com',
        telefone: '(62) 99999-9999',
        interesse: 'Beach Tennis',
        origem: 'Indicação',
        status: 'Convertido',
        observacoes: 'Convertido em cliente - reserva realizada',
        criado_em: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        atualizado_em: new Date().toISOString().split('T')[0]
      },
      {
        id: 'lead-005',
        nome: 'Roberto Alves',
        email: 'roberto.alves@email.com',
        telefone: '(62) 99999-0001',
        interesse: 'Vôlei',
        origem: 'Facebook',
        status: 'Novo',
        observacoes: 'Interessado em jogar vôlei com amigos',
        criado_em: new Date().toISOString().split('T')[0],
        atualizado_em: new Date().toISOString().split('T')[0]
      }
    ]

    await sheet.addRows(leads)
    console.log(`✅ ${leads.length} leads adicionados`)
    
    return leads.length
  } catch (error) {
    console.error('❌ Erro ao popular leads:', error.message)
    throw error
  }
}

// Função para criar aba de Relatórios
async function criarRelatorios(doc) {
  try {
    console.log('📊 Criando aba Relatórios...')
    
    let sheet = doc.sheetsByTitle['Relatórios']
    if (!sheet) {
      sheet = await doc.addSheet({ title: 'Relatórios', headerValues: ['Data', 'Tipo', 'Descrição', 'Valor', 'Observações'] })
    }

    await sheet.clearRows()
    
    // Dados de exemplo para relatórios
    const relatorios = [
      {
        data: new Date().toISOString().split('T')[0],
        tipo: 'Receita',
        descricao: 'Reservas do dia',
        valor: 1240,
        observacoes: 'Receita total das reservas confirmadas'
      },
      {
        data: new Date().toISOString().split('T')[0],
        tipo: 'Despesa',
        descricao: 'Manutenção das quadras',
        valor: -350,
        observacoes: 'Troca de redes e limpeza'
      },
      {
        data: new Date().toISOString().split('T')[0],
        tipo: 'Receita',
        descricao: 'Aulas particulares',
        valor: 800,
        observacoes: 'Aulas ministradas pelos professores'
      }
    ]

    await sheet.addRows(relatorios)
    console.log(`✅ ${relatorios.length} registros de relatórios adicionados`)
    
    return relatorios.length
  } catch (error) {
    console.error('❌ Erro ao criar relatórios:', error.message)
    throw error
  }
}

// Função principal
async function popularGoogleSheets() {
  try {
    console.log('🏟️  ARENA COLIGADOS - POPULANDO GOOGLE SHEETS')
    console.log('===============================================\n')
    
    // Verificar se as credenciais estão configuradas
    if (!SERVICE_ACCOUNT_EMAIL || SERVICE_ACCOUNT_EMAIL.includes('your-service-account')) {
      console.log('⚠️  CREDENCIAIS DO GOOGLE SHEETS NÃO CONFIGURADAS')
      console.log('')
      console.log('📋 PARA CONFIGURAR:')
      console.log('1. Acesse: https://console.cloud.google.com/')
      console.log('2. Crie um projeto ou selecione um existente')
      console.log('3. Ative a API do Google Sheets')
      console.log('4. Crie uma Service Account')
      console.log('5. Baixe o arquivo JSON de credenciais')
      console.log('6. Atualize as variáveis no script:')
      console.log('   - SERVICE_ACCOUNT_EMAIL')
      console.log('   - PRIVATE_KEY')
      console.log('')
      console.log('🔗 ID da Planilha: ' + SPREADSHEET_ID)
      console.log('')
      console.log('💡 DICA: Compartilhe a planilha com o email da Service Account')
      console.log('   Permissão: Editor')
      console.log('')
      
      // Criar dados mockados para demonstração
      console.log('📊 DADOS QUE SERÃO INSERIDOS:')
      console.log('')
      console.log('🏟️  QUADRAS (7 quadras):')
      console.log('   - Quadra 1-5 Matriz (Beach Tennis, Vôlei, Futevôlei)')
      console.log('   - Quadra Vila Rosa 1-2 (Beach Tennis, Vôlei)')
      console.log('   - Preços: R$ 80/h (Matriz), R$ 70/h (Vila Rosa)')
      console.log('')
      console.log('👥 CLIENTES (6 usuários):')
      console.log('   - 4 Clientes regulares')
      console.log('   - 1 Professor')
      console.log('   - 1 Administrador')
      console.log('')
      console.log('📅 RESERVAS (50 reservas):')
      console.log('   - Próximos 30 dias')
      console.log('   - Horários aleatórios')
      console.log('   - Status variados')
      console.log('')
      console.log('🎯 LEADS (5 leads):')
      console.log('   - Diferentes origens (Instagram, WhatsApp, Google)')
      console.log('   - Status variados')
      console.log('')
      console.log('📊 RELATÓRIOS (3 registros):')
      console.log('   - Receitas e despesas')
      console.log('   - Dados financeiros')
      console.log('')
      console.log('✅ SCRIPT PRONTO PARA EXECUÇÃO')
      console.log('   Configure as credenciais e execute novamente!')
      
      return
    }

    // Autenticar
    const auth = await authenticateGoogleSheets()
    
    // Conectar à planilha
    console.log('🔗 Conectando à planilha do Google Sheets...')
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, auth)
    await doc.loadInfo()
    
    console.log(`✅ Conectado à planilha: ${doc.title}`)
    console.log('')
    
    // Popular todas as abas
    const resultados = {}
    
    resultados.quadras = await popularQuadras(doc)
    resultados.clientes = await popularClientes(doc)
    resultados.reservas = await popularReservas(doc)
    resultados.leads = await popularLeads(doc)
    resultados.relatorios = await criarRelatorios(doc)
    
    // Resumo final
    console.log('\n🎉 GOOGLE SHEETS POPULADO COM SUCESSO!')
    console.log('=====================================')
    console.log('')
    console.log('📊 RESUMO:')
    console.log(`   🏟️  Quadras: ${resultados.quadras}`)
    console.log(`   👥 Clientes: ${resultados.clientes}`)
    console.log(`   📅 Reservas: ${resultados.reservas}`)
    console.log(`   🎯 Leads: ${resultados.leads}`)
    console.log(`   📊 Relatórios: ${resultados.relatorios}`)
    console.log('')
    console.log('🔗 Acesse sua planilha:')
    console.log(`   https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`)
    console.log('')
    console.log('✅ Agora você pode usar a plataforma Arena Coligados!')
    console.log('   Os dados estão sincronizados com o Google Sheets')
    
  } catch (error) {
    console.error('❌ Erro ao popular Google Sheets:', error.message)
    console.log('')
    console.log('🔧 POSSÍVEIS SOLUÇÕES:')
    console.log('1. Verifique se as credenciais estão corretas')
    console.log('2. Certifique-se de que a planilha foi compartilhada com a Service Account')
    console.log('3. Verifique se a API do Google Sheets está ativada')
    console.log('4. Confirme se o ID da planilha está correto')
  }
}

// Executar
popularGoogleSheets()



