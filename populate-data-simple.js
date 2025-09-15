// populate-data-simple.js
// Script simples para popular dados de teste

const fs = require('fs')
const path = require('path')

// Dados de teste
const testData = {
  quadras: [
    { nome: 'Quadra 1', tipo: 'Futebol Society', capacidade: 14, preco_hora: 80.00, descricao: 'Quadra de futebol society com gramado sintético', ativo: true },
    { nome: 'Quadra 2', tipo: 'Futebol Society', capacidade: 14, preco_hora: 80.00, descricao: 'Quadra de futebol society com gramado sintético', ativo: true },
    { nome: 'Quadra 3', tipo: 'Futebol 7', capacidade: 16, preco_hora: 100.00, descricao: 'Quadra de futebol 7 com gramado natural', ativo: true }
  ],
  clientes: [
    { nome: 'João Silva', email: 'joao@email.com', telefone: '(11) 99999-1111', role: 'cliente', ativo: true },
    { nome: 'Maria Santos', email: 'maria@email.com', telefone: '(11) 99999-2222', role: 'cliente', ativo: true },
    { nome: 'Pedro Costa', email: 'pedro@email.com', telefone: '(11) 99999-3333', role: 'cliente', ativo: true },
    { nome: 'Ana Oliveira', email: 'ana@email.com', telefone: '(11) 99999-4444', role: 'cliente', ativo: true },
    { nome: 'Carlos Lima', email: 'carlos@email.com', telefone: '(11) 99999-5555', role: 'cliente', ativo: true }
  ],
  leads: [
    { nome: 'João Silva', telefone: '(11) 99999-1111', interesse: 'Aula particular', origem: 'Facebook', status: 'novo' },
    { nome: 'Maria Santos', telefone: '(11) 99999-2222', interesse: 'Locação', origem: 'Instagram', status: 'contatado' },
    { nome: 'Pedro Costa', telefone: '(11) 99999-3333', interesse: 'Evento', origem: 'Indicação', status: 'novo' },
    { nome: 'Ana Oliveira', telefone: '(11) 99999-4444', interesse: 'Aula particular', origem: 'Google', status: 'convertido' },
    { nome: 'Carlos Lima', telefone: '(11) 99999-5555', interesse: 'Locação', origem: 'Facebook', status: 'novo' }
  ],
  reservas: [
    { cliente_nome: 'João Silva', quadra_nome: 'Quadra 1', data_inicio: '2024-01-20 10:00:00', data_fim: '2024-01-20 12:00:00', valor_total: 160.00, status: 'confirmada', tipo: 'locacao' },
    { cliente_nome: 'Maria Santos', quadra_nome: 'Quadra 2', data_inicio: '2024-01-21 14:00:00', data_fim: '2024-01-21 16:00:00', valor_total: 160.00, status: 'pendente', tipo: 'locacao' },
    { cliente_nome: 'Pedro Costa', quadra_nome: 'Quadra 3', data_inicio: '2024-01-22 18:00:00', data_fim: '2024-01-22 20:00:00', valor_total: 200.00, status: 'confirmada', tipo: 'aula_particular' },
    { cliente_nome: 'Ana Oliveira', quadra_nome: 'Quadra 1', data_inicio: '2024-01-23 09:00:00', data_fim: '2024-01-23 11:00:00', valor_total: 160.00, status: 'confirmada', tipo: 'locacao' },
    { cliente_nome: 'Carlos Lima', quadra_nome: 'Quadra 2', data_inicio: '2024-01-24 15:00:00', data_fim: '2024-01-24 17:00:00', valor_total: 160.00, status: 'pendente', tipo: 'locacao' }
  ]
}

// Criar diretório data se não existir
const dataDir = path.join(__dirname, 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir)
}

// Salvar dados em arquivos JSON
console.log('🚀 Criando dados de teste...\n')

Object.keys(testData).forEach(key => {
  const filePath = path.join(dataDir, `${key}.json`)
  fs.writeFileSync(filePath, JSON.stringify(testData[key], null, 2))
  console.log(`✅ ${key}.json criado com ${testData[key].length} registros`)
})

console.log('\n📊 Resumo dos dados criados:')
console.log(`   - Quadras: ${testData.quadras.length}`)
console.log(`   - Clientes: ${testData.clientes.length}`)
console.log(`   - Leads: ${testData.leads.length}`)
console.log(`   - Reservas: ${testData.reservas.length}`)

console.log('\n🎉 Dados de teste criados com sucesso!')
console.log('   Os arquivos estão em: ./data/')
console.log('   Agora você pode acessar a plataforma e ver os dados.')
