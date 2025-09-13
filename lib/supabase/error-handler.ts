export interface DatabaseError {
  code: string
  message: string
  details?: string
}

export function handleDatabaseError(error: unknown): DatabaseError {
  const errorMessage = error instanceof Error ? error.message : String(error)
  
  // UUID validation errors
  if (errorMessage?.includes("invalid input syntax for type uuid")) {
    return {
      code: "INVALID_UUID",
      message: "ID invÃ¡lido fornecido",
      details: "O identificador fornecido nÃ£o Ã© um UUID vÃ¡lido",
    }
  }

  // Column not found errors
  if (errorMessage?.includes("column") && errorMessage?.includes("does not exist")) {
    return {
      code: "COLUMN_NOT_FOUND",
      message: "Erro de estrutura do banco de dados",
      details: "Uma coluna esperada nÃ£o foi encontrada na tabela",
    }
  }

  // RLS policy errors
  if (errorMessage?.includes("row-level security policy")) {
    return {
      code: "PERMISSION_DENIED",
      message: "Acesso negado",
      details: "VocÃª nÃ£o tem permissÃ£o para realizar esta operaÃ§Ã£o",
    }
  }

  // Generic database error
  return {
    code: "DATABASE_ERROR",
    message: "Erro interno do sistema",
    details: errorMessage || "Erro desconhecido",
  }
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

