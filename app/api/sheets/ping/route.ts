import { NextResponse } from "next/server";
import { getSpreadsheetInfo } from "@/lib/google-sheets-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const info = await getSpreadsheetInfo();
    return NextResponse.json({ 
      ok: true, 
      title: info.title,
      sheets: info.sheets,
      message: "Google Sheets connection successful"
    });
  } catch (e: any) {
    console.error("PING ERROR:", JSON.stringify({
      message: e?.message,
      stack: e?.stack,
      env: {
        hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
        hasServiceEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        hasSpreadsheetId: !!process.env.GOOGLE_SHEETS_SPREADSHEET_ID
      }
    }, null, 2));
    
    return NextResponse.json({
      ok: false,
      message: e?.message || "Failed to connect to Google Sheets",
      error: process.env.NODE_ENV === 'development' ? e?.stack : undefined
    }, { status: 500 });
  }
}
