import { NextResponse } from "next/server";
import { getSheetsClient, getSpreadsheetId } from "@/lib/google/sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sheet = searchParams.get("sheet") ?? "leads";
    const range = searchParams.get("range") ?? `${sheet}!A1:Z1000`;

    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return NextResponse.json({ ok: true, values: data.values ?? [] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message ?? e) }, { status: 500 });
  }
}