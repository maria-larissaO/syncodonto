import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ExternalLink } from "lucide-react"

const records = [
  {
    id: 1,
    procedure: "Restauração - Dente 16",
    doctor: "Dr. Carlos Silva",
    date: "14/12/2024",
    description: "Restauração em resina composta. Paciente relatou sensibilidade prévia.",
  },
  {
    id: 2,
    procedure: "Limpeza e Profilaxia",
    doctor: "Dra. Ana Paula",
    date: "10/11/2024",
    description: "Remoção de tártaro supragengival. Orientações de higiene oral reforçadas.",
  },
  {
    id: 3,
    procedure: "Avaliação Inicial",
    doctor: "Dr. Carlos Silva",
    date: "15/10/2024",
    description: "Primeira consulta. Anamnese completa. Solicitados exames radiográficos.",
  },
]

export function ClinicalHistory() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-5 w-5 text-primary" />
            Histórico Clínico
          </CardTitle>
        </div>
        <Button variant="link" size="sm" className="gap-1 text-primary">
          Ver Tudo
          <ExternalLink className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {records.map((record, index) => (
          <div key={record.id}>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{record.procedure}</p>
                    <p className="text-xs text-muted-foreground mt-1">{record.doctor}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{record.date}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{record.description}</p>
              </div>
            </div>
            {index < records.length - 1 && <div className="my-4 h-px bg-border" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
