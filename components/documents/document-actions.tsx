import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, FileSignature } from "lucide-react"

const actions = [
  {
    icon: Upload,
    label: "Novo Documento",
    description: "Upload ou criação de documento",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: FileText,
    label: "Novo Termo",
    description: "Criar termo de consentimento",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: FileSignature,
    label: "Novo Orçamento",
    description: "Gerar orçamento digital",
    color: "text-purple-600",
    bgColor: "bg-purple-600/10",
  },
]

export function DocumentActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Card key={action.label} className="cursor-pointer transition-colors hover:bg-muted/50">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`rounded-lg p-4 ${action.bgColor}`}>
                  <Icon className={`h-6 w-6 ${action.color}`} />
                </div>
                <div>
                  <p className="font-medium text-foreground">{action.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
