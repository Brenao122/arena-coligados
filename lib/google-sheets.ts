// lib/google-sheets.ts
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "./credencial-temp.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

export const sheets = google.sheets({ version: "v4", auth });

export async function readSheet(range: string) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  return res.data.values ?? [];
}

export async function appendRow(range: string, row: (string | number)[]) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
  return res.data;
}