"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Calendar, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CariesIndexChart } from "./caries-index-chart"
import { PeriodontalHealthChart } from "./periodontal-health-chart"
import { ComparisonChart } from "./comparison-chart"

export function PatientProgressView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Progresso do Paciente</h1>
        <p className="text-muted-foreground">Selecione um paciente no prontuario para visualizar o progresso</p>
      </div>

      <Card>
        <CardContent className="p-6 text-center">
          <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            O progresso do paciente esta disponivel dentro do prontuario de cada paciente, na aba &quot;Progresso&quot;.
          </p>
          <Button variant="outline" className="mt-4 bg-transparent" asChild>
            <a href="/prontuario">Ir para Prontuarios</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
