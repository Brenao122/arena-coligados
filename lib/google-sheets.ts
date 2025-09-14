// lib/google-sheets.ts - Biblioteca robusta para Google Sheets
import { google } from 'googleapis';

interface GoogleSheetsConfig {
  privateKey: string;
  clientEmail: string;
  spreadsheetId: string;
  projectId: string;
  privateKeyId: string;
  clientId: string;
}

// Configuração completa das credenciais
function getGoogleSheetsConfig(): GoogleSheetsConfig {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
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
    spreadsheetId,
    projectId: "credencial-n8n-471801",
    privateKeyId: "69a3c66a99a364b1fa4a9eb6142eeb2d8a60c9f0",
    clientId: "115903598446847987846"
  };
}

// Cliente Google Sheets singleton
let sheetsClient: any = null;

function getSheetsClient() {
  if (!sheetsClient) {
    try {
      const config = getGoogleSheetsConfig();
      
      const auth = new google.auth.GoogleAuth({
        credentials: {
          type: "service_account",
          project_id: config.projectId,
          private_key_id: config.privateKeyId,
          private_key: config.privateKey,
          client_email: config.clientEmail,
          client_id: config.clientId,
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(config.clientEmail)}`
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });

      sheetsClient = google.sheets({ version: 'v4', auth });
    } catch (error) {
      console.error('Failed to create Google Sheets client:', error);
      throw error;
    }
  }
  
  return sheetsClient;
}

// Função para ler dados da planilha
export async function readSheet(range: string) {
  try {
    const config = getGoogleSheetsConfig();
    const sheets = getSheetsClient();
    
    console.log(`Reading range: ${range} from spreadsheet: ${config.spreadsheetId}`);
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: config.spreadsheetId,
      range: range
    });

    const values = response.data.values || [];
    console.log(`Successfully read ${values.length} rows from ${range}`);
    
    return values;
  } catch (error) {
    console.error(`Failed to read sheet ${range}:`, error);
    throw error;
  }
}

// Função para adicionar dados à planilha
export async function appendRow(range: string, row: (string | number | null)[]) {
  try {
    const config = getGoogleSheetsConfig();
    const sheets = getSheetsClient();
    
    console.log(`Appending row to range: ${range}`);
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: config.spreadsheetId,
      range: range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row]
      }
    });

    console.log(`Successfully appended row to ${range}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to append to sheet ${range}:`, error);
    throw error;
  }
}

// Função para obter informações da planilha
export async function getSpreadsheetInfo() {
  try {
    const config = getGoogleSheetsConfig();
    const sheets = getSheetsClient();
    
    const response = await sheets.spreadsheets.get({
      spreadsheetId: config.spreadsheetId
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

// Função para testar conectividade
export async function testConnection() {
  try {
    const info = await getSpreadsheetInfo();
    return {
      success: true,
      title: info.title,
      sheets: info.sheets,
      message: 'Connection successful'
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error: error
    };
  }
}
