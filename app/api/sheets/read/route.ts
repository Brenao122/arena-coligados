import { NextResponse } from "next/server";
import { readGoogleSheet } from "@/lib/google-sheets-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sheet = searchParams.get("sheet") || "Reservas";
    const range = `${sheet}!A:Z`;

    console.log(`Reading sheet: ${range}`);

    const values = await readGoogleSheet(range);

    return NextResponse.json({ 
      ok: true, 
      values,
      sheet,
      range,
      count: values.length
    });
  } catch (err: any) {
    console.error("READ ERROR:", JSON.stringify({
      message: err?.message,
      stack: err?.stack,
      sheet: new URL(req.url).searchParams.get("sheet"),
      env: {
        hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
        hasServiceEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        hasSpreadsheetId: !!process.env.GOOGLE_SHEETS_SPREADSHEET_ID
      }
    }, null, 2));
    
    return NextResponse.json({
      ok: false,
      message: err?.message || "Failed to read Google Sheet",
      error: process.env.NODE_ENV === 'development' ? err?.stack : undefined
    }, { status: 500 });
  }
}