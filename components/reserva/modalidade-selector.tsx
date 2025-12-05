"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ModalidadeSelectorProps {
  onSelect: (modalidade: string) => void
  selected?: string
}

export function ModalidadeSelector({ onSelect, selected }: ModalidadeSelectorProps) {
  const modalidades = [
    {
      id: "Beach Tennis",
      name: "Beach Tennis",
      description: "Partidas dinâmicas de beach tennis",
      icon: "🎾",
    },
    {
      id: "Vôlei",
      name: "Vôlei",
      description: "Jogo clássico de vôlei de areia",
      icon: "🏐",
    },
    {
      id: "Futevôlei",
      name: "Futevôlei",
      description: "Fusão do futebol com vôlei",
      icon: "⚽",
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Escolha a Modalidade</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {modalidades.map((mod) => (
          <Card
            key={mod.id}
            className={`cursor-pointer transition-all border-2 ${
              selected === mod.id
                ? "border-green-500 bg-green-900/20"
                : "border-gray-700 bg-gray-800 hover:border-green-400"
            }`}
            onClick={() => onSelect(mod.id)}
          >
            <div className="p-6 text-center">
              <div className="text-4xl mb-3">{mod.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{mod.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{mod.description}</p>
              <Button
                className={`w-full ${
                  selected === mod.id ? "bg-green-500 hover:bg-green-600" : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {selected === mod.id ? "Selecionado" : "Selecionar"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
