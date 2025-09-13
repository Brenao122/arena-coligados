export function normalizePhone(input: string) {
  const digits = (input || "").replace(/\D/g, "")
  if (digits.startsWith("55")) return `+${digits}`
  return `+55${digits}`
}

