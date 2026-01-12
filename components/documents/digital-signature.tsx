import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock } from "lucide-react"

export function DigitalSignature() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Assinatura Digital</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <p className="text-sm font-medium text-foreground">Documentos Assinados</p>
            </div>
            <p className="text-2xl font-bold text-foreground">37</p>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-warning" />
              <p className="text-sm font-medium text-foreground">Aguardando Assinatura</p>
            </div>
            <p className="text-2xl font-bold text-foreground">5</p>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
