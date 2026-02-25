"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Treatment {
  id: string
  treatment_type: string
  tooth_number: number | null
  status: string
  cost: number | null
  scheduled_date: string | null
  completed_date: string | null
  description: string | null
}

interface TreatmentHistoryProps {
  treatments: Treatment[]
}

export function ComparisonChart({ treatments }: TreatmentHistoryProps) {
  if (!treatments || treatments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historico de Tratamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhum tratamento registrado para este paciente.
          </p>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Concluido":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Concluido</Badge>
      case "Em Andamento":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Em Andamento</Badge>
      case "Agendado":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Agendado</Badge>
      case "Cancelado":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Cancelado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Historico de Tratamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Dente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Custo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {treatments.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.treatment_type}</TableCell>
                <TableCell>{t.tooth_number ?? "-"}</TableCell>
                <TableCell>{getStatusBadge(t.status)}</TableCell>
                <TableCell>
                  {t.completed_date
                    ? new Date(t.completed_date).toLocaleDateString("pt-BR")
                    : t.scheduled_date
                      ? new Date(t.scheduled_date).toLocaleDateString("pt-BR")
                      : "-"}
                </TableCell>
                <TableCell className="text-right">
                  {t.cost ? `R$ ${Number(t.cost).toFixed(2)}` : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
