"use client"

import { cn } from "@/lib/utils"

interface DentalChartProps {
  selectedTooth: number | null
  onToothSelect: (tooth: number) => void
}

// Tooth status mapping
const toothStatus: Record<number, string> = {
  11: "healthy",
  12: "healthy",
  13: "healthy",
  14: "healthy",
  15: "healthy",
  16: "restored",
  21: "warning",
  22: "restored",
  23: "restored",
  36: "canal",
  46: "restored",
}

const getToothColor = (status: string, isSelected: boolean) => {
  if (isSelected) {
    return "bg-primary border-primary ring-2 ring-primary ring-offset-2"
  }

  switch (status) {
    case "healthy":
      return "bg-success hover:bg-success/80 border-success"
    case "restored":
      return "bg-primary hover:bg-primary/80 border-primary"
    case "warning":
      return "bg-warning hover:bg-warning/80 border-warning"
    case "canal":
      return "bg-danger hover:bg-danger/80 border-danger"
    default:
      return "bg-muted hover:bg-muted/80 border-border"
  }
}

export function DentalChart({ selectedTooth, onToothSelect }: DentalChartProps) {
  const upperTeeth = [
    [18, 17, 16, 15, 14, 13, 12, 11],
    [21, 22, 23, 24, 25, 26, 27, 28],
  ]

  const lowerTeeth = [
    [48, 47, 46, 45, 44, 43, 42, 41],
    [31, 32, 33, 34, 35, 36, 37, 38],
  ]

  const renderTooth = (toothNumber: number) => {
    const status = toothStatus[toothNumber] || "default"
    const isSelected = selectedTooth === toothNumber

    return (
      <button
        key={toothNumber}
        onClick={() => onToothSelect(toothNumber)}
        className={cn(
          "relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg border-2 transition-all hover:scale-105",
          getToothColor(status, isSelected),
        )}
      >
        <span className={cn("text-xs font-semibold", isSelected ? "text-primary-foreground" : "text-foreground")}>
          {toothNumber}
        </span>
        {isSelected && (
          <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary border-2 border-card" />
        )}
      </button>
    )
  }

  return (
    <div className="space-y-6">
      {/* Upper Teeth */}
      <div>
        <div className="mb-3 text-center">
          <span className="text-sm font-medium text-muted-foreground">Arcada Superior</span>
        </div>
        <div className="flex justify-center gap-8">
          <div className="flex gap-1 sm:gap-2">{upperTeeth[0].map((tooth) => renderTooth(tooth))}</div>
          <div className="flex gap-1 sm:gap-2">{upperTeeth[1].map((tooth) => renderTooth(tooth))}</div>
        </div>
        <div className="mt-2 text-center">
          <span className="text-xs text-muted-foreground">Vista do Dentista</span>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Lower Teeth */}
      <div>
        <div className="flex justify-center gap-8">
          <div className="flex gap-1 sm:gap-2">{lowerTeeth[0].map((tooth) => renderTooth(tooth))}</div>
          <div className="flex gap-1 sm:gap-2">{lowerTeeth[1].map((tooth) => renderTooth(tooth))}</div>
        </div>
        <div className="mt-3 text-center">
          <span className="text-sm font-medium text-muted-foreground">Arcada Inferior</span>
        </div>
      </div>
    </div>
  )
}
