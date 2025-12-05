"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone } from "lucide-react"

interface UnitSelectorProps {
  onSelect: (unidade: string) => void
  selected?: string
}

export function UnitSelector({ onSelect, selected }: UnitSelectorProps) {
  const units = [
    {
      id: "Parque Amazônia",
      name: "Parque Amazônia",
      address: "Parque Amazônia, Goiânia - GO",
      phone: "(62) 3225-5400",
      quadras: 5,
    },
    {
      id: "Vila Rosa",
      name: "Vila Rosa",
      address: "Vila Rosa, Goiânia - GO",
      phone: "(62) 3224-1000",
      quadras: 4,
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Selecione a Unidade</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {units.map((unit) => (
          <Card
            key={unit.id}
            className={`cursor-pointer transition-all border-2 ${
              selected === unit.id
                ? "border-orange-500 bg-orange-900/20"
                : "border-gray-700 bg-gray-800 hover:border-orange-400"
            }`}
            onClick={() => onSelect(unit.id)}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{unit.name}</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="h-4 w-4 text-orange-400" />
                  <span className="text-sm">{unit.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone className="h-4 w-4 text-green-400" />
                  <span className="text-sm">{unit.phone}</span>
                </div>
              </div>
              <div className="bg-gray-700 rounded px-3 py-1 inline-block">
                <span className="text-sm text-gray-200">{unit.quadras} Quadras</span>
              </div>
              <Button
                className={`w-full mt-4 ${
                  selected === unit.id ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {selected === unit.id ? "Selecionado" : "Selecionar"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
