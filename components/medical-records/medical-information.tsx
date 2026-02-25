"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Edit2, Save, X, AlertTriangle, Pill, HeartPulse, Droplets, Loader2 } from "lucide-react"
import { usePatient, updatePatient } from "@/lib/hooks/use-data"
import { toast } from "sonner"

interface MedicalInformationProps {
  patientId: string
}

export function MedicalInformation({ patientId }: MedicalInformationProps) {
  const { patient, isLoading, mutate } = usePatient(patientId)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    blood_type: "",
    allergies: "",
    pre_existing_conditions: "",
    medications: "",
  })

  const openEdit = () => {
    setForm({
      blood_type: patient?.blood_type || "",
      allergies: patient?.allergies || "",
      pre_existing_conditions: patient?.pre_existing_conditions || "",
      medications: patient?.medications || "",
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updatePatient(patientId, form as any)
      mutate()
      setIsEditing(false)
      toast.success("Informacoes medicas atualizadas")
    } catch {
      toast.error("Erro ao salvar")
    } finally {
      setSaving(false)
    }
  }

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
  const hasAnyInfo = allergies.length > 0 || conditions.length > 0 || medications.length > 0 || patient?.blood_type

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Heart className="h-4 w-4 text-red-500" />
          Informacoes Medicas
        </CardTitle>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={openEdit} className="gap-1.5">
            <Edit2 className="h-3.5 w-3.5" />
            {hasAnyInfo ? "Editar" : "Adicionar"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Tipo Sanguineo</Label>
              <Select value={form.blood_type} onValueChange={(v) => setForm({ ...form, blood_type: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Alergias (separar por virgula)</Label>
              <Textarea
                placeholder="Ex: Penicilina, Latex..."
                value={form.allergies}
                onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label>Condicoes Pre-existentes (separar por virgula)</Label>
              <Textarea
                placeholder="Ex: Diabetes, Hipertensao..."
                value={form.pre_existing_conditions}
                onChange={(e) => setForm({ ...form, pre_existing_conditions: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label>Medicamentos em Uso (separar por virgula)</Label>
              <Textarea
                placeholder="Ex: Metformina 500mg, Losartana 50mg..."
                value={form.medications}
                onChange={(e) => setForm({ ...form, medications: e.target.value })}
                rows={2}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" className="bg-transparent" onClick={() => setIsEditing(false)}>
                <X className="h-3.5 w-3.5 mr-1" /> Cancelar
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                <Save className="h-3.5 w-3.5 mr-1" /> {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        ) : hasAnyInfo ? (
          <div className="space-y-4">
            {patient?.blood_type && (
              <div className="flex items-start gap-3">
                <Droplets className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Tipo Sanguineo</p>
                  <Badge variant="secondary" className="mt-1">{patient.blood_type}</Badge>
                </div>
              </div>
            )}
            {allergies.length > 0 && (
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Alergias</p>
                  <div className="flex flex-wrap gap-1.5">
                    {allergies.map((a: string) => (
                      <Badge key={a} variant="destructive">{a}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {conditions.length > 0 && (
              <div className="flex items-start gap-3">
                <HeartPulse className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Condicoes Pre-existentes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {conditions.map((c: string) => (
                      <Badge key={c} variant="secondary" className="bg-amber-500/10 text-amber-600">{c}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {medications.length > 0 && (
              <div className="flex items-start gap-3">
                <Pill className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Medicamentos</p>
                  <div className="flex flex-wrap gap-1.5">
                    {medications.map((m: string) => (
                      <Badge key={m} variant="secondary" className="bg-primary/10 text-primary">{m}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma informacao medica registrada. Clique em &quot;Adicionar&quot; para incluir.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
