"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Brain,
  Scan,
  FileImage,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Upload,
  Sparkles,
  Activity,
  Target,
  Lightbulb,
  BarChart3,
  Clock,
  Users,
  Loader2,
  Plus,
} from "lucide-react"
import { useAIAnalyses, usePatients, createAIAnalysis } from "@/lib/hooks/use-data"
import type { AIAnalysis, AIFinding } from "@/lib/types/database"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import Link from "next/link"

const aiInsights = [
  {
    icon: TrendingUp,
    title: "Tendencia de Caries",
    description: "Aumento de 15% nas deteccoes de caries interproximais este mes",
    action: "Revisar protocolos de prevencao",
  },
  {
    icon: Users,
    title: "Pacientes em Risco",
    description: "8 pacientes identificados com alto risco periodontal",
    action: "Agendar consultas preventivas",
  },
  {
    icon: Clock,
    title: "Tempo de Diagnostico",
    description: "Reducao de 40% no tempo medio de analise radiografica",
    action: "Ver estatisticas detalhadas",
  },
  {
    icon: Target,
    title: "Precisao Diagnostica",
    description: "Taxa de concordancia de 96% com diagnosticos confirmados",
    action: "Ver relatorio de validacao",
  },
]

export function AiAnalysisView() {
  const { analyses, isLoading, error, mutate } = useAIAnalyses({ limit: 50 })
  const { patients } = usePatients()
  const [selectedAnalysis, setSelectedAnalysis] = useState<AIAnalysis | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newAnalysis, setNewAnalysis] = useState({
    patient_id: "",
    analysis_type: "xray" as "xray" | "photo" | "records" | "treatment_plan",
    image_url: "",
  })

  const handleCreateAnalysis = async () => {
    if (!newAnalysis.patient_id) {
      toast.error("Selecione um paciente")
      return
    }

    setIsCreating(true)
    try {
      await createAIAnalysis(newAnalysis)
      toast.success("Analise enviada para processamento!")
      mutate()
      setIsDialogOpen(false)
      setNewAnalysis({
        patient_id: "",
        analysis_type: "xray",
        image_url: "",
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar analise")
    } finally {
      setIsCreating(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "high":
        return "Alta"
      case "medium":
        return "Media"
      case "low":
        return "Baixa"
      default:
        return severity
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "xray":
        return "Radiografia"
      case "photo":
        return "Fotografia"
      case "records":
        return "Prontuario"
      case "treatment_plan":
        return "Plano de Tratamento"
      default:
        return type
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  // Calculate stats
  const completedAnalyses = analyses?.filter(a => a.status === "completed") || []
  const processingAnalyses = analyses?.filter(a => a.status === "processing" || a.status === "pending") || []
  const highSeverityCount = completedAnalyses.reduce((count, a) => {
    const findings = a.findings as AIFinding[] | null
    return count + (findings?.filter(f => f.severity === "high").length || 0)
  }, 0)
  const avgConfidence = completedAnalyses.length > 0 
    ? completedAnalyses.reduce((sum, a) => sum + (a.confidence_score || 0), 0) / completedAnalyses.length 
    : 0

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Erro ao carregar analises. Faca login para continuar.</p>
        <Link href="/auth/login">
          <Button className="mt-4">Fazer Login</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analise com IA</h1>
          <p className="text-muted-foreground">
            Diagnostico assistido por inteligencia artificial para imagens odontologicas
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Nova Analise
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Analise com IA</DialogTitle>
              <DialogDescription>
                Envie uma imagem para analise automatizada
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="patient">Paciente</Label>
                <Select
                  value={newAnalysis.patient_id}
                  onValueChange={(value) => setNewAnalysis({ ...newAnalysis, patient_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients?.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo de Analise</Label>
                <Select
                  value={newAnalysis.analysis_type}
                  onValueChange={(value: "xray" | "photo" | "records" | "treatment_plan") =>
                    setNewAnalysis({ ...newAnalysis, analysis_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xray">Radiografia</SelectItem>
                    <SelectItem value="photo">Fotografia</SelectItem>
                    <SelectItem value="records">Prontuario</SelectItem>
                    <SelectItem value="treatment_plan">Plano de Tratamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">URL da Imagem (opcional)</Label>
                <Input
                  id="image"
                  value={newAnalysis.image_url}
                  onChange={(e) => setNewAnalysis({ ...newAnalysis, image_url: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateAnalysis} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Iniciar Analise"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Scan className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Analises</p>
                <p className="text-2xl font-bold">{isLoading ? "-" : analyses?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Precisao Media</p>
                <p className="text-2xl font-bold">{isLoading ? "-" : `${avgConfidence.toFixed(1)}%`}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Achados Criticos</p>
                <p className="text-2xl font-bold">{isLoading ? "-" : highSeverityCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Em Processamento</p>
                <p className="text-2xl font-bold">{isLoading ? "-" : processingAnalyses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analyses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analyses" className="gap-2">
            <FileImage className="h-4 w-4" />
            Analises Recentes
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            Insights da IA
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Estatisticas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyses" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Analysis List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Analises</CardTitle>
                <CardDescription>Selecione uma analise para ver detalhes</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : !analyses || analyses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhuma analise encontrada</p>
                    <Button className="mt-4 bg-transparent" variant="outline" onClick={() => setIsDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Analise
                    </Button>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                      {analyses.map((analysis) => (
                        <div
                          key={analysis.id}
                          className={`cursor-pointer rounded-lg border p-3 transition-colors hover:bg-accent ${
                            selectedAnalysis?.id === analysis.id ? "border-primary bg-accent" : ""
                          }`}
                          onClick={() => setSelectedAnalysis(analysis)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{analysis.patient?.full_name || "Paciente"}</p>
                              <p className="text-sm text-muted-foreground">{getTypeLabel(analysis.analysis_type)}</p>
                              <p className="text-xs text-muted-foreground">{formatDate(analysis.created_at)}</p>
                            </div>
                            {analysis.status === "completed" ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                Concluida
                              </Badge>
                            ) : analysis.status === "processing" ? (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                Processando
                              </Badge>
                            ) : analysis.status === "failed" ? (
                              <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                Falhou
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                Pendente
                              </Badge>
                            )}
                          </div>
                          {analysis.status === "completed" && analysis.confidence_score && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Confianca:</span>
                              <Progress value={analysis.confidence_score} className="h-1.5 flex-1" />
                              <span className="text-xs font-medium">{analysis.confidence_score}%</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>

            {/* Analysis Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      Resultado da Analise
                    </CardTitle>
                    <CardDescription>
                      {selectedAnalysis 
                        ? `${selectedAnalysis.patient?.full_name || "Paciente"} - ${getTypeLabel(selectedAnalysis.analysis_type)}`
                        : "Selecione uma analise para ver os detalhes"
                      }
                    </CardDescription>
                  </div>
                  {selectedAnalysis?.status === "completed" && selectedAnalysis.confidence_score && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Indice de Confianca</p>
                      <p className="text-2xl font-bold text-primary">{selectedAnalysis.confidence_score}%</p>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!selectedAnalysis ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Brain className="h-16 w-16 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">
                      Selecione uma analise na lista para ver os detalhes
                    </p>
                  </div>
                ) : selectedAnalysis.status === "processing" || selectedAnalysis.status === "pending" ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative">
                      <Brain className="h-16 w-16 text-primary animate-pulse" />
                      <Sparkles className="absolute -right-2 -top-2 h-6 w-6 text-yellow-500 animate-bounce" />
                    </div>
                    <p className="mt-4 text-lg font-medium">Analise em Andamento</p>
                    <p className="text-sm text-muted-foreground">
                      A IA esta processando a imagem. Isso pode levar alguns minutos.
                    </p>
                    <Progress value={45} className="mt-4 w-64" />
                    <p className="mt-2 text-xs text-muted-foreground">Processando...</p>
                  </div>
                ) : selectedAnalysis.status === "failed" ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertTriangle className="h-16 w-16 text-red-500" />
                    <p className="mt-4 text-lg font-medium text-red-600">Analise Falhou</p>
                    <p className="text-sm text-muted-foreground">
                      Ocorreu um erro ao processar esta imagem. Tente novamente.
                    </p>
                    <Button className="mt-4 bg-transparent" variant="outline">
                      Tentar Novamente
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-lg border bg-muted/50 p-4">
                      <h4 className="mb-3 font-medium flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Achados Identificados
                      </h4>
                      {selectedAnalysis.findings && (selectedAnalysis.findings as AIFinding[]).length > 0 ? (
                        <div className="space-y-3">
                          {(selectedAnalysis.findings as AIFinding[]).map((finding, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 rounded-lg border bg-background p-3"
                            >
                              <Badge className={getSeverityColor(finding.severity)}>
                                {getSeverityLabel(finding.severity)}
                              </Badge>
                              <div>
                                <p className="text-sm">{finding.description}</p>
                                {finding.recommendation && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Recomendacao: {finding.recommendation}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Nenhum achado registrado</p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 bg-transparent">
                        Ver Imagem Original
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        Exportar Relatorio
                      </Button>
                      <Button className="flex-1">Confirmar Diagnostico</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {aiInsights.map((insight, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <insight.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{insight.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{insight.description}</p>
                      <Button variant="link" className="mt-2 h-auto p-0 text-primary">
                        {insight.action}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Recomendacoes da IA
              </CardTitle>
              <CardDescription>
                Sugestoes baseadas nas analises realizadas nos ultimos 30 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border-l-4 border-l-primary bg-muted/50 p-4">
                  <h4 className="font-medium">Atencao especial para regiao posterior</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    As analises indicam um padrao de caries interproximais na regiao de molares. 
                    Considere reforcar orientacoes sobre uso de fio dental nestas areas.
                  </p>
                </div>
                <div className="rounded-lg border-l-4 border-l-yellow-500 bg-muted/50 p-4">
                  <h4 className="font-medium">Pacientes com alto risco periodontal</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    8 pacientes foram identificados com sinais de progressao de doenca periodontal. 
                    Recomendamos agendar consultas de acompanhamento.
                  </p>
                </div>
                <div className="rounded-lg border-l-4 border-l-green-500 bg-muted/50 p-4">
                  <h4 className="font-medium">Melhoria na deteccao precoce</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    A taxa de deteccao precoce de lesoes aumentou 23% este mes, 
                    contribuindo para tratamentos menos invasivos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analises por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["xray", "photo", "records", "treatment_plan"].map((type) => {
                    const count = analyses?.filter(a => a.analysis_type === type).length || 0
                    const total = analyses?.length || 1
                    const percentage = Math.round((count / total) * 100)
                    return (
                      <div key={type}>
                        <div className="flex justify-between text-sm">
                          <span>{getTypeLabel(type)}</span>
                          <span className="font-medium">{percentage}%</span>
                        </div>
                        <Progress value={percentage} className="mt-1" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Achados por Severidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["high", "medium", "low"].map((severity) => {
                    const count = completedAnalyses.reduce((sum, a) => {
                      const findings = a.findings as AIFinding[] | null
                      return sum + (findings?.filter(f => f.severity === severity).length || 0)
                    }, 0)
                    return (
                      <div key={severity} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full ${
                            severity === "high" ? "bg-red-500" :
                            severity === "medium" ? "bg-yellow-500" : "bg-blue-500"
                          }`} />
                          <span className="text-sm">
                            {severity === "high" ? "Alta Prioridade" :
                             severity === "medium" ? "Media Prioridade" : "Baixa Prioridade"}
                          </span>
                        </div>
                        <span className={`font-bold ${
                          severity === "high" ? "text-red-600" :
                          severity === "medium" ? "text-yellow-600" : "text-blue-600"
                        }`}>{count}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Analises Concluidas</span>
                    <span className="font-bold text-green-600">{completedAnalyses.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Em Processamento</span>
                    <span className="font-bold text-yellow-600">{processingAnalyses.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taxa de Sucesso</span>
                    <span className="font-bold text-primary">
                      {analyses && analyses.length > 0 
                        ? `${Math.round((completedAnalyses.length / analyses.length) * 100)}%`
                        : "0%"
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
