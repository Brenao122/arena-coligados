// Script para debugar os dados do dashboard
async function debugDashboard() {
  try {
    console.log('🔍 Testando APIs do dashboard...');
    
    // Testar API local
    const response = await fetch('http://localhost:3000/api/sheets/read?sheet=reservas');
    const result = await response.json();
    
    console.log('\n=== DADOS DA API LOCAL ===');
    console.log('Status:', response.status);
    console.log('OK:', result.ok);
    console.log('Sheet:', result.sheet);
    console.log('Range:', result.range);
    console.log('Valores encontrados:', result.values?.length || 0);
    
    if (result.values && result.values.length > 0) {
      console.log('\nCabeçalhos:', result.values[0]);
      console.log('Primeira linha de dados:', result.values[1]);
      console.log('Segunda linha de dados:', result.values[2]);
    }
    
    // Simular o processamento do dashboard
    console.log('\n=== SIMULANDO PROCESSAMENTO DO DASHBOARD ===');
    const reservas = result.ok ? result.values?.slice(1) || [] : [];
    console.log('Reservas processadas:', reservas.length);
    
    if (reservas.length > 0) {
      console.log('Primeira reserva (array):', reservas[0]);
      
      // Tentar calcular reservas de hoje
      const hoje = new Date().toISOString().split('T')[0];
      console.log('Data de hoje:', hoje);
      
      const reservasHoje = reservas.filter((r) => {
        const dataReserva = r[4] || r[5]; // data_inicio ou data_fim
        console.log('Data da reserva:', dataReserva, 'Contém hoje?', dataReserva && dataReserva.includes(hoje));
        return dataReserva && dataReserva.includes(hoje);
      });
      
      console.log('Reservas de hoje:', reservasHoje.length);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

// Executar se estiver no Node.js
if (typeof window === 'undefined') {
  debugDashboard();
}
