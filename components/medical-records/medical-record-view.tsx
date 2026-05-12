"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, Mail, Calendar, User, ArrowLeft, FileText, MapPin, TrendingUp, Brain, Loader2 } from "lucide-react"
import { AttachedExams } from "./attached-exams"
import { ClinicalHistory } from "./clinical-history"
import { MedicalInformation } from "./medical-information"
import { DentalChartView } from "@/components/dental-chart/dental-chart-view"
import { CariesIndexChart } from "@/components/progress/caries-index-chart"
import { PeriodontalHealthChart } from "@/components/progress/periodontal-health-chart"
import { ComparisonChart } from "@/components/progress/comparison-chart"
import { PatientAIAnalysis } from "./patient-ai-analysis"
import { usePatient } from "@/lib/hooks/use-data"
import useSWR from "swr"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(d => d.data || [])


interface MedicalRecordViewProps {
  patientId: string
}

export function MedicalRecordView({ patientId }: MedicalRecordViewProps) {
  const { patient, isLoading } = usePatient(patientId)
  const { data: treatments } = useSWR(`/api/treatments?patient_id=${patientId}`, fetcher)
  const { data: appointments } = useSWR(`/api/appointments?patient_id=${patientId}`, fetcher)

  // Build chart data from real treatments
  const treatmentsByMonth = (() => {
    if (!treatments || treatments.length === 0) return []
    const months: Record<string, { total: number; concluidos: number }> = {}
    for (const t of treatments) {
      const date = t.scheduled_date || t.created_at
      if (!date) continue
      const d = new Date(date)
      const key = `${d.toLocaleString("pt-BR", { month: "short" })}/${String(d.getFullYear()).slice(2)}`
      if (!months[key]) months[key] = { total: 0, concluidos: 0 }
      months[key].total++
      if (t.status === "Concluido") months[key].concluidos++
    }
    return Object.entries(months).map(([month, v]) => ({ month, ...v }))
  })()

  const statusChartData = (() => {
    if (!treatments || treatments.length === 0) return []
    const counts: Record<string, number> = {}
    for (const t of treatments) {
      counts[t.status] = (counts[t.status] || 0) + 1
    }
    const colorMap: Record<string, string> = {
      "Concluido": "#22c55e",
      "Em Andamento": "#3b82f6",
      "Agendado": "#eab308",
      "Cancelado": "#ef4444",
    }
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: colorMap[name] || "#94a3b8",
    }))
  })()

  const completedAppointments = appointments?.filter((a: any) => a.status === "Concluída").length || 0
  const completedTreatments = treatments?.filter((t: any) => t.status === "Concluido").length || 0
  const totalTreatments = treatments?.length || 0

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
          <DentalChartView patientId={patientId} />
        </TabsContent>

        {/* Tab: Progresso */}
        <TabsContent value="progresso" className="space-y-6">
          {/* Real Metrics */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Total de Tratamentos</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{totalTreatments}</p>
                <p className="mt-1 text-xs text-muted-foreground">Registrados no sistema</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Tratamentos Concluidos</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{completedTreatments}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {totalTreatments > 0 ? `${Math.round((completedTreatments / totalTreatments) * 100)}% de conclusao` : "Nenhum ainda"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Consultas Realizadas
                </p>
                <p className="mt-2 text-3xl font-bold text-foreground">{completedAppointments}</p>
                <p className="mt-1 text-xs text-muted-foreground">Concluidas</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <CariesIndexChart data={treatmentsByMonth} />
            <PeriodontalHealthChart data={statusChartData} />
          </div>
          <ComparisonChart treatments={treatments || []} />
        </TabsContent>

        {/* Tab: Analise com IA */}
        <TabsContent value="ia" className="space-y-6">
          <PatientAIAnalysis patientId={patientId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
