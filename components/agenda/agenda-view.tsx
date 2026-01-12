"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, Clock, AlertTriangle } from "lucide-react"

const appointments = [
  {
    id: 1,
    time: "08:00",
    patient: "Maria Santos",
    procedure: "Limpeza",
    duration: "30min",
    status: "confirmed",
  },
  {
    id: 2,
    time: "09:00",
    patient: "João Silva",
    procedure: "Restauração",
    duration: "1h",
    status: "confirmed",
  },
  {
    id: 3,
    time: "10:30",
    patient: "Ana Costa",
    procedure: "Avaliação",
    duration: "40min",
    status: "confirmed",
  },
  {
    id: 4,
    time: "14:00",
    patient: "Pedro Oliveira",
    procedure: "Canal",
    duration: "1h30m",
    status: "confirmed",
  },
  {
    id: 5,
    time: "16:00",
    patient: "Lucia Fernandes",
    procedure: "Retorno",
    duration: "30min",
    status: "pending",
  },
]

const alerts = [
  {
    id: 1,
    patient: "Roberto Lima",
    message: "3 faltas consecutivas - Entrar em contato",
  },
  {
    id: 2,
    patient: "Fernanda Rocha",
    message: "Lembrete enviado automaticamente",
  },
]

const suggestions = [
  {
    id: 1,
    time: "11:30",
    message: "Horário livre - Alta demanda",
  },
  {
    id: 2,
    time: "13:00",
    message: "Horário otimizado para retornos",
  },
]

export function AgendaView() {
  const [selectedDate] = useState("15 de Dezembro, 2024")
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Agenda Inteligente</h1>
        <p className="text-muted-foreground">Gerencie consultas com sugestões automáticas</p>
      </div>

      {/* Date Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="bg-transparent">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold text-foreground">{selectedDate}</span>
                <span className="text-sm text-muted-foreground">Segunda-feira</span>
              </div>
              <Button variant="outline" size="icon" className="bg-transparent">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("day")}
                className={viewMode !== "day" ? "bg-transparent" : ""}
              >
                Dia
              </Button>
              <Button
                variant={viewMode === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("week")}
                className={viewMode !== "week" ? "bg-transparent" : ""}
              >
                Semana
              </Button>
              <Button
                variant={viewMode === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("month")}
                className={viewMode !== "month" ? "bg-transparent" : ""}
              >
                Mês
              </Button>
            </div>

            <Button className="gap-2">
              <Calendar className="h-4 w-4" />
              Novo Agendamento
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Appointments List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Consultas de Hoje</CardTitle>
              <span className="text-sm text-muted-foreground">5 agendamentos</span>
            </CardHeader>
            <CardContent className="space-y-3">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center rounded-lg bg-primary/10 px-3 py-2 min-w-[80px]">
                      <Clock className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm font-medium text-foreground">{appointment.time}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{appointment.patient}</p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.procedure} • Duração: {appointment.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Editar
                    </Button>
                    <Button size="sm">Iniciar</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Alerts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Alertas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="rounded-lg bg-warning/10 border border-warning/20 p-3">
                  <p className="text-sm font-medium text-foreground">{alert.patient}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                  <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-primary">
                    Ver
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Sugestões Inteligentes</CardTitle>
              <p className="text-xs text-muted-foreground">Horários otimizados para agendamento</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="rounded-lg bg-purple-600/10 border border-purple-600/20 p-3">
                  <p className="text-sm font-medium text-foreground">{suggestion.time}</p>
                  <p className="text-xs text-muted-foreground mt-1">{suggestion.message}</p>
                  <Button variant="outline" size="sm" className="mt-2 h-7 text-xs bg-transparent">
                    Agendar
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Estatísticas do Dia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Taxa de Ocupação</span>
                <span className="text-sm font-semibold text-foreground">78%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[78%] bg-success" />
              </div>

              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total de Consultas</span>
                  <span className="text-sm font-semibold text-foreground">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Confirmadas</span>
                  <Badge variant="default" className="bg-success/10 text-success hover:bg-success/20">
                    4
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pendentes</span>
                  <Badge variant="secondary" className="bg-warning/10 text-warning hover:bg-warning/20">
                    1
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Automatic Reminders */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Lembretes Automáticos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-success/10 border border-success/20 p-3">
                <span className="text-sm text-foreground">Enviados hoje</span>
                <span className="text-lg font-bold text-success">12</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-primary/10 border border-primary/20 p-3">
                <span className="text-sm text-foreground">Programados</span>
                <span className="text-lg font-bold text-primary">8</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
