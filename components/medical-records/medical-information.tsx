"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Pill, HeartPulse } from "lucide-react"
import { usePatient } from "@/lib/hooks/use-data"
import { Loader2 } from "lucide-react"

interface MedicalInformationProps {
  patientId: string
}

export function MedicalInformation({ patientId }: MedicalInformationProps) {
  const { patient, isLoading } = usePatient(patientId)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  const allergies = patient?.allergies?.split(",").map((a: string) => a.trim()).filter(Boolean) || []
  const conditions = patient?.pre_existing_conditions?.split(",").map((c: string) => c.trim()).filter(Boolean) || []
  const medications = patient?.medications?.split(",").map((m: string) => m.trim()).filter(Boolean) || []

  const hasAnyInfo = allergies.length > 0 || conditions.length > 0 || medications.length > 0

  if (!hasAnyInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informacoes Medicas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma informacao medica registrada. Edite o paciente na lista de pacientes para adicionar alergias, condicoes e medicamentos.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Informacoes Medicas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {allergies.length > 0 && (
          <div>
            <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Alergias
            </p>
            <div className="flex flex-wrap gap-2">
              {allergies.map((allergy: string) => (
                <Badge key={allergy} variant="destructive">
                  {allergy}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {conditions.length > 0 && (
          <div>
            <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
              <HeartPulse className="h-4 w-4 text-warning" />
              Condicoes Pre-existentes
            </p>
            <div className="flex flex-wrap gap-2">
              {conditions.map((condition: string) => (
                <Badge key={condition} variant="secondary" className="bg-warning/10 text-warning hover:bg-warning/20">
                  {condition}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {medications.length > 0 && (
          <div>
            <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
              <Pill className="h-4 w-4 text-primary" />
              Medicamentos em Uso
            </p>
            <div className="flex flex-wrap gap-2">
              {medications.map((med: string) => (
                <Badge key={med} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  {med}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
