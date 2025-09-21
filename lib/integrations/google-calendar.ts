import { google } from "googleapis"

const GOOGLE_CLIENT_ID = "818494405964-2qq3r8br7c8ojgbf6ra89l7g09r14bpc.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET // PRECISO DESTA
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN // PRECISO DESTA

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/auth/google/callback",
)

oauth2Client.setCredentials({
  refresh_token: GOOGLE_REFRESH_TOKEN,
})

const calendar = google.calendar({ version: "v3", auth: oauth2Client })

export interface CalendarEvent {
  id?: string
  summary: string
  description?: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  attendees?: Array<{ email: string; displayName?: string }>
}

export async function createCalendarEvent(calendarId: string, event: CalendarEvent) {
  try {
    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    })

    console.log("[v0] Evento criado no Google Calendar:", response.data.id)
    return response.data
  } catch (error) {
    console.error("[v0] Erro ao criar evento no Calendar:", error)
    throw error
  }
}

export async function updateCalendarEvent(calendarId: string, eventId: string, event: Partial<CalendarEvent>) {
  try {
    const response = await calendar.events.update({
      calendarId,
      eventId,
      requestBody: event,
    })

    console.log("[v0] Evento atualizado no Google Calendar:", eventId)
    return response.data
  } catch (error) {
    console.error("[v0] Erro ao atualizar evento no Calendar:", error)
    throw error
  }
}

export async function deleteCalendarEvent(calendarId: string, eventId: string) {
  try {
    await calendar.events.delete({
      calendarId,
      eventId,
    })

    console.log("[v0] Evento deletado do Google Calendar:", eventId)
  } catch (error) {
    console.error("[v0] Erro ao deletar evento do Calendar:", error)
    throw error
  }
}

export async function listCalendarEvents(calendarId: string, timeMin?: string, timeMax?: string) {
  try {
    const response = await calendar.events.list({
      calendarId,
      timeMin: timeMin || new Date().toISOString(),
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
    })

    return response.data.items || []
  } catch (error) {
    console.error("[v0] Erro ao listar eventos do Calendar:", error)
    throw error
  }
}

export const QUADRA_CALENDAR_IDS = {
  "quadra-1": "CALENDAR_ID_QUADRA_1", // PRECISO DO ID REAL
  "quadra-2": "CALENDAR_ID_QUADRA_2", // PRECISO DO ID REAL
  "quadra-3": "CALENDAR_ID_QUADRA_3", // PRECISO DO ID REAL
  // Adicionar mais quadras conforme necessário
}
