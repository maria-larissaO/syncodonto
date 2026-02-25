"use client"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DentalChart, type ToothCondition, CONDITIONS } from "./dental-chart"
import { ChartLegend } from "./chart-legend"
import { Save, History, Clock, Loader2, Plus } from "lucide-react"
import { toast } from "sonner"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(d => d.data || [])

interface DentalChartViewProps {
  patientId?: string
}

export function DentalChartView({ patientId }: DentalChartViewProps) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null)
  const [toothData, setToothData] = useState<Record<number, ToothCondition>>({})
  const [saving, setSaving] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [snapshotNotes, setSnapshotNotes] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [viewingSnapshot, setViewingSnapshot] = useState<any>(null)

  const { data: snapshots, mutate: mutateSnapshots } = useSWR(
    patientId ? `/api/dental-snapshots?patient_id=${patientId}` : null,
    fetcher
  )

  // Load latest snapshot as current state
  useEffect(() => {
    if (snapshots && snapshots.length > 0 && !hasUnsavedChanges) {
      const latest = snapshots[0]
      const parsed = typeof latest.tooth_data === "string" ? JSON.parse(latest.tooth_data) : latest.tooth_data
      const converted: Record<number, ToothCondition> = {}
      for (const [k, v] of Object.entries(parsed)) {
        converted[Number(k)] = v as ToothCondition
      }
      setToothData(converted)
    }
  }, [snapshots, hasUnsavedChanges])

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
    setHasUnsavedChanges(true)
  }, [])

  const handleSaveSnapshot = async () => {
    if (!patientId) return
    setSaving(true)
    try {
      const res = await fetch("/api/dental-snapshots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          tooth_data: toothData,
          notes: snapshotNotes || `Registro de ${new Date().toLocaleDateString("pt-BR")}`,
        }),
      })
      if (!res.ok) throw new Error()
      mutateSnapshots()
      setHasUnsavedChanges(false)
      setShowSaveDialog(false)
      setSnapshotNotes("")
      toast.success("Mapa odontologico salvo com sucesso")
    } catch {
      toast.error("Erro ao salvar")
    } finally {
      setSaving(false)
    }
  }

  const loadSnapshot = (snapshot: any) => {
    const parsed = typeof snapshot.tooth_data === "string" ? JSON.parse(snapshot.tooth_data) : snapshot.tooth_data
    const converted: Record<number, ToothCondition> = {}
    for (const [k, v] of Object.entries(parsed)) {
      converted[Number(k)] = v as ToothCondition
    }
    setViewingSnapshot(snapshot)
    setToothData(converted)
    setHasUnsavedChanges(false)
    setShowHistory(false)
    toast.success(`Visualizando registro de ${new Date(snapshot.created_at).toLocaleDateString("pt-BR")}`)
  }

  const backToCurrent = () => {
    setViewingSnapshot(null)
    if (snapshots && snapshots.length > 0) {
      const latest = snapshots[0]
      const parsed = typeof latest.tooth_data === "string" ? JSON.parse(latest.tooth_data) : latest.tooth_data
      const converted: Record<number, ToothCondition> = {}
      for (const [k, v] of Object.entries(parsed)) {
        converted[Number(k)] = v as ToothCondition
      }
      setToothData(converted)
    } else {
      setToothData({})
    }
  }

  const selectedCondition = selectedTooth ? toothData[selectedTooth] || "none" : null
  const selectedConditionDef = selectedCondition ? CONDITIONS.find(c => c.value === selectedCondition) : null
  const registeredCount = Object.keys(toothData).length

  return (
    <div className="space-y-6">
      <ChartLegend />

      {/* Action bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {viewingSnapshot && (
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              Visualizando: {new Date(viewingSnapshot.created_at).toLocaleDateString("pt-BR")}
            </Badge>
          )}
          {hasUnsavedChanges && !viewingSnapshot && (
            <Badge variant="destructive" className="gap-1 text-xs">Alteracoes nao salvas</Badge>
          )}
        </div>
        <div className="flex gap-2">
          {viewingSnapshot && (
            <Button variant="outline" size="sm" className="bg-transparent gap-1.5" onClick={backToCurrent}>
              Voltar ao Atual
            </Button>
          )}
          <Button variant="outline" size="sm" className="bg-transparent gap-1.5" onClick={() => setShowHistory(true)}>
            <History className="h-4 w-4" />
            Historico ({snapshots?.length || 0})
          </Button>
          {!viewingSnapshot && (
            <Button size="sm" className="gap-1.5" onClick={() => setShowSaveDialog(true)} disabled={!hasUnsavedChanges && (snapshots?.length || 0) > 0}>
              <Save className="h-4 w-4" />
              Salvar Registro
            </Button>
          )}
        </div>
      </div>

      {/* Dental Chart */}
      <Card>
        <CardContent className="p-6">
          <DentalChart
            selectedTooth={selectedTooth}
            onToothSelect={setSelectedTooth}
            toothData={toothData}
            onConditionChange={viewingSnapshot ? undefined : handleConditionChange}
          />
          <div className="mt-6 flex items-center justify-center">
            <p className="text-xs text-muted-foreground">
              {viewingSnapshot ? "Modo de visualizacao - volte ao atual para editar" : "Clique em um dente para alterar sua condicao"}
              {registeredCount > 0 && (
                <span className="ml-2 text-foreground font-medium">
                  ({registeredCount} dente{registeredCount !== 1 ? "s" : ""} registrado{registeredCount !== 1 ? "s" : ""})
                </span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {selectedTooth && selectedConditionDef && selectedConditionDef.value !== "none" && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Dente {selectedTooth}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Condicao: {selectedConditionDef.label}</p>
              </div>
              <Badge className={`${selectedConditionDef.dotColor} text-white`}>{selectedConditionDef.label}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salvar Registro Odontologico</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Observacoes (opcional)</Label>
              <Input
                placeholder="Ex: Consulta de rotina, Pos-procedimento..."
                value={snapshotNotes}
                onChange={(e) => setSnapshotNotes(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {registeredCount} dente(s) com condicao registrada serao salvos.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" className="bg-transparent" onClick={() => setShowSaveDialog(false)}>Cancelar</Button>
            <Button onClick={handleSaveSnapshot} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Historico do Mapa Odontologico
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto space-y-3">
            {!snapshots || snapshots.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum registro salvo. Salve o mapa odontologico para criar o primeiro registro.
              </p>
            ) : (
              snapshots.map((snap: any, idx: number) => {
                const data = typeof snap.tooth_data === "string" ? JSON.parse(snap.tooth_data) : snap.tooth_data
                const count = Object.keys(data).length
                return (
                  <Card key={snap.id} className={idx === 0 ? "border-primary/50" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">
                              {new Date(snap.created_at).toLocaleDateString("pt-BR", {
                                day: "2-digit", month: "long", year: "numeric",
                              })}
                            </p>
                            {idx === 0 && <Badge variant="secondary" className="text-xs">Atual</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {snap.notes || "Sem observacoes"} - {count} dente(s) registrado(s)
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="bg-transparent text-xs" onClick={() => loadSnapshot(snap)}>
                          Visualizar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
