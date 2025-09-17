import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function getAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY!;
  // corrige \n da Vercel/local
  privateKey = privateKey.replace(/\\n/g, '\n');

  const jwt = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: SCOPES,
  });
  return jwt;
}

export async function getSheets() {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  return sheets;
}

/** Lê a aba inteira como objetos (linha 1 = headers) */
export async function readSheetAsObjects(spreadsheetId: string, sheetName: string) {
  const sheets = await getSheets();
  const range = `${sheetName}!A1:Z10000`; // ajuste se precisar mais colunas
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const rows = res.data.values ?? [];
  if (rows.length <= 1) return [];

  const headers = rows[0];
  return rows.slice(1).filter(r => r.some(c => c !== '')).map(r => {
    const obj: Record<string, any> = {};
    headers.forEach((h, i) => (obj[String(h)] = r[i] ?? null));
    return obj;
  });
}

/** Anexa um objeto respeitando a ordem dos headers da linha 1 */
export async function appendObject(spreadsheetId: string, sheetName: string, data: Record<string, any>) {
  const sheets = await getSheets();

  // pega headers
  const meta = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!1:1`,
  });
  const headers = (meta.data.values?.[0] ?? []) as string[];
  if (!headers.length) throw new Error(`Sem headers na aba: ${sheetName}`);

  const row = headers.map((h) => data[h] ?? '');
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  });
}
