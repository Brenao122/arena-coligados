import { getBrowserClient } from "./browser-client"

export type ReservasSchema = "tstzrange" | "separate_columns"

let cachedSchema: ReservasSchema | null = null

export async function detectReservasSchema(): Promise<ReservasSchema> {
  if (cachedSchema) return cachedSchema

  const supabase = getBrowserClient()

  try {
    // Tenta fazer uma query simples para detectar as colunas
    const { data, error } = await supabase.from("reservas").select("*").limit(1)

    if (error) {
      console.log("[v0] Error detecting schema:", error.message)
      // Default para separate_columns se houver erro
      cachedSchema = "separate_columns"
      return cachedSchema
    }

    // Verifica se existe a coluna 'duracao' (TSTZRANGE) ou 'data_inicio'/'data_fim'
    if (data && data.length > 0) {
      const firstRow = data[0]
      if ("duracao" in firstRow) {
        cachedSchema = "tstzrange"
      } else if ("data_inicio" in firstRow && "data_fim" in firstRow) {
        cachedSchema = "separate_columns"
      } else {
        // Fallback para separate_columns
        cachedSchema = "separate_columns"
      }
    } else {
      // Se não há dados, tenta uma query de metadados
      const { data: metaData, error: metaError } = await supabase.from("reservas").select("duracao").limit(1)

      if (metaError && metaError.message.includes('column "duracao" does not exist')) {
        cachedSchema = "separate_columns"
      } else {
        cachedSchema = "tstzrange"
      }
    }

    console.log("[v0] Detected reservas schema:", cachedSchema)
    return cachedSchema
  } catch (error) {
    console.log("[v0] Error in schema detection:", error)
    cachedSchema = "separate_columns"
    return cachedSchema
  }
}

export async function fetchReservasWithSchema(startDate: Date, endDate: Date, additionalFilters?: any) {
  const supabase = getBrowserClient()
  const schema = await detectReservasSchema()

  let query = supabase.from("reservas").select(`
      *,
      profiles:cliente_id (full_name),
      quadras:quadra_id (nome),
      professores:professor_id (
        profiles:profile_id (full_name)
      )
    `)

  // Aplicar filtros adicionais se fornecidos
  if (additionalFilters) {
    Object.entries(additionalFilters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
  }

  if (schema === "tstzrange") {
    const startISO = startDate.toISOString().replace("T", " ").replace("Z", "+00")
    const endISO = endDate.toISOString().replace("T", " ").replace("Z", "+00")
    const range = `[${startISO},${endISO})`

    query = query.overlaps("duracao", range)
  } else {
    const startISO = startDate.toISOString()
    const endISO = endDate.toISOString()

    query = query.lte("data_inicio", endISO).gte("data_fim", startISO)
  }

  return query
}
