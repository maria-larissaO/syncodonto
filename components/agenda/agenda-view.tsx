"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, Clock, Plus, Loader2, DollarSign, X, TrendingUp } from "lucide-react"
import { useAppointments, usePatients, createAppointment, updateAppointment } from "@/lib/hooks/use-data"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import useSWR from "swr"
import Link from "next/link"

const PROCEDURES = [
  "Consulta", "Limpeza", "Restauracao", "Tratamento de Canal", "Extracao",
  "Clareamento", "Implante", "Ortodontia", "Cirurgia", "Emergencia", "Retorno", "Protese",
]

interface ProcedureEntry {
  name: string
  cost: string
}

export function AgendaView() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [billingTab, setBillingTab] = useState<"dia" | "semana" | "mes">("dia")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const dateString = selectedDate.toISOString().split("T")[0]
  const { appointments, isLoading, error, mutate } = useAppointments({ date: dateString })
  const { patients } = usePatients()

  // Week range for billing
  const weekStart = new Date(selectedDate)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)
  const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)

  const { data: weekAppts } = useSWR(
    `/api/appointments?startDate=${weekStart.toISOString().split("T")[0]}&endDate=${weekEnd.toISOString().split("T")[0]}`,
    (url: string) => fetch(url).then(r => r.json()).then(d => d.data || [])
  )
  const { data: monthAppts } = useSWR(
    `/api/appointments?startDate=${monthStart.toISOString().split("T")[0]}&endDate=${monthEnd.toISOString().split("T")[0]}`,
    (url: string) => fetch(url).then(r => r.json()).then(d => d.data || [])
  )

  // Form state
  const [patientId, setPatientId] = useState("")
  const [time, setTime] = useState("")
  const [duration, setDuration] = useState(60)
  const [notes, setNotes] = useState("")
  const [doctorName, setDoctorName] = useState("")
  const [procedures, setProcedures] = useState<ProcedureEntry[]>([{ name: "Consulta", cost: "" }])

  const { data: staffRes } = useSWR("/api/clinic-staff", (url: string) => fetch(url).then(r => r.json()))
  const staff = staffRes?.data || []

  const addProcedure = () => setProcedures([...procedures, { name: "Consulta", cost: "" }])
  const removeProcedure = (i: number) => {
    if (procedures.length <= 1) return
    setProcedures(procedures.filter((_, idx) => idx !== i))
  }
  const updateProcedure = (i: number, field: keyof ProcedureEntry, value: string) => {
    const updated = [...procedures]
    updated[i] = { ...updated[i], [field]: value }
    setProcedures(updated)
  }

  const totalCost = procedures.reduce((sum, p) => sum + (parseFloat(p.cost) || 0), 0)

  const handleCreateAppointment = async () => {
    if (!patientId || !time || procedures.length === 0) {
      toast.error("Preencha paciente, horario e pelo menos um procedimento")
      return
    }
    setIsCreating(true)
    try {
      const procedureNames = procedures.map(p => p.name).join(", ")
      const cost = totalCost > 0 ? totalCost : null
      await createAppointment({
        patient_id: patientId,
        date: dateString,
        time,
        duration_minutes: duration,
        procedure_type: procedureNames,
        notes: notes || null,
        doctor_name: doctorName || null,
        cost,
        status: "Pendente",
      } as any)
      toast.success("Consulta agendada com sucesso!")
      mutate()
      setIsDialogOpen(false)
      setPatientId(""); setTime(""); setDuration(60); setNotes(""); setDoctorName("")
      setProcedures([{ name: "Consulta", cost: "" }])
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao agendar consulta")
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateAppointment(id, { status } as any)
      toast.success("Status atualizado!")
      mutate()
    } catch { toast.error("Erro ao atualizar status") }
  }

  const formatTime = (t: string) => t ? t.substring(0, 5) : "--:--"
  const formatDisplayDate = (d: Date) => d.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })
  const formatWeekday = (d: Date) => d.toLocaleDateString("pt-BR", { weekday: "long" })

  const navigateDate = (dir: "prev" | "next") => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + (dir === "prev" ? -1 : 1))
    setSelectedDate(d)
  }

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      "Confirmada": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      "Pendente": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      "Em Andamento": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      "Concluída": "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      "Cancelada": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    }
    return <Badge className={map[status] || ""}>{status}</Badge>
  }

  // Billing calculations
  const dayBilling = useMemo(() => {
    if (!appointments) return 0
    return appointments.reduce((s: number, a: any) => s + (parseFloat(a.cost) || 0), 0)
  }, [appointments])

  const weekBilling = useMemo(() => {
    if (!weekAppts) return 0
    return weekAppts.reduce((s: number, a: any) => s + (parseFloat(a.cost) || 0), 0)
  }, [weekAppts])

  const monthBilling = useMemo(() => {
    if (!monthAppts) return 0
    return monthAppts.reduce((s: number, a: any) => s + (parseFloat(a.cost) || 0), 0)
  }, [monthAppts])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Erro ao carregar agenda. Faca login para continuar.</p>
        <Link href="/auth/login"><Button className="mt-4">Fazer Login</Button></Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Agenda Inteligente</h1>
        <p className="text-muted-foreground">Gerencie consultas com sugestoes automaticas</p>
      </div>

      {/* Date Nav */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="bg-transparent" onClick={() => navigateDate("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold text-foreground">{formatDisplayDate(selectedDate)}</span>
                <span className="text-sm text-muted-foreground capitalize">{formatWeekday(selectedDate)}</span>
              </div>
              <Button variant="outline" size="icon" className="bg-transparent" onClick={() => navigateDate("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2"><Plus className="h-4 w-4" />Novo Agendamento</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Novo Agendamento</DialogTitle>
                  <DialogDescription>Agende uma nova consulta para {formatDisplayDate(selectedDate)}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Paciente *</Label>
                    <Select value={patientId} onValueChange={setPatientId}>
                      <SelectTrigger><SelectValue placeholder="Selecione um paciente" /></SelectTrigger>
                      <SelectContent>
                        {patients?.map((p) => <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Multiple Procedures */}
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label>Procedimentos *</Label>
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={addProcedure}>
                        <Plus className="h-3 w-3" /> Adicionar
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {procedures.map((proc, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Select value={proc.name} onValueChange={(v) => updateProcedure(i, "name", v)}>
                            <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {PROCEDURES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <div className="relative w-32">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">R$</span>
                            <Input
                              className="pl-8"
                              type="number"
                              placeholder="Valor"
                              value={proc.cost}
                              onChange={(e) => updateProcedure(i, "cost", e.target.value)}
                            />
                          </div>
                          {procedures.length > 1 && (
                            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => removeProcedure(i)}>
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    {totalCost > 0 && (
                      <p className="text-sm font-medium text-foreground text-right">
                        Total: R$ {totalCost.toFixed(2)}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Horario *</Label>
                      <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Duracao (min)</Label>
                      <Input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value) || 60)} />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Dentista Responsavel</Label>
                    {staff.length > 0 ? (
                      <Select value={doctorName} onValueChange={setDoctorName}>
                        <SelectTrigger><SelectValue placeholder="Selecione o dentista" /></SelectTrigger>
                        <SelectContent>
                          {staff.filter((s: any) => s.is_active).map((s: any) => (
                            <SelectItem key={s.id} value={s.full_name}>{s.full_name} - {s.specialty || s.role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input placeholder="Nome do dentista" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label>Observacoes</Label>
                    <Input placeholder="Observacoes adicionais..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" className="bg-transparent" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                  <Button onClick={handleCreateAppointment} disabled={isCreating}>
                    {isCreating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Agendando...</> : "Agendar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Appointments List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Consultas do Dia</CardTitle>
              <span className="text-sm text-muted-foreground">
                {isLoading ? "..." : `${appointments?.length || 0} agendamentos`}
              </span>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : !appointments || appointments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma consulta agendada para este dia</p>
                  <Button className="mt-4 bg-transparent" variant="outline" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />Agendar Consulta
                  </Button>
                </div>
              ) : (
                appointments.map((appointment) => (
                  <div key={appointment.id} className="rounded-lg border border-border bg-muted/30 p-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center rounded-lg bg-primary/10 px-3 py-2 min-w-[80px]">
                          <Clock className="h-4 w-4 text-primary mr-2" />
                          <span className="text-sm font-medium text-foreground">{formatTime(appointment.time)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{appointment.patient?.full_name || "Paciente"}</p>
                          <p className="text-xs text-muted-foreground">
                            {appointment.procedure_type}
                            {appointment.doctor_name && ` - Dr(a). ${appointment.doctor_name}`}
                          </p>
                          {(appointment as any).cost && (
                            <p className="text-xs font-medium text-primary mt-0.5">
                              R$ {parseFloat((appointment as any).cost).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStatusBadge(appointment.status)}
                        {appointment.status === "Pendente" && (
                          <Button variant="outline" size="sm" className="bg-transparent text-xs h-7" onClick={() => handleUpdateStatus(appointment.id, "Confirmada")}>
                            Confirmar
                          </Button>
                        )}
                        {(appointment.status === "Confirmada" || appointment.status === "Pendente") && (
                          <Button size="sm" className="text-xs h-7" onClick={() => handleUpdateStatus(appointment.id, "Em Andamento")}>
                            Iniciar
                          </Button>
                        )}
                        {appointment.status === "Em Andamento" && (
                          <>
                            <Button size="sm" variant="outline" className="bg-transparent text-destructive border-destructive/30 text-xs h-7" onClick={() => handleUpdateStatus(appointment.id, "Cancelada")}>
                              Cancelar
                            </Button>
                            <Button size="sm" className="bg-success text-white hover:bg-success/90 text-xs h-7" onClick={() => handleUpdateStatus(appointment.id, "Concluída")}>
                              Concluir
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Billing */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Faturamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={billingTab} onValueChange={(v) => setBillingTab(v as any)}>
                <TabsList className="w-full">
                  <TabsTrigger value="dia" className="flex-1 text-xs">Dia</TabsTrigger>
                  <TabsTrigger value="semana" className="flex-1 text-xs">Semana</TabsTrigger>
                  <TabsTrigger value="mes" className="flex-1 text-xs">Mes</TabsTrigger>
                </TabsList>
                <TabsContent value="dia" className="pt-4">
                  <p className="text-3xl font-bold text-foreground">R$ {dayBilling.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{appointments?.length || 0} consulta(s) no dia</p>
                </TabsContent>
                <TabsContent value="semana" className="pt-4">
                  <p className="text-3xl font-bold text-foreground">R$ {weekBilling.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{weekAppts?.length || 0} consulta(s) na semana</p>
                </TabsContent>
                <TabsContent value="mes" className="pt-4">
                  <p className="text-3xl font-bold text-foreground">R$ {monthBilling.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{monthAppts?.length || 0} consulta(s) no mes</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Estatisticas do Dia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-sm font-semibold text-foreground">{appointments?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Confirmadas</span>
                <Badge variant="default" className="bg-success/10 text-success hover:bg-success/20">
                  {appointments?.filter(a => a.status === "Confirmada").length || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pendentes</span>
                <Badge variant="secondary" className="bg-warning/10 text-warning hover:bg-warning/20">
                  {appointments?.filter(a => a.status === "Pendente").length || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Concluidas</span>
                <Badge variant="secondary">
                  {appointments?.filter(a => a.status === "Concluída").length || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
