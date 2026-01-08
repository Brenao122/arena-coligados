// Mock para compatibilidade após remoção do Supabase

export type SchemaType = "tstzrange" | "separate_columns"

export async function detectReservasSchema(): Promise<SchemaType> {
  // Retorna o schema padrão
  return "separate_columns"
}

export async function fetchReservasWithSchema() {
  // Retorna dados mock
  return {
    data: [],
    error: null,
    schema: "separate_columns" as SchemaType,
  }
}
