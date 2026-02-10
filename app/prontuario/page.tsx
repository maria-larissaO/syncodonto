"use client"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, ChevronRight } from "lucide-react"
import { usePatients } from "@/lib/hooks/use-data"
import Link from "next/link"
import { useState } from "react"

export default function ProntuarioPage() {
  const { patients, isLoading } = usePatients()
  const [search, setSearch] = useState("")

  const filtered = patients?.filter(
    (p) =>
      p.full_name.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.includes(search)
  )

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prontuario Eletronico</h1>
          <p className="text-muted-foreground">Selecione um paciente para acessar o prontuario completo</p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar paciente por nome, email ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : filtered && filtered.length > 0 ? (
          <div className="grid gap-3">
            {filtered.map((patient) => (
              <Link key={patient.id} href={`/prontuario/${patient.id}`}>
                <Card className="transition-colors hover:bg-muted/50 cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                          {patient.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{patient.full_name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            {patient.phone && (
                              <span className="text-xs text-muted-foreground">{patient.phone}</span>
                            )}
                            {patient.email && (
                              <span className="text-xs text-muted-foreground">{patient.email}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={patient.status === "Ativo" ? "default" : "secondary"}
                          className={
                            patient.status === "Ativo"
                              ? "bg-success/10 text-success hover:bg-success/20"
                              : patient.status === "Em Tratamento"
                                ? "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                                : ""
                          }
                        >
                          {patient.status}
                        </Badge>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground">Nenhum paciente encontrado</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {search ? "Tente uma busca diferente" : "Cadastre pacientes primeiro na lista de pacientes"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
