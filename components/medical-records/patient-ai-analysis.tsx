"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Brain,
  Scan,
  AlertTriangle,
  CheckCircle2,
  Upload,
  Sparkles,
  Activity,
  Loader2,
  Plus,
  FileImage,
} from "lucide-react"
import { useAIAnalyses, createAIAnalysis } from "@/lib/hooks/use-data"
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

interface PatientAIAnalysisProps {
  patientId: string
}

export function PatientAIAnalysis({ patientId }: PatientAIAnalysisProps) {
  const { analyses, isLoading, mutate } = useAIAnalyses({ patientId, limit: 50 })
  const [selectedAnalysis, setSelectedAnalysis] = useState<AIAnalysis | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newAnalysis, setNewAnalysis] = useState({
    analysis_type: "xray" as "xray" | "photo" | "records" | "treatment_plan",
    image_url: "",
  })

  const handleCreateAnalysis = async () => {
    setIsCreating(true)
    try {
      await createAIAnalysis({ patient_id: patientId, ...newAnalysis })
      toast.success("Analise enviada para processamento!")
      mutate()
      setIsDialogOpen(false)
      setNewAnalysis({ analysis_type: "xray", image_url: "" })
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
      case "high": return "Alta"
      case "medium": return "Media"
      case "low": return "Baixa"
      default: return severity
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "xray": return "Radiografia"
      case "photo": return "Fotografia"
      case "records": return "Prontuario"
      case "treatment_plan": return "Plano de Tratamento"
      default: return type
    }
  }

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("pt-BR")

  const completedAnalyses = analyses?.filter(a => a.status === "completed") || []
  const processingCount = analyses?.filter(a => a.status === "processing" || a.status === "pending").length || 0
  const highSeverityCount = completedAnalyses.reduce((count, a) => {
    const findings = a.findings as AIFinding[] | null
    return count + (findings?.filter(f => f.severity === "high").length || 0)
  }, 0)
  const avgConfidence = completedAnalyses.length > 0
    ? completedAnalyses.reduce((sum, a) => sum + (a.confidence_score || 0), 0) / completedAnalyses.length
    : 0

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Scan className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{isLoading ? "-" : analyses?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Precisao</p>
                <p className="text-xl font-bold">{isLoading ? "-" : `${avgConfidence.toFixed(0)}%`}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900/30">
                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Criticos</p>
                <p className="text-xl font-bold">{isLoading ? "-" : highSeverityCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Processando</p>
                <p className="text-xl font-bold">{isLoading ? "-" : processingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Analysis Button */}
      <div className="flex justify-end">
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
              <DialogDescription>Envie uma imagem para analise automatizada</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Tipo de Analise</Label>
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
                <Label>URL da Imagem (opcional)</Label>
                <Input
                  value={newAnalysis.image_url}
                  onChange={(e) => setNewAnalysis({ ...newAnalysis, image_url: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="bg-transparent" onClick={() => setIsDialogOpen(false)}>
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

      {/* Analyses List + Detail */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Analises</CardTitle>
            <CardDescription>Selecione para ver detalhes</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !analyses || analyses.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">Nenhuma analise ainda</p>
                <Button className="mt-3 bg-transparent" variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Nova Analise
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-2">
                <div className="space-y-2">
                  {analyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      className={`cursor-pointer rounded-lg border p-3 transition-colors hover:bg-accent ${
                        selectedAnalysis?.id === analysis.id ? "border-primary bg-accent" : ""
                      }`}
                      onClick={() => setSelectedAnalysis(analysis)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{getTypeLabel(analysis.analysis_type)}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(analysis.created_at)}</p>
                        </div>
                        {analysis.status === "completed" ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 shrink-0 text-xs">
                            Concluida
                          </Badge>
                        ) : analysis.status === "processing" ? (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 shrink-0 text-xs">
                            Processando
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shrink-0 text-xs">
                            Pendente
                          </Badge>
                        )}
                      </div>
                      {analysis.status === "completed" && analysis.confidence_score && (
                        <div className="mt-2 flex items-center gap-2">
                          <Progress value={analysis.confidence_score} className="h-1 flex-1" />
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

        {/* Detail */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Brain className="h-5 w-5 text-primary" />
                  Resultado da Analise
                </CardTitle>
                <CardDescription>
                  {selectedAnalysis
                    ? `${getTypeLabel(selectedAnalysis.analysis_type)} - ${formatDate(selectedAnalysis.created_at)}`
                    : "Selecione uma analise para ver os detalhes"
                  }
                </CardDescription>
              </div>
              {selectedAnalysis?.status === "completed" && selectedAnalysis.confidence_score && (
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Confianca</p>
                  <p className="text-2xl font-bold text-primary">{selectedAnalysis.confidence_score}%</p>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!selectedAnalysis ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Brain className="h-14 w-14 text-muted-foreground/30" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Selecione uma analise na lista ao lado
                </p>
              </div>
            ) : selectedAnalysis.status === "processing" || selectedAnalysis.status === "pending" ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <Brain className="h-14 w-14 text-primary animate-pulse" />
                  <Sparkles className="absolute -right-2 -top-2 h-5 w-5 text-yellow-500 animate-bounce" />
                </div>
                <p className="mt-4 font-medium">Analise em Andamento</p>
                <p className="text-sm text-muted-foreground">Processando imagem...</p>
                <Progress value={45} className="mt-4 w-48" />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Findings */}
                <div className="rounded-lg border bg-muted/50 p-4">
                  <h4 className="mb-3 text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Achados Identificados
                  </h4>
                  {selectedAnalysis.findings && (selectedAnalysis.findings as AIFinding[]).length > 0 ? (
                    <div className="space-y-2">
                      {(selectedAnalysis.findings as AIFinding[]).map((finding, index) => (
                        <div key={index} className="flex items-start gap-3 rounded-lg border bg-background p-3">
                          <Badge className={`${getSeverityColor(finding.severity)} shrink-0`}>
                            {getSeverityLabel(finding.severity)}
                          </Badge>
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{finding.description}</p>
                            {finding.tooth_number && (
                              <p className="text-xs text-muted-foreground mt-1">Dente: {finding.tooth_number}</p>
                            )}
                            {finding.location && (
                              <p className="text-xs text-muted-foreground">Local: {finding.location}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum achado registrado</p>
                  )}
                </div>

                {/* Recommendations */}
                {selectedAnalysis.recommendations && (selectedAnalysis.recommendations as string[]).length > 0 && (
                  <div className="rounded-lg border bg-primary/5 p-4">
                    <h4 className="mb-3 text-sm font-medium flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Recomendacoes da IA
                    </h4>
                    <ul className="space-y-2">
                      {(selectedAnalysis.recommendations as string[]).map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
