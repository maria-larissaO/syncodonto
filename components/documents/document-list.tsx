"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Download } from "lucide-react"

const documents = [
  {
    id: 1,
    type: "Termo de Consentimento",
    patient: "Maria Santos",
    procedure: "Clareamento Dental",
    date: "15/12/2024",
    status: "Assinado",
    statusColor: "success",
  },
  {
    id: 2,
    type: "Orçamento",
    patient: "João Silva",
    procedure: "Implante Dentário",
    date: "14/12/2024",
    status: "Pendente",
    statusColor: "warning",
  },
  {
    id: 3,
    type: "Termo de Consentimento",
    patient: "Ana Costa",
    procedure: "Tratamento Ortodôntico",
    date: "13/12/2024",
    status: "Assinado",
    statusColor: "success",
  },
  {
    id: 4,
    type: "Contrato de Tratamento",
    patient: "Carlos Mendes",
    procedure: "Reabilitação Oral",
    date: "12/12/2024",
    status: "Assinado",
    statusColor: "success",
  },
  {
    id: 5,
    type: "Orçamento",
    patient: "Lucia Fernandes",
    procedure: "Lentes de Porcelana",
    date: "11/12/2024",
    status: "Pendente",
    statusColor: "warning",
  },
]

export function DocumentList() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Documentos Digitais</CardTitle>
          <p className="text-sm text-muted-foreground">Todos os documentos da clínica</p>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar documento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Tipo</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Paciente</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Procedimento</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Data</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="border-b border-border transition-colors hover:bg-muted/30">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm text-foreground">{doc.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground">{doc.patient}</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{doc.procedure}</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{doc.date}</td>
                  <td className="px-4 py-4">
                    <Badge
                      variant={doc.statusColor === "success" ? "default" : "secondary"}
                      className={
                        doc.statusColor === "success"
                          ? "bg-success/10 text-success hover:bg-success/20"
                          : "bg-warning/10 text-warning hover:bg-warning/20"
                      }
                    >
                      {doc.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm">Ver</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
