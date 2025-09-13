// scripts/test-google-auth.cjs
const { google } = require("googleapis");
const fs = require("fs");

async function main() {
  // Tentar usar o arquivo JSON diretamente primeiro
  const keyFile = "./credencial-n8n-471801-9053afc725ed.json";
  
  if (fs.existsSync(keyFile)) {
    console.log("🔑 Usando arquivo JSON diretamente...");
    const auth = new google.auth.GoogleAuth({
      keyFile: keyFile,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });
    
    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: authClient });
    
    const spreadsheetId = "174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew";
    
    try {
      const { data } = await sheets.spreadsheets.get({
        spreadsheetId,
        fields: "properties.title,sheets.properties.title",
      });
      console.log("✅ Sucesso com arquivo JSON!");
      console.log("Título:", data.properties?.title);
      console.log("Abas:", (data.sheets || []).map(s => s.properties?.title));
      return;
    } catch (e) {
      console.error("❌ Falha com arquivo JSON:", e?.response?.data || e?.message);
    }
  }
  
  // Fallback para .env.local
  console.log("🔄 Tentando com .env.local...");
  require("dotenv").config({ path: ".env.local" });
  
  const email = process.env.GOOGLE_SERVICE_EMAIL;
  const keyRaw = process.env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!email || !keyRaw || !spreadsheetId) {
    throw new Error("Env faltando (email/key/id). Confira .env.local");
  }

  const privateKey = keyRaw.includes("\\n") ? keyRaw.replace(/\\n/g, "\n") : keyRaw;
  
  const auth = new google.auth.JWT(
    email,
    undefined,
    privateKey,
    ["https://www.googleapis.com/auth/spreadsheets"]
  );

  // Força a autorização e mostra token/header
  try {
    const tokenInfo = await auth.authorize();   // <- se falhar, chave/email/escopo estão errados
    console.log("authorize() OK:", !!tokenInfo);

    const token = await auth.getAccessToken();
    console.log("getAccessToken OK:", !!(token && token.token));

    const headers = await auth.getRequestHeaders();
    console.log("Authorization presente?", !!headers.Authorization);
  } catch (e) {
    console.error("FALHA ao autorizar:", e && (e.response?.data || e.message || e));
    process.exit(1);
  }

  // Chama a API
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const { data } = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: "properties.title,sheets.properties.title",
    });
    console.log("Título:", data.properties?.title);
    console.log("Abas:", (data.sheets || []).map(s => s.properties?.title));
  } catch (e) {
    console.error("FALHA na chamada:", e && (e.response?.data || e.message || e));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("ERRO:", e?.message || e);
  process.exit(1);
});
