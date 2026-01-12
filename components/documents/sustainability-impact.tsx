import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Trees, Droplets, Wind } from "lucide-react"

const metrics = [
  {
    icon: Leaf,
    label: "Papel Economizado",
    value: "2.847",
    subtitle: "Folhas este mês",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: Trees,
    label: "Árvores Preservadas",
    value: "~0.3",
    subtitle: "Equivalente",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: Wind,
    label: "CO₂ Reduzido",
    value: "12kg",
    subtitle: "Emissões evitadas",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: Droplets,
    label: "Água Economizada",
    value: "142L",
    subtitle: "Litros preservados",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
]

export function SustainabilityImpact() {
  return (
    <Card className="border-success/20 bg-success/5">
      <CardContent className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <Leaf className="h-6 w-6 text-success mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">Impacto Sustentável da Clínica</h2>
            <p className="text-sm text-muted-foreground">Sua contribuição para um futuro mais verde</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <div key={metric.label} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <div className={`rounded-lg p-2 ${metric.bgColor}`}>
                    <Icon className={`h-4 w-4 ${metric.color}`} />
                  </div>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                </div>
                <p className="mt-2 text-2xl font-bold text-foreground">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
