export const GOOGLE_SHEETS_CONFIG = {
  spreadsheetId: "174HlbAsnc30_T2sJeTdU4xqLPQuojm7wWS8YWfhh5Ew",
  serviceAccountEmail: "arenasheets@credencial-n8n-471801.iam.gserviceaccount.com",
  privateKeyId: "ad26364280808e73a9cd32e67c57c8df22bc1d76",
}

export async function syncReservationToGoogleSheets(reservationData: {
  cliente_nome: string
  quadra_nome: string
  data_inicio: string
  data_fim: string
  valor: number
  status: string
}) {
  try {
    console.log("📊 Sincronizando reserva com Google Sheets:", reservationData)

    // Esta função será implementada com a integração N8N
    // Por enquanto, apenas logamos os dados

    return { success: true, message: "Dados preparados para sincronização" }
  } catch (error) {
    console.error("❌ Erro na sincronização com Google Sheets:", error)
    return { success: false, error }
  }
}
