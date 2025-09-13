import { google } from "googleapis";

export function getSheetsClient() {
  const email = process.env.GOOGLE_SERVICE_EMAIL;
  const keyRaw = process.env.GOOGLE_PRIVATE_KEY;
  if (!email || !keyRaw) throw new Error("Google Sheets envs ausentes");

  const auth = new google.auth.JWT(
    email,
    undefined,
    keyRaw.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
  );

  return google.sheets({ version: "v4", auth });
}

export function getSpreadsheetId(): string {
  const id = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!id) throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID ausente");
  return id;
}
