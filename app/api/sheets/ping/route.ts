import { NextResponse } from "next/server";
import { google } from "googleapis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      throw new Error("Google Sheets credentials not configured");
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
    const { data } = await sheets.spreadsheets.get({ spreadsheetId });
    return NextResponse.json({ ok: true, title: data.properties?.title ?? null });
  } catch (e: any) {
    console.error("PING ERROR:", JSON.stringify(e, null, 2));
    return NextResponse.json({
      ok: false,
      message: e?.response?.data?.error?.message || e?.message || String(e),
      code: e?.response?.data?.error?.code || null,
    }, { status: 500 });
  }
}
