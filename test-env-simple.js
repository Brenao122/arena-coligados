// Teste simples das variáveis de ambiente
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testando variáveis de ambiente...');
console.log('GOOGLE_SERVICE_EMAIL:', process.env.GOOGLE_SERVICE_EMAIL ? '✅ Presente' : '❌ Ausente');
console.log('GOOGLE_PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? '✅ Presente' : '❌ Ausente');
console.log('GOOGLE_SHEETS_SPREADSHEET_ID:', process.env.GOOGLE_SHEETS_SPREADSHEET_ID ? '✅ Presente' : '❌ Ausente');

if (process.env.GOOGLE_PRIVATE_KEY) {
  console.log('🔑 Chave privada (primeiros 50 chars):', process.env.GOOGLE_PRIVATE_KEY.substring(0, 50) + '...');
  console.log('🔑 Chave privada (últimos 50 chars):', '...' + process.env.GOOGLE_PRIVATE_KEY.substring(process.env.GOOGLE_PRIVATE_KEY.length - 50));
  console.log('🔑 Chave contém \\n?', process.env.GOOGLE_PRIVATE_KEY.includes('\\n'));
  console.log('🔑 Chave contém quebras de linha reais?', process.env.GOOGLE_PRIVATE_KEY.includes('\n'));
}
