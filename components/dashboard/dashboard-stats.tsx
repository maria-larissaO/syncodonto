import { Card, CardContent } from "@/components/ui/card"
import { Users, CheckCircle, Brain, Leaf, TrendingUp, TrendingDown } from "lucide-react"

const stats = [
  {
    icon: Users,
    label: "Pacientes Atendidos",
    value: "142",
    subtitle: "Este mês",
    change: "+12%",
    trend: "up",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: CheckCircle,
    label: "Evolução Clínica Positiva",
    value: "89%",
    subtitle: "Taxa de melhoria",
    change: "+8%",
    trend: "up",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: Brain,
    label: "Análises com IA",
    value: "37",
    subtitle: "Esta semana",
    change: "IA",
    trend: "neutral",
    color: "text-purple-600",
    bgColor: "bg-purple-600/10",
  },
  {
    icon: Leaf,
    label: "Papel Economizado",
    value: "2.847",
    subtitle: "Folhas este mês",
    change: "-100%",
    trend: "down",
    color: "text-success",
    bgColor: "bg-success/10",
  },
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.subtitle}</p>
                </div>
                <div className="flex items-center gap-1">
                  {stat.trend === "up" && <TrendingUp className="h-4 w-4 text-success" />}
                  {stat.trend === "down" && <TrendingDown className="h-4 w-4 text-success" />}
                  <span
                    className={`text-xs font-medium ${
                      stat.trend === "up" ? "text-success" : stat.trend === "down" ? "text-success" : "text-primary"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
