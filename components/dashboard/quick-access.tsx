import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Brain, BarChart3 } from "lucide-react"
import Link from "next/link"

const quickAccessItems = [
  {
    icon: Users,
    label: "Pacientes",
    href: "/pacientes",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Calendar,
    label: "Agenda",
    href: "/agenda",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: Brain,
    label: "Análise IA",
    href: "/analise-ia",
    color: "text-purple-600",
    bgColor: "bg-purple-600/10",
  },
  {
    icon: BarChart3,
    label: "Relatórios",
    href: "/relatorios",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
]

export function QuickAccess() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acesso Rápido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickAccessItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-3 rounded-lg border border-border bg-muted/30 p-6 transition-colors hover:bg-muted"
              >
                <div className={`rounded-lg p-3 ${item.bgColor}`}>
                  <Icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <span className="text-sm font-medium text-center">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
