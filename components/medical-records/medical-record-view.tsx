"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, Mail, Calendar, User, ArrowLeft, FileText, MapPin, TrendingUp, Brain } from "lucide-react"
import { AttachedExams } from "./attached-exams"
import { ClinicalHistory } from "./clinical-history"
import { MedicalInformation } from "./medical-information"
import { DentalChart } from "@/components/dental-chart/dental-chart"
import { ToothDetail } from "@/components/dental-chart/tooth-detail"
import { QuickActions } from "@/components/dental-chart/quick-actions"
import { ChartLegend } from "@/components/dental-chart/chart-legend"
import { CariesIndexChart } from "@/components/progress/caries-index-chart"
import { PeriodontalHealthChart } from "@/components/progress/periodontal-health-chart"
import { ComparisonChart } from "@/components/progress/comparison-chart"
import { PatientAIAnalysis } from "./patient-ai-analysis"
import { usePatient } from "@/lib/hooks/use-data"
import Link from "next/link"

interface MedicalRecordViewProps {
  patientId: string
}

export function MedicalRecordView({ patientId }: MedicalRecordViewProps) {
  const { patient, isLoading } = usePatient(patientId)
  const [selectedTooth, setSelectedTooth] = useState<number | null>(16)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  const calculateAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return null
    const today = new Date()
    const birth = new Date(dateOfBirth)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/pacientes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Paciente nao encontrado</h1>
        </div>
      </div>
    )
  }

  const age = calculateAge(patient.date_of_birth)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/pacientes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prontuario Eletronico</h1>
          <p className="text-muted-foreground">Historico clinico completo e ferramentas integradas</p>
        </div>
      </div>

      {/* Patient Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-semibold">
                {getInitials(patient.full_name)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-foreground">{patient.full_name}</h2>
                  <Badge
                    variant={patient.status === "Ativo" ? "default" : "secondary"}
                    className={
                      patient.status === "Ativo"
                        ? "bg-success/10 text-success"
                        : patient.status === "Em Tratamento"
                          ? "bg-blue-500/10 text-blue-600"
                          : ""
                    }
                  >
                    {patient.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {age ? `${age} anos` : ""} {patient.gender ? `- ${patient.gender}` : ""}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {patient.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{patient.phone}</span>
                    </div>
                  )}
                  {patient.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{patient.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Cadastro: {new Date(patient.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Link href={`/pacientes`}>
                <Button variant="outline" className="bg-transparent">
                  Voltar
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs: Prontuario / Mapa Odontologico / Progresso */}
      <Tabs defaultValue="prontuario" className="space-y-6">
        <TabsList className="w-full justify-start bg-muted/50 p-1">
          <TabsTrigger value="prontuario" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Prontuario</span>
          </TabsTrigger>
          <TabsTrigger value="mapa" className="gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Mapa Odontologico</span>
          </TabsTrigger>
          <TabsTrigger value="progresso" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Progresso</span>
          </TabsTrigger>
          <TabsTrigger value="ia" className="gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Analise IA</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Prontuario */}
        <TabsContent value="prontuario" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <MedicalInformation patientId={patientId} />
            <AttachedExams patientId={patientId} />
          </div>
          <ClinicalHistory patientId={patientId} />
        </TabsContent>

        {/* Tab: Mapa Odontologico */}
        <TabsContent value="mapa" className="space-y-6">
          <ChartLegend />
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
        </TabsContent>

        {/* Tab: Progresso */}
        <TabsContent value="progresso" className="space-y-6">
          {/* Health Metrics */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Indice de Carie</p>
                    <p className="mt-2 text-3xl font-bold text-foreground">0.8</p>
                    <p className="mt-1 text-xs text-muted-foreground">{"Meta: < 1.0"}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-1">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-xs font-medium text-success">-75%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Saude Periodontal</p>
                    <p className="mt-2 text-3xl font-bold text-foreground">90%</p>
                    <p className="mt-1 text-xs text-muted-foreground">Excelente evolucao</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-1">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-xs font-medium text-success">+78%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Consultas Realizadas
                  </p>
                  <p className="mt-2 text-3xl font-bold text-foreground">12</p>
                  <p className="mt-1 text-xs text-muted-foreground">Ultimos 6 meses</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <CariesIndexChart />
            <PeriodontalHealthChart />
          </div>
          <ComparisonChart />
        </TabsContent>

        {/* Tab: Analise com IA */}
        <TabsContent value="ia" className="space-y-6">
          <PatientAIAnalysis patientId={patientId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
