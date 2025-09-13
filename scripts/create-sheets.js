// scripts/create-sheets.js
const { google } = require('googleapis');
const fs = require('fs');

async function main() {
  const email = process.env.GOOGLE_SERVICE_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!email || !rawKey) {
    console.error('Faltam GOOGLE_SERVICE_EMAIL e/ou GOOGLE_PRIVATE_KEY no .env.local');
    process.exit(1);
  }

  const auth = new google.auth.JWT({
    email,
    key: rawKey.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const res = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title: 'ArenaColigados - Data' },
      sheets: [
        { properties: { title: 'leads' } },
        { properties: { title: 'clientes' } },
        { properties: { title: 'reservas' } },
        { properties: { title: 'professores' } },
        { properties: { title: 'quadras' } },
        { properties: { title: 'avaliacoes' } },
        { properties: { title: 'pagamentos' } },
        { properties: { title: 'dashboard' } },
        { properties: { title: 'logs' } },
      ],
    },
  });

  const id  = res.data.spreadsheetId;
  const url = res.data.spreadsheetUrl;
  console.log('\n=== GOOGLE SHEETS CRIADO ===');
  console.log('SPREADSHEET_ID =', id);
  console.log('URL            =', url, '\n');

  // tenta gravar no .env.local localmente
  if (fs.existsSync('.env.local')) {
    let env = fs.readFileSync('.env.local', 'utf8');
    if (!env.includes('GOOGLE_SHEETS_SPREADSHEET_ID=')) {
      fs.appendFileSync('.env.local', `\nGOOGLE_SHEETS_SPREADSHEET_ID=${id}\n`);
      console.log('-> GOOGLE_SHEETS_SPREADSHEET_ID gravado em .env.local');
    } else {
      console.log('-> Já existe GOOGLE_SHEETS_SPREADSHEET_ID em .env.local');
    }
  } else {
    console.log('Atenção: crie/atualize .env.local com GOOGLE_SHEETS_SPREADSHEET_ID=' + id);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
