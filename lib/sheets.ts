// lib/sheets.ts
import { google } from "googleapis";

function required(name: string, value?: string) {
  if (!value || !value.trim()) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

const clientEmail = required("GOOGLE_CLIENT_EMAIL", process.env.GOOGLE_CLIENT_EMAIL);
const privateKey = required("GOOGLE_PRIVATE_KEY", process.env.GOOGLE_PRIVATE_KEY)
  // quando a chave vem com \n, convertemos para quebra real
  .replace(/\\n/g, "\n");

export const spreadsheetId = required(
  "GOOGLE_SHEETS_SPREADSHEET_ID",
  process.env.GOOGLE_SHEETS_SPREADSHEET_ID
);

export function getSheetsClient() {
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  return sheets;
}

/**
 * Lê um range (ex.: "reservas!A1:G200")
 */
export async function readRange(range: string) {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  return res.data.values ?? [];
}

/**
 * Faz append (acrescenta linhas) em um range (ex.: "leads!A1").
 * `values` deve ser array de linhas: [ [col1, col2, ...], ... ]
 */
export async function appendRows(range: string, values: any[][]) {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });
  return res.data;
}