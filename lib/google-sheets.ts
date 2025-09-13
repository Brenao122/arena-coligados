// lib/google-sheets.ts
import { google } from 'googleapis';

export type Row = Record<string, any>;

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_EMAIL!;
  const key   = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  if (!email || !key) throw new Error('GOOGLE_SERVICE_EMAIL / GOOGLE_PRIVATE_KEY ausentes');
  return new google.auth.JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

function getSheets() {
  const auth = getAuth();
  return google.sheets({ version: 'v4', auth });
}

function getSpreadsheetId() {
  const id = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!id) throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID ausente');
  return id;
}

export async function appendRows(sheetName: string, rows: Row[]) {
  const sheets = getSheets();
  const spreadsheetId = getSpreadsheetId();
  if (!rows.length) return;

  // monta cabeçalho automaticamente a partir das chaves do primeiro item
  const header = Object.keys(rows[0]);
  const values = rows.map(r => header.map(h => r[h] ?? ''));

  // garante cabeçalho na primeira linha
  await ensureHeader(sheetName, header);

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });
}

export async function readRows<T = Row>(sheetName: string): Promise<T[]> {
  const sheets = getSheets();
  const spreadsheetId = getSpreadsheetId();

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:ZZ`,
  });

  const rows = data.values || [];
  if (rows.length === 0) return [];
  const header = rows[0] as string[];
  return rows.slice(1).map(r => {
    const obj: any = {};
    header.forEach((h, i) => (obj[h] = r[i] ?? ''));
    return obj as T;
  });
}

async function ensureHeader(sheetName: string, header: string[]) {
  const sheets = getSheets();
  const spreadsheetId = getSpreadsheetId();

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId, range: `${sheetName}!A1:ZZ1`,
  });

  const hasHeader = (data.values?.[0]?.length ?? 0) > 0;
  if (!hasHeader) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [header] },
    });
  }
}