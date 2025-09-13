export async function GET(){ return Response.json({ ok: true, route: "gs-sync" }); }
export async function POST(){ return Response.json({ ok: true, message: "Google Sheets sync endpoint" }); }
