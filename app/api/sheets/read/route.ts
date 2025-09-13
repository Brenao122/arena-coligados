import { NextResponse } from "next/server";
import { getSheetsClient, getSpreadsheetId } from "@/lib/google/sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sheet = searchParams.get("sheet") ?? "clientes";
    const rangeParam = searchParams.get("range") ?? "A1:Z100";
    const range = `${sheet}!${rangeParam}`;

    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    const { data } = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    return NextResponse.json({ ok: true, sheet, range, values: data.values ?? [] });
  } catch (e: any) {
    console.error("READ ERROR:", e?.response?.data || e);
    return NextResponse.json({
      ok: false,
      message: e?.response?.data?.error?.message || e?.message || String(e),
      status: e?.response?.status || 500,
    }, { status: 500 });
  }
}