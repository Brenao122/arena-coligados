import { NextResponse } from 'next/server';
import { google } from "googleapis";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type AppendBody = {
  sheet?: string;          // aba, ex: 'leads'
  values: (string | number | null)[][]; // linhas a inserir
};

export async function POST(req: Request) {
  try {
    if (!process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      throw new Error("Google Sheets credentials not configured");
    }

    const body = (await req.json()) as AppendBody;
    const sheet = body.sheet ?? 'leads';
    const values = body.values;
    
    if (!Array.isArray(values) || values.length === 0) {
      return NextResponse.json({ ok: false, error: 'values inválido' }, { status: 400 });
    }

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
    const range = `${sheet}!A1`;
    
    // Adicionar cada linha individualmente
    const results = [];
    for (const row of values) {
      const result = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [row] },
      });
      results.push(result.data);
    }

    return NextResponse.json({ ok: true, updates: results });
  } catch (err: any) {
    console.error("APPEND ERROR:", JSON.stringify(err, null, 2));
    return NextResponse.json(
      { ok: false, message: err?.message ?? "Erro ao adicionar dados" },
      { status: 500 }
    );
  }
}