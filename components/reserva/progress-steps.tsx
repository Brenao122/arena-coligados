"use client"

import { Check } from "lucide-react"

interface ProgressStepsProps {
  steps: string[]
  currentStep: number
}

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                index < currentStep
                  ? "bg-green-500 text-white"
                  : index === currentStep
                    ? "bg-orange-500 text-white ring-2 ring-orange-300"
                    : "bg-gray-700 text-gray-400"
              }`}
            >
              {index < currentStep ? <Check className="h-5 w-5" /> : index + 1}
            </div>
            <p className="text-xs text-center text-gray-400 mt-2 max-w-20 text-pretty">{step}</p>
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 rounded-full ${index < currentStep ? "bg-green-500" : "bg-gray-700"}`}
                style={{ maxWidth: "40px" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
