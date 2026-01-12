"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import Link from "next/link"

interface PatientTableProps {
  searchQuery: string
  activeTab: string
}

const patients = [
  {
    id: 1,
    initials: "MS",
    name: "Maria Santos",
    age: 34,
    lastConsult: "10/12/2024",
    status: "Ativo",
    statusColor: "success",
    risk: "Baixo",
    riskColor: "success",
    nextReturn: "20/12/2024",
  },
  {
    id: 2,
    initials: "JS",
    name: "João Silva",
    age: 45,
    lastConsult: "12/12/2024",
    status: "Em Tratamento",
    statusColor: "primary",
    risk: "Médio",
    riskColor: "warning",
    nextReturn: "18/12/2024",
  },
  {
    id: 3,
    initials: "AC",
    name: "Ana Costa",
    age: 28,
    lastConsult: "08/12/2024",
    status: "Ativo",
    statusColor: "success",
    risk: "Baixo",
    riskColor: "success",
    nextReturn: "15/12/2024",
  },
  {
    id: 4,
    initials: "CM",
    name: "Carlos Mendes",
    age: 52,
    lastConsult: "14/12/2024",
    status: "Atenção",
    statusColor: "danger",
    risk: "Alto",
    riskColor: "danger",
    nextReturn: "16/12/2024",
  },
  {
    id: 5,
    initials: "LF",
    name: "Lucia Fernandes",
    age: 39,
    lastConsult: "13/12/2024",
    status: "Em Tratamento",
    statusColor: "primary",
    risk: "Médio",
    riskColor: "warning",
    nextReturn: "22/12/2024",
  },
  {
    id: 6,
    initials: "PO",
    name: "Pedro Oliveira",
    age: 41,
    lastConsult: "11/12/2024",
    status: "Ativo",
    statusColor: "success",
    risk: "Baixo",
    riskColor: "success",
    nextReturn: "15/12/2024",
  },
  {
    id: 7,
    initials: "RL",
    name: "Roberto Lima",
    age: 36,
    lastConsult: "09/12/2024",
    status: "Ativo",
    statusColor: "success",
    risk: "Baixo",
    riskColor: "success",
    nextReturn: "19/12/2024",
  },
  {
    id: 8,
    initials: "FR",
    name: "Fernanda Rocha",
    age: 29,
    lastConsult: "07/12/2024",
    status: "Concluído",
    statusColor: "default",
    risk: "Baixo",
    riskColor: "success",
    nextReturn: "15/01/2025",
  },
]

export function PatientTable({ searchQuery, activeTab }: PatientTableProps) {
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (activeTab === "all") return true
    if (activeTab === "treatment") return patient.status === "Em Tratamento"
    if (activeTab === "attention") return patient.status === "Atenção"
    if (activeTab === "high-risk") return patient.risk === "Alto"

    return true
  })

  return (
    <Card>
      <CardContent className="p-0">
        {/* Desktop Table */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Paciente</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Idade</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Última Consulta</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Risco Clínico</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Próximo Retorno</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="border-b border-border transition-colors hover:bg-muted/30">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                        {patient.initials}
                      </div>
                      <span className="font-medium text-foreground">{patient.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{patient.age} anos</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{patient.lastConsult}</td>
                  <td className="px-4 py-4">
                    <Badge
                      variant={
                        patient.statusColor === "success"
                          ? "default"
                          : patient.statusColor === "danger"
                            ? "destructive"
                            : "secondary"
                      }
                      className={
                        patient.statusColor === "success"
                          ? "bg-success/10 text-success hover:bg-success/20"
                          : patient.statusColor === "primary"
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : ""
                      }
                    >
                      {patient.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      variant={patient.riskColor === "danger" ? "destructive" : "secondary"}
                      className={
                        patient.riskColor === "success"
                          ? "bg-success/10 text-success hover:bg-success/20"
                          : patient.riskColor === "warning"
                            ? "bg-warning/10 text-warning hover:bg-warning/20"
                            : ""
                      }
                    >
                      {patient.risk}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {patient.nextReturn}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link href={`/prontuario/${patient.id}`}>
                      <Button size="sm">Ver Prontuário</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-3 p-4 lg:hidden">
          {filteredPatients.map((patient) => (
            <Card key={patient.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                    {patient.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground">{patient.age} anos</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge
                        variant={
                          patient.statusColor === "success"
                            ? "default"
                            : patient.statusColor === "danger"
                              ? "destructive"
                              : "secondary"
                        }
                        className={
                          patient.statusColor === "success"
                            ? "bg-success/10 text-success"
                            : patient.statusColor === "primary"
                              ? "bg-primary/10 text-primary"
                              : ""
                        }
                      >
                        {patient.status}
                      </Badge>
                      <Badge
                        variant={patient.riskColor === "danger" ? "destructive" : "secondary"}
                        className={
                          patient.riskColor === "success"
                            ? "bg-success/10 text-success"
                            : patient.riskColor === "warning"
                              ? "bg-warning/10 text-warning"
                              : ""
                        }
                      >
                        {patient.risk}
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {patient.nextReturn}
                      </div>
                      <Link href={`/prontuario/${patient.id}`}>
                        <Button size="sm">Ver Prontuário</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-4 py-4">
          <p className="text-sm text-muted-foreground">Mostrando {filteredPatients.length} de 142 pacientes</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Anterior
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Próximo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
