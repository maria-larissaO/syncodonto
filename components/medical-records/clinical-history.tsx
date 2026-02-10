"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Loader2, Trash2 } from "lucide-react"
import { useState } from "react"
import useSWR from "swr"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface ClinicalHistoryProps {
  patientId: string
}

interface ClinicalRecord {
  id: string
  title: string
  description: string | null
  doctor_name: string | null
  record_date: string | null
  record_type: string | null
  created_at: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Erro ao buscar historico")
  return res.json()
}

export function ClinicalHistory({ patientId }: ClinicalHistoryProps) {
  const { data, isLoading, mutate } = useSWR(`/api/medical-records?patientId=${patientId}`, fetcher)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    doctor_name: "",
    record_date: new Date().toISOString().split("T")[0],
    record_type: "Procedimento",
  })

  const records: ClinicalRecord[] = data?.data || []

  const handleAdd = async () => {
    if (!form.title) {
      toast.error("Informe o titulo do registro")
      return
    }
    setIsSaving(true)
    try {
      const res = await fetch("/api/medical-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          ...form,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Erro ao salvar")
      }
      toast.success("Registro adicionado!")
      mutate()
      setIsDialogOpen(false)
      setForm({
        title: "",
        description: "",
        doctor_name: "",
        record_date: new Date().toISOString().split("T")[0],
        record_type: "Procedimento",
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/medical-records?id=${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Erro ao remover")
      toast.success("Registro removido")
      mutate()
    } catch {
      toast.error("Erro ao remover registro")
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-5 w-5 text-primary" />
          Historico Clinico
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 bg-transparent"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          Adicionar
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : records.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum registro clinico encontrado. Adicione o primeiro registro acima.
          </p>
        ) : (
          records.map((record, index) => (
            <div key={record.id}>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{record.title}</p>
                      {record.doctor_name && (
                        <p className="text-xs text-muted-foreground mt-0.5">{record.doctor_name}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {record.record_date
                          ? new Date(record.record_date).toLocaleDateString("pt-BR")
                          : new Date(record.created_at).toLocaleDateString("pt-BR")}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(record.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {record.description && (
                    <p className="text-sm text-muted-foreground mt-2">{record.description}</p>
                  )}
                </div>
              </div>
              {index < records.length - 1 && <div className="my-4 h-px bg-border" />}
            </div>
          ))
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Adicionar Registro Clinico</DialogTitle>
            <DialogDescription>Registre um procedimento, consulta ou observacao clinica.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="record-title">Titulo / Procedimento *</Label>
              <Input
                id="record-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Restauracao - Dente 16"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="record-doctor">Profissional</Label>
                <Input
                  id="record-doctor"
                  value={form.doctor_name}
                  onChange={(e) => setForm({ ...form, doctor_name: e.target.value })}
                  placeholder="Dr(a). Nome"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="record-date">Data</Label>
                <Input
                  id="record-date"
                  type="date"
                  value={form.record_date}
                  onChange={(e) => setForm({ ...form, record_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="record-desc">Descricao</Label>
              <Textarea
                id="record-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Detalhes do procedimento, observacoes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="bg-transparent" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdd} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSaving ? "Salvando..." : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
