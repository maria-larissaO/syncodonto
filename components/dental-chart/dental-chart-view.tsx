"use client"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { DentalChart, type ToothCondition, CONDITIONS } from "./dental-chart"
import { ChartLegend } from "./chart-legend"
import { Badge } from "@/components/ui/badge"

interface DentalChartViewProps {
  patientId?: string
}

export function DentalChartView({ patientId }: DentalChartViewProps) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null)
  const [toothData, setToothData] = useState<Record<number, ToothCondition>>({})

  const handleConditionChange = useCallback((tooth: number, condition: ToothCondition) => {
    setToothData(prev => {
      const updated = { ...prev }
      if (condition === "none") {
        delete updated[tooth]
      } else {
        updated[tooth] = condition
      }
      return updated
    })
  }, [])

  const selectedCondition = selectedTooth ? toothData[selectedTooth] || "none" : null
  const selectedConditionDef = selectedCondition ? CONDITIONS.find(c => c.value === selectedCondition) : null

  const registeredCount = Object.keys(toothData).length

  return (
    <div className="space-y-6">
      {/* Legend */}
      <ChartLegend />

      {/* Dental Chart */}
      <Card>
        <CardContent className="p-6">
          <DentalChart
            selectedTooth={selectedTooth}
            onToothSelect={setSelectedTooth}
            toothData={toothData}
            onConditionChange={handleConditionChange}
          />

          <div className="mt-6 flex items-center justify-center">
            <p className="text-xs text-muted-foreground">
              Clique em um dente para alterar sua condicao
              {registeredCount > 0 && (
                <span className="ml-2 text-foreground font-medium">
                  ({registeredCount} dente{registeredCount !== 1 ? "s" : ""} registrado{registeredCount !== 1 ? "s" : ""})
                </span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Selected tooth info */}
      {selectedTooth && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Dente {selectedTooth}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedConditionDef?.value === "none"
                    ? "Nenhuma condicao registrada. Clique no dente para selecionar."
                    : `Condicao: ${selectedConditionDef?.label}`
                  }
                </p>
              </div>
              {selectedConditionDef && selectedConditionDef.value !== "none" && (
                <Badge className={`${selectedConditionDef.dotColor} text-white`}>
                  {selectedConditionDef.label}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
