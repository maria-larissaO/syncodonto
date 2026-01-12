"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, Calendar, User, Edit } from "lucide-react"
import { AiSuggestions } from "./ai-suggestions"
import { AttachedExams } from "./attached-exams"
import { ClinicalHistory } from "./clinical-history"
import { MedicalInformation } from "./medical-information"

interface MedicalRecordViewProps {
  patientId: string
}

export function MedicalRecordView({ patientId }: MedicalRecordViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Prontuário Eletrônico Inteligente</h1>
        <p className="text-muted-foreground">Histórico clínico completo e sugestões da IA</p>
      </div>

      {/* Patient Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-semibold">
                CS
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-foreground">Carlos Mendes</h2>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">52 anos • Masculino • Tipo Sanguíneo: O+</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">(11) 98765-4321</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">carlos@email.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Última Consulta: 14/12/2024</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Cadastro: 15/10/2024</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="bg-transparent">
                Editar
              </Button>
              <Button>Novo Atendimento</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions and Exams */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AiSuggestions />
        <AttachedExams />
      </div>

      {/* Clinical History */}
      <ClinicalHistory />

      {/* Medical Information */}
      <MedicalInformation />
    </div>
  )
}
