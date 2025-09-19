// lib/google-sheets.ts - Solução definitiva com JWT
import { google } from 'googleapis';

// Configuração usando JWT (mais estável que GoogleAuth)
const SERVICE_ACCOUNT_EMAIL = "arenasheets@credencial-n8n-471801.iam.gserviceaccount.com";
const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCawgYIQEudz88x
f/Uq0ubuJoncEZ0W6P0GdppirPS1cikKf/gFm74HozaPDi2AZtPMqtcr3RwlzJ8o
hyCBLqCwowm9m7Q1qk8b+EVnIu0D4NVEYkaxml9R5Ex8bc0VBVhKime+wFhU7OUa
rbHjG60WPwMAkXqOGtT9jKC22+Yv89ADC+U0p+3F7WbcW5Xif3+PYMDfM30/Cfdd
P/WrqlWfdDDGKG57SKrMdMWZxinUg0S3UruZSWwKNxBLtGNS58pUiBRjObsy/rtJ
vcNOTH3GgrDpludcYqqVXbJzh/cQd2M2kGCHI53yLvqhZLPawOpk3/cqa9PHKxbp
NqqqYO9bAgMBAAECggEAQEKimJiCDZR1t1snpVGPvIHaKrxRm2rBbgafkqu4rQMr
UYXTqhiCbs9x3zMG59NKzSh/UmJsxrFRwVVixOFkrhP0/nuB9+qxEK8lum7BNiQM
yml4a1TrkaiXre82Ai2G/OS9sXJS+2imtU48mE4ssBkYGQtPdWRk3qefMG7dBTm1
qI+6y6465P+8G1Xo+TMjqQ0z9HR4AmiOLGvv8LqWBHVepfXpzLHTDIqFPGHQYvYh
t5TNtWMDQ8vHOn/mLtenD0J+CnIpgcf8Q6QUrEl4PBsPr6zjb6iS6/V5HaPM5k+h
xPb8ZGwpF0Wp91gPdeOpWuIfJOlAxi2BSPgJ7rX98QKBgQDS+e3OADEog60fkJei
1EyB81OCkddTMHD04bJvvqomc0//jxzdnUx5y8WBj/GOB6p1M88HOqA1Lfw1AJcS
JgalspHgRoSup2F5heIrUQmUYig1/xWzdKOirQNCjezqm1+cY+QhgXQy+/vuv+T+
5tvqxlcV82sje6paSjZcQIBdkwKBgQC7yMSnAo7ip4Owo0zGdsdaoHl0gpUVUxYy
Nx+RTWRdWi+yQsVQjaaM0G3sy9rd2clUSmXmTUAx4E/wJY87kboYLaK65AH5AcsN
Ea5N3bBx7HbkXVV1OWRNPlw24N18tDEcE02WPhhtI9++KG3tz4svXY3f72Z1niSi
oj5gWwiEGQKBgHhNH3bJ0T4i54MKNg0ZNY8cKtBXTQsYojBgyhjCBc/rDQDSoEkW
OtdwhGy+oaS1ZlNyeWjL2zK3yAqJDZvBpySw0FGspFfbBc//sdm1WdsMpZU0oTE1
H2HRefxnZWLZugk5RIp+gL3Zxex7654WEeyrsFjJ9pvDFn5pttmfxhKVAoGAPItM
rDQs8XLlCKx98ncVa2jV//SiMI/rViFjsitrspWDT0wr5f7ltfz1lCVd2a2ANgcO
t6QskGgsHddeSOyBPY5pKyycXjZvyzTqJ/zUCMcexh45kWQBrM3wWVlC0BQgyVaH
62r14Spx1xOd7dC+pXTaa1r6g+2LDkyVI+f15PECgYEAu0GyPoIIkNvCxqmyiR6C
6ni9EyiHSqyLXf5Md/6GMuKHXQwCCMgGKM71AsLe8g2EDyXLryrf91jMbQnlIKha
tY5guBukQJkJK1AF3h+wmlus1loCb3arovJwf/dKjM/0/eIehgB7Ds27U/TxTb76
swl0ESpjLR4aHSbFnzXL+6g=
-----END PRIVATE KEY-----`;
const SPREADSHEET_ID = "174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew";

// Cliente singleton
let sheetsClient: any = null;

function getSheetsClient() {
  if (!sheetsClient) {
    try {
      // Usar JWT em vez de GoogleAuth (mais estável)
      const auth = new google.auth.JWT({
        email: SERVICE_ACCOUNT_EMAIL,
        key: PRIVATE_KEY,
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
    const sheets = getSheetsClient();
    
    console.log(`Reading range: ${range} from spreadsheet: ${SPREADSHEET_ID}`);
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
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
    const sheets = getSheetsClient();
    
    console.log(`Appending row to range: ${range}`);
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
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
    const sheets = getSheetsClient();
    
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    });

    return {
      title: response.data.properties?.title,
      sheets: response.data.sheets?.map((sheet: any) => ({
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
