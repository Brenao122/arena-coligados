// lib/google-sheets-auth.ts - Autenticação robusta para Google Sheets
import { google } from "googleapis";

export interface GoogleSheetsConfig {
  privateKey: string;
  clientEmail: string;
  spreadsheetId: string;
}

// Função para obter configuração das variáveis de ambiente
export function getGoogleSheetsConfig(): GoogleSheetsConfig {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!privateKey || !clientEmail || !spreadsheetId) {
    throw new Error(`Google Sheets configuration missing:
    - Private Key: ${!!privateKey}
    - Client Email: ${!!clientEmail}
    - Spreadsheet ID: ${!!spreadsheetId}`);
  }

  return {
    privateKey: privateKey.replace(/\\n/g, '\n'),
    clientEmail,
    spreadsheetId
  };
}

// Função para criar cliente autenticado
export function createGoogleSheetsClient() {
  try {
    const config = getGoogleSheetsConfig();
    
    const auth = new google.auth.JWT({
      email: config.clientEmail,
      key: config.privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    return {
      auth,
      sheets: google.sheets({ version: 'v4', auth }),
      spreadsheetId: config.spreadsheetId
    };
  } catch (error) {
    console.error('Failed to create Google Sheets client:', error);
    throw error;
  }
}

// Função para ler dados da planilha
export async function readGoogleSheet(range: string) {
  try {
    const { sheets, spreadsheetId } = createGoogleSheetsClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range
    });

    return response.data.values || [];
  } catch (error) {
    console.error('Failed to read Google Sheet:', error);
    throw error;
  }
}

// Função para adicionar dados à planilha
export async function appendToGoogleSheet(range: string, values: (string | number | null)[][]) {
  try {
    const { sheets, spreadsheetId } = createGoogleSheetsClient();
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values
      }
    });

    return response.data;
  } catch (error) {
    console.error('Failed to append to Google Sheet:', error);
    throw error;
  }
}

// Função para obter informações da planilha
export async function getSpreadsheetInfo() {
  try {
    const { sheets, spreadsheetId } = createGoogleSheetsClient();
    
    const response = await sheets.spreadsheets.get({
      spreadsheetId
    });

    return {
      title: response.data.properties?.title,
      sheets: response.data.sheets?.map(sheet => ({
        title: sheet.properties?.title,
        sheetId: sheet.properties?.sheetId
      })) || []
    };
  } catch (error) {
    console.error('Failed to get spreadsheet info:', error);
    throw error;
  }
}
