// Migrado para Google Sheets - schema detector simplificado
// Google Sheets sempre usa formato de colunas separadas

export type ReservasSchema = "separate_columns"

let cachedSchema: ReservasSchema | null = null

export async function detectReservasSchema(): Promise<ReservasSchema> {
  // Google Sheets sempre usa colunas separadas (data_inicio, data_fim)
  cachedSchema = "separate_columns"
  return cachedSchema
}

export async function fetchReservasWithSchema(startDate: Date, endDate: Date, _additionalFilters?: Record<string, unknown>) {
  try {
    // Buscar reservas do Google Sheets
    const response = await fetch('/api/sheets/read?sheet=Reservas')
    const result = await response.json()
    
    if (!result.ok) {
      return { data: [], error: { message: "Erro ao buscar reservas" } }
    }
    
    const reservas = result.values?.slice(1) || []
    
    // Filtrar por data se necessário
    const filteredReservas = reservas.filter((r: any[]) => {
      const dataInicio = new Date(r[4]) // data_inicio na coluna 4
      return dataInicio >= startDate && dataInicio <= endDate
    })
    
    // Transformar para formato esperado
    const transformedData = filteredReservas.map((r: any[]) => ({
      id: r[0],
      cliente_id: r[1],
      quadra_id: r[2],
      professor_id: r[3],
      data_inicio: r[4],
      data_fim: r[5],
      tipo: r[6],
      status: r[7],
      valor_total: parseFloat(r[8]) || 0,
      profiles: { full_name: r[1] }, // cliente
      quadras: { nome: r[2] }, // quadra
      professores: { profiles: { full_name: r[3] } } // professor
    }))
    
    return { data: transformedData, error: null }
  } catch (error) {
    return { data: [], error }
  }
}