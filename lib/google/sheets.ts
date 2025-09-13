import "server-only";
import { google } from "googleapis";


export function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "./credencial-n8n-471801-9053afc725ed.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  return google.sheets({ version: "v4", auth });
}

export function getSpreadsheetId(): string {
  return "174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew";
}
