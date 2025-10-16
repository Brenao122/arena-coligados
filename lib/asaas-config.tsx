// ============================================
// CONFIGURAÇÕES DO ASAAS
// ============================================

// VALOR DA COBRANÇA PIX
// Altere este valor para mudar o preço da reserva
// Mínimo: R$ 5,00 (exigido pelo Asaas)
export const ASAAS_PAYMENT_VALUE = 5.0

// URL DA API ASAAS
// Produção: https://api.asaas.com/v3
// Sandbox: https://sandbox.asaas.com/api/v3
export const ASAAS_API_URL = "https://api.asaas.com/v3"

// CHAVES API POR UNIDADE
// Cada unidade (Parque Amazônia e Vila Rosa) tem sua própria conta Asaas
// Para trocar as chaves: vá em "Vars" no sidebar e altere as variáveis correspondentes

export const ASAAS_API_KEYS = {
  "Parque Amazônia": process.env.ASAAS_API_KEY_PARQUE_AMAZONIA || process.env.ASAAS_API_KEY,
  "Vila Rosa": process.env.ASAAS_API_KEY_VILA_ROSA || process.env.ASAAS_API_KEY,
}

// Função para obter a chave API correta baseada na unidade
export function getAsaasApiKey(unidade: string): string | undefined {
  return ASAAS_API_KEYS[unidade as keyof typeof ASAAS_API_KEYS]
}
// </CHANGE>
