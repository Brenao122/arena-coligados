import { NextResponse } from "next/server";
import { google } from "googleapis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    // Diagnóstico das variáveis de ambiente
    const hasPrivateKey = !!process.env.GOOGLE_PRIVATE_KEY;
    const hasServiceEmail = !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const hasSpreadsheetId = !!process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    
    console.log("READ ENV CHECK:", {
      hasPrivateKey,
      hasServiceEmail,
      hasSpreadsheetId,
      privateKeyLength: process.env.GOOGLE_PRIVATE_KEY?.length || 0
    });

    if (!hasPrivateKey || !hasServiceEmail || !hasSpreadsheetId) {
      throw new Error(`Google Sheets credentials not configured: PK=${hasPrivateKey}, Email=${hasServiceEmail}, SheetID=${hasSpreadsheetId}`);
    }

    const { searchParams } = new URL(req.url);
    const sheet = searchParams.get("sheet") || "reservas";
    const range = `${sheet}!A:Z`;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: "credencial-n8n-471801",
        private_key_id: "69a3c66a99a364b1fa4a9eb6142eeb2d8a60c9f0",
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        client_id: "115903598446847987846",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL)}`
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range
    });

    const values = response.data.values ?? [];

    return NextResponse.json({ ok: true, values });
  } catch (err: any) {
    console.error("READ ERROR:", JSON.stringify({
      message: err?.message,
      errors: err?.errors,
      code: err?.code,
      stack: err?.stack,
      sheet: searchParams.get("sheet"),
      range: `${searchParams.get("sheet") || "reservas"}!A:Z`
    }, null, 2));
    return NextResponse.json(
      { ok: false, message: err?.message ?? "read-error" },
      { status: 500 }
    );
  }
}