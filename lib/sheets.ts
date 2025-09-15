import 'server-only'
import { google } from 'googleapis'

export async function readSheet(sheet: string) {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_EMAIL!,
    key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })
  const sheets = google.sheets({ version: 'v4', auth })
  const spreadsheetId = process.env.SHEETS_SPREADSHEET_ID!

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheet,
  })

  return res.data.values ?? []
}
