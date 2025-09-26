import { readSheetData, updateSheetData } from "./google-sheets-complete"
import { createCalendarEvent, QUADRA_CALENDAR_IDS } from "./google-calendar"
import { createBrowserClient } from "@/lib/supabase/browser-client"

export class SyncManager {
  private supabase = createBrowserClient()

  async syncReservasToCalendar() {
    try {
      console.log("[v0] Iniciando sincronização Sheets -> Calendar")

      const reservas = await readSheetData("Reservas")

      for (const reserva of reservas) {
        if (reserva.quadra && reserva.data_hora && reserva.cliente) {
          const calendarId = QUADRA_CALENDAR_IDS[reserva.quadra as keyof typeof QUADRA_CALENDAR_IDS]

          if (calendarId) {
            const event = {
              summary: `Reserva - ${reserva.cliente}`,
              description: `Quadra: ${reserva.quadra}\nCliente: ${reserva.cliente}\nProfessor: ${reserva.professor || "N/A"}`,
              start: {
                dateTime: new Date(reserva.data_hora).toISOString(),
                timeZone: "America/Sao_Paulo",
              },
              end: {
                dateTime: new Date(new Date(reserva.data_hora).getTime() + 60 * 60 * 1000).toISOString(),
                timeZone: "America/Sao_Paulo",
              },
            }

            if (!reserva.calendar_event_id) {
              const createdEvent = await createCalendarEvent(calendarId, event)
              // Atualizar planilha com o ID do evento
              await this.updateReservaInSheet(reserva.id, { calendar_event_id: createdEvent.id })
            }
          }
        }
      }

      console.log("[v0] Sincronização Sheets -> Calendar concluída")
    } catch (error) {
      console.error("[v0] Erro na sincronização Sheets -> Calendar:", error)
    }
  }

  async syncSheetsToPlataform() {
    try {
      console.log("[v0] Iniciando sincronização Sheets -> Plataforma")

      // Sincronizar clientes
      const clientes = await readSheetData("Clientes")
      console.log("[v0] Clientes da planilha:", clientes.length)

      // Sincronizar quadras
      const quadras = await readSheetData("Quadras")
      console.log("[v0] Quadras da planilha:", quadras.length)

      // Sincronizar professores
      const professores = await readSheetData("Professores")
      console.log("[v0] Professores da planilha:", professores.length)

      // Sincronizar reservas
      const reservas = await readSheetData("Reservas")
      console.log("[v0] Reservas da planilha:", reservas.length)

      console.log("[v0] Sincronização Sheets -> Plataforma concluída")

      return {
        clientes: clientes.length,
        quadras: quadras.length,
        professores: professores.length,
        reservas: reservas.length,
      }
    } catch (error) {
      console.error("[v0] Erro na sincronização Sheets -> Plataforma:", error)
      throw error
    }
  }

  private async updateReservaInSheet(reservaId: string, data: any) {
    try {
      const reservas = await readSheetData("Reservas")
      const index = reservas.findIndex((r) => r.id === reservaId)

      if (index !== -1) {
        await updateSheetData("Reservas", index, data)
      }
    } catch (error) {
      console.error("[v0] Erro ao atualizar reserva na planilha:", error)
    }
  }

  async fullSync() {
    try {
      console.log("[v0] Iniciando sincronização completa")

      const stats = await this.syncSheetsToPlataform()
      await this.syncReservasToCalendar()

      console.log("[v0] Sincronização completa finalizada:", stats)
      return stats
    } catch (error) {
      console.error("[v0] Erro na sincronização completa:", error)
      throw error
    }
  }
}

export const syncManager = new SyncManager()
