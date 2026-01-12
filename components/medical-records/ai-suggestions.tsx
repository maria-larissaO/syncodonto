import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, AlertTriangle, AlertCircle, Lightbulb } from "lucide-react"

const suggestions = [
  {
    id: 1,
    type: "warning",
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/20",
    message: "Padrão de desgaste compatível com bruxismo. Considere placa miorrelaxante.",
  },
  {
    id: 2,
    type: "info",
    icon: AlertCircle,
    color: "text-danger",
    bgColor: "bg-danger/10",
    borderColor: "border-danger/20",
    message: "Histórico de sensibilidade. Avaliar necessidade de dessensibilizante.",
  },
  {
    id: 3,
    type: "suggestion",
    icon: Lightbulb,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
    message: "Sugestão gerada por IA. Sempre valide com sua análise profissional.",
  },
]

export function AiSuggestions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className="h-5 w-5 text-purple-600" />
          Sugestões da IA
        </CardTitle>
        <p className="text-sm text-muted-foreground">Insights baseados no histórico do paciente</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon
          return (
            <div
              key={suggestion.id}
              className={`flex items-start gap-3 rounded-lg border ${suggestion.borderColor} ${suggestion.bgColor} p-3`}
            >
              <Icon className={`h-5 w-5 ${suggestion.color} mt-0.5 shrink-0`} />
              <p className="text-sm text-muted-foreground">{suggestion.message}</p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
