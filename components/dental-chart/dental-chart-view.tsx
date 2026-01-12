"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { DentalChart } from "./dental-chart"
import { ToothDetail } from "./tooth-detail"
import { QuickActions } from "./quick-actions"
import { ChartLegend } from "./chart-legend"

export function DentalChartView() {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(16)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mapa Odontológico Dinâmico</h1>
        <p className="text-muted-foreground">Visualização interativa e registro de procedimentos</p>
      </div>

      {/* Legend */}
      <ChartLegend />

      {/* Dental Chart */}
      <Card>
        <CardContent className="p-6">
          <DentalChart selectedTooth={selectedTooth} onToothSelect={setSelectedTooth} />

          <div className="mt-6 flex items-center justify-center">
            <div className="rounded-lg bg-primary/10 px-4 py-2 flex items-center gap-2">
              <svg
                className="h-4 w-4 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-muted-foreground">
                Clique em qualquer dente para ver detalhes ou registrar procedimentos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ToothDetail toothNumber={selectedTooth} />
        </div>
        <QuickActions toothNumber={selectedTooth} />
      </div>
    </div>
  )
}
