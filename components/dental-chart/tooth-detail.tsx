import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ToothDetailProps {
  toothNumber: number | null
}

const toothDetails: Record<number, any> = {
  16: {
    name: "Dente 16",
    status: "Restaurado",
    statusColor: "primary",
    condition: "Condição Atual",
    conditionDetail: "Restaurado",
    history: [
      {
        date: "14/12/2024",
        procedure: "Restauração em resina - dente 16",
        doctor: "Dr. Carlos Silva",
      },
    ],
  },
}

export function ToothDetail({ toothNumber }: ToothDetailProps) {
  if (!toothNumber) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Selecione um dente para ver os detalhes</p>
        </CardContent>
      </Card>
    )
  }

  const detail = toothDetails[toothNumber]

  if (!detail) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Dente {toothNumber}</span>
            <Badge variant="secondary">Sem Registros</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">Nenhum procedimento registrado para este dente.</p>
          <Button size="sm">Registrar Procedimento</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{detail.name}</span>
          <Badge
            variant={detail.statusColor === "primary" ? "default" : "secondary"}
            className={detail.statusColor === "primary" ? "bg-primary/10 text-primary hover:bg-primary/20" : undefined}
          >
            {detail.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-foreground mb-2">{detail.condition}</p>
          <p className="text-sm text-muted-foreground">{detail.conditionDetail}</p>
        </div>

        <div className="h-px bg-border" />

        <div>
          <p className="text-sm font-medium text-foreground mb-3">Histórico de Procedimentos</p>
          <div className="space-y-3">
            {detail.history.map((record: any, index: number) => (
              <div key={index} className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{record.procedure}</p>
                    <p className="text-xs text-muted-foreground mt-1">{record.doctor}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{record.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full">Registrar Procedimento</Button>
      </CardContent>
    </Card>
  )
}
