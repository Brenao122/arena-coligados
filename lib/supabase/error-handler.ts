export interface DatabaseError {
  code: string
  message: string
  details?: string
}

export function handleDatabaseError(error: any): DatabaseError {
  // UUID validation errors
  if (error.message?.includes("invalid input syntax for type uuid")) {
    return {
      code: "INVALID_UUID",
      message: "ID inválido fornecido",
      details: "O identificador fornecido não é um UUID válido",
    }
  }

  // Column not found errors
  if (error.message?.includes("column") && error.message?.includes("does not exist")) {
    return {
      code: "COLUMN_NOT_FOUND",
      message: "Erro de estrutura do banco de dados",
      details: "Uma coluna esperada não foi encontrada na tabela",
    }
  }

  // RLS policy errors
  if (error.message?.includes("row-level security policy")) {
    return {
      code: "PERMISSION_DENIED",
      message: "Acesso negado",
      details: "Você não tem permissão para realizar esta operação",
    }
  }

  // Generic database error
  return {
    code: "DATABASE_ERROR",
    message: "Erro interno do sistema",
    details: error.message || "Erro desconhecido",
  }
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}
