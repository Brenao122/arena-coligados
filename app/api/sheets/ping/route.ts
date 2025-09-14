import { NextResponse } from "next/server";
import { sheets } from "@/lib/google-sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
    const { data } = await sheets.spreadsheets.get({ spreadsheetId });
    return NextResponse.json({ ok: true, title: data.properties?.title ?? null });
  } catch (e: any) {
    console.error("PING ERROR:", e?.response?.data || e);
    return NextResponse.json({
      ok: false,
      message: e?.response?.data?.error?.message || e?.message || String(e),
      code: e?.response?.data?.error?.code || null,
    }, { status: 500 });
  }
}
