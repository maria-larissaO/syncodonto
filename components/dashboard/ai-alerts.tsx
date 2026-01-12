import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, AlertTriangle, AlertCircle, Info, Lightbulb } from "lucide-react"

const alerts = [
  {
    id: 1,
    type: "critical",
    patient: "Carlos Mendes",
    message: "Possível lesão cariosa detectada - dente 16",
    icon: AlertTriangle,
    color: "text-danger",
    bgColor: "bg-danger/10",
    borderColor: "border-danger/20",
  },
  {
    id: 2,
    type: "warning",
    patient: "Lucia Fernandes",
    message: "Reabsorção óssea - acompanhamento recomendado",
    icon: AlertCircle,
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/20",
  },
  {
    id: 3,
    type: "info",
    patient: "Roberto Lima",
    message: "Padrão compatível com bruxismo",
    icon: Info,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
]

export function AiAlerts() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Alertas da IA
          </CardTitle>
          <p className="text-xs text-muted-foreground">Sugestões para atenção</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => {
          const Icon = alert.icon
          return (
            <div
              key={alert.id}
              className={`flex items-start gap-3 rounded-lg border ${alert.borderColor} ${alert.bgColor} p-3`}
            >
              <Icon className={`h-5 w-5 ${alert.color} mt-0.5`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{alert.patient}</p>
                <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
              </div>
              <Button variant="ghost" size="sm" className="shrink-0">
                Ver
              </Button>
            </div>
          )
        })}

        <div className="mt-4 rounded-lg bg-purple-600/10 border border-purple-600/20 p-3 flex items-start gap-2">
          <Lightbulb className="h-5 w-5 text-purple-600 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            A IA é uma ferramenta de suporte. Sempre valide com sua análise profissional.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
