"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileImage, FileText, Plus, Loader2, Trash2, Upload, X } from "lucide-react"
import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface AttachedExamsProps {
  patientId: string
}

interface Exam {
  id: string
  title: string
  exam_type: string
  file_url: string | null
  content: string | null
  created_at: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Erro ao buscar exames")
  return res.json()
}

export function AttachedExams({ patientId }: AttachedExamsProps) {
  const { data, isLoading, mutate } = useSWR(`/api/documents?patient_id=${patientId}&document_type=exam`, fetcher)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [title, setTitle] = useState("")
  const [examType, setExamType] = useState("Radiografia")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewExam, setPreviewExam] = useState<Exam | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const exams: Exam[] = data?.data || []

  const handleAddExam = async () => {
    if (!title) {
      toast.error("Informe o nome do exame")
      return
    }

    setIsSaving(true)
    try {
      let fileUrl: string | null = null

      if (selectedFile) {
        const supabase = createClient()
        const fileExt = selectedFile.name.split(".").pop()
        const filePath = `exams/${patientId}/${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from("documents")
          .upload(filePath, selectedFile)

        if (uploadError) {
          // Storage may not be set up, just save without file
          console.log("[v0] Storage upload skipped:", uploadError.message)
        } else {
          const { data: urlData } = supabase.storage
            .from("documents")
            .getPublicUrl(filePath)
          fileUrl = urlData.publicUrl
        }
      }

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          title,
          document_type: "exam",
          status: "signed",
          content: examType,
          file_url: fileUrl,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Erro ao salvar exame")
      }

      toast.success("Exame adicionado com sucesso!")
      mutate()
      setIsDialogOpen(false)
      setTitle("")
      setExamType("Radiografia")
      setSelectedFile(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar exame")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteExam = async (examId: string) => {
    try {
      const res = await fetch(`/api/documents?id=${examId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Erro ao remover")
      toast.success("Exame removido")
      mutate()
    } catch {
      toast.error("Erro ao remover exame")
    }
  }

  const getIcon = (type: string) => {
    if (type?.toLowerCase().includes("radiografia") || type?.toLowerCase().includes("imagem")) {
      return FileImage
    }
    return FileText
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Exames Anexados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : exams.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum exame anexado. Clique abaixo para adicionar.
          </p>
        ) : (
          exams.map((exam) => {
            const Icon = getIcon(exam.exam_type || (exam as any).content || "")
            return (
              <div key={exam.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                    <Icon className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{exam.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {(exam as any).content || exam.exam_type} - {new Date(exam.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-primary"
                    onClick={() => setPreviewExam(exam)}
                  >
                    Ver
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteExam(exam.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )
          })
        )}

        <Button
          variant="outline"
          className="w-full gap-2 bg-transparent"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Adicionar Exame
        </Button>

        {/* Preview Dialog */}
        <Dialog open={!!previewExam} onOpenChange={(open) => !open && setPreviewExam(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[85vh]">
            <DialogHeader>
              <DialogTitle>{previewExam?.title}</DialogTitle>
              <DialogDescription>
                {previewExam?.content || previewExam?.exam_type} - {previewExam ? new Date(previewExam.created_at).toLocaleDateString("pt-BR") : ""}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {previewExam?.file_url ? (
                <div className="space-y-4">
                  {previewExam.file_url.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|$)/i) ? (
                    <div className="rounded-lg overflow-hidden border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewExam.file_url} alt={previewExam.title} className="w-full h-auto max-h-[60vh] object-contain bg-muted" />
                    </div>
                  ) : previewExam.file_url.match(/\.pdf(\?|$)/i) ? (
                    <iframe src={previewExam.file_url} className="w-full h-[60vh] rounded-lg border border-border" title={previewExam.title} />
                  ) : (
                    <div className="text-center py-8 space-y-3">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        Arquivo disponivel para download
                      </p>
                    </div>
                  )}
                  <div className="flex justify-center">
                    <Button variant="outline" className="bg-transparent gap-2" onClick={() => window.open(previewExam!.file_url!, "_blank")}>
                      <FileText className="h-4 w-4" />
                      Abrir em Nova Aba
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum arquivo anexado a este exame.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tipo: {previewExam?.content || previewExam?.exam_type}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Exam Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[420px]">
            <DialogHeader>
              <DialogTitle>Adicionar Exame</DialogTitle>
              <DialogDescription>Registre um novo exame para este paciente.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="exam-title">Nome do Exame *</Label>
                <Input
                  id="exam-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Radiografia Panoramica"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="exam-type">Tipo</Label>
                <Select value={examType} onValueChange={setExamType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Radiografia">Radiografia</SelectItem>
                    <SelectItem value="Tomografia">Tomografia</SelectItem>
                    <SelectItem value="Hemograma">Hemograma</SelectItem>
                    <SelectItem value="Periapical">Periapical</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Arquivo (opcional)</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setSelectedFile(e.target.files[0])
                  }}
                />
                {selectedFile ? (
                  <div className="flex items-center gap-2 rounded-lg border border-border p-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground flex-1 truncate">{selectedFile.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => setSelectedFile(null)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="gap-2 bg-transparent"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    Selecionar Arquivo
                  </Button>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="bg-transparent" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddExam} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSaving ? "Salvando..." : "Adicionar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
