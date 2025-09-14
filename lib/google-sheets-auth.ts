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

  // Tratamento robusto da chave privada
  let formattedPrivateKey = privateKey;
  
  // Se a chave não começa com -----BEGIN, pode estar em formato diferente
  if (!formattedPrivateKey.includes('-----BEGIN')) {
    throw new Error('Invalid private key format - must start with -----BEGIN PRIVATE KEY-----');
  }
  
  // Substituir quebras de linha escapadas por quebras reais
  formattedPrivateKey = formattedPrivateKey.replace(/\\n/g, '\n');
  
  // Garantir que termina com quebra de linha
  if (!formattedPrivateKey.endsWith('\n')) {
    formattedPrivateKey += '\n';
  }

  return {
    privateKey: formattedPrivateKey,
    clientEmail,
    spreadsheetId
  };
}

// Função para criar cliente autenticado
export function createGoogleSheetsClient() {
  try {
    const config = getGoogleSheetsConfig();
    
    // Usar GoogleAuth com credenciais completas (mais robusto que JWT)
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: "credencial-n8n-471801",
        private_key_id: "69a3c66a99a364b1fa4a9eb6142eeb2d8a60c9f0",
        private_key: config.privateKey,
        client_email: config.clientEmail,
        client_id: "115903598446847987846",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(config.clientEmail)}`
      },
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
