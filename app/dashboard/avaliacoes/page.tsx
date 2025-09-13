import { SistemaAvaliacao } from "@/components/avaliacoes/sistema-avaliacao"

export default function AvaliacoesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text text-transparent">
            Sistema de AvaliaçÃµes
          </h1>
          <p className="text-gray-400 mt-2">Feedback positivo e construtivo para crescimento contínuo</p>
        </div>
      </div>

      <SistemaAvaliacao tipo="professor" professorId="1" />
    </div>
  )
}


