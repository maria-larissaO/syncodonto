import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"

const appointments = [
  {
    id: 1,
    time: "09:00",
    patient: "Maria Santos",
    procedure: "Limpeza",
    duration: "30min",
  },
  {
    id: 2,
    time: "10:30",
    patient: "João Silva",
    procedure: "Restauração",
    duration: "1h",
  },
  {
    id: 3,
    time: "14:00",
    patient: "Ana Costa",
    procedure: "Avaliação",
    duration: "40min",
  },
  {
    id: 4,
    time: "15:30",
    patient: "Pedro Oliveira",
    procedure: "Canal",
    duration: "1h30m",
  },
]

export function UpcomingAppointments() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Próximos Atendimentos
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Hoje, 15 de dezembro</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-lg bg-primary/10 px-3 py-2">
                <Clock className="h-4 w-4 text-primary mr-1" />
                <span className="text-sm font-medium text-foreground">{appointment.time}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{appointment.patient}</p>
                <p className="text-xs text-muted-foreground">
                  {appointment.procedure} • Duração: {appointment.duration}
                </p>
              </div>
            </div>
            <Button size="sm">Iniciar</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
