"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Users, Calendar, DollarSign, TrendingUp, Clock, UserPlus, Settings } from "lucide-react"

export function ClinicManagementView() {
  const [activeTab, setActiveTab] = useState<"equipe" | "financeiro" | "configuracoes">("equipe")

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Gestão da Clínica</h1>
        <p className="text-muted-foreground mt-1">Gerencie equipe, finanças e operações</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Funcionários Ativos</p>
              <p className="text-2xl font-bold text-foreground mt-1">12</p>
              <p className="text-xs text-green-600 mt-1">+2 este mês</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Receita Mensal</p>
              <p className="text-2xl font-bold text-foreground mt-1">R$ 85.420</p>
              <p className="text-xs text-green-600 mt-1">+12% vs mês anterior</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Ocupação</p>
              <p className="text-2xl font-bold text-foreground mt-1">87%</p>
              <p className="text-xs text-green-600 mt-1">Ótima utilização</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tempo Médio</p>
              <p className="text-2xl font-bold text-foreground mt-1">42min</p>
              <p className="text-xs text-orange-600 mt-1">Por consulta</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab("equipe")}
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === "equipe"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Equipe
        </button>
        <button
          onClick={() => setActiveTab("financeiro")}
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === "financeiro"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Financeiro
        </button>
        <button
          onClick={() => setActiveTab("configuracoes")}
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === "configuracoes"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Configurações
        </button>
      </div>

      {/* Content */}
      {activeTab === "equipe" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Membros da Equipe</h2>
            <Button className="bg-primary hover:bg-primary/90">
              <UserPlus className="w-4 h-4 mr-2" />
              Adicionar Membro
            </Button>
          </div>

          <div className="grid gap-4">
            {[
              { name: "Dr. Carlos Silva", role: "Dentista", status: "Ativo", appointments: 8 },
              { name: "Dra. Ana Paula", role: "Ortodontista", status: "Ativo", appointments: 6 },
              { name: "Dr. Roberto Lima", role: "Cirurgião", status: "Ativo", appointments: 4 },
              { name: "Maria Santos", role: "Higienista", status: "Ativo", appointments: 12 },
              { name: "João Costa", role: "Recepcionista", status: "Ativo", appointments: 0 },
            ].map((member, i) => (
              <Card key={i} className="p-4 border-border">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm text-muted-foreground">Consultas Hoje</p>
                      <p className="font-semibold text-foreground">{member.appointments}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">{member.status}</span>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "financeiro" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Visão Financeira</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6 border-border">
              <h3 className="font-semibold text-foreground mb-4">Receitas do Mês</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Consultas</span>
                  <span className="font-semibold text-foreground">R$ 45.320</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Procedimentos</span>
                  <span className="font-semibold text-foreground">R$ 28.650</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Ortodontia</span>
                  <span className="font-semibold text-foreground">R$ 11.450</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-primary text-lg">R$ 85.420</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border">
              <h3 className="font-semibold text-foreground mb-4">Despesas do Mês</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Folha de Pagamento</span>
                  <span className="font-semibold text-foreground">R$ 32.500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Materiais</span>
                  <span className="font-semibold text-foreground">R$ 8.200</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Aluguel e Contas</span>
                  <span className="font-semibold text-foreground">R$ 5.800</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-red-600 text-lg">R$ 46.500</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 border-border bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Lucro Líquido</h3>
                <p className="text-sm text-muted-foreground">Dezembro 2024</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">R$ 38.920</p>
                <p className="text-sm text-green-700 flex items-center gap-1 justify-end">
                  <TrendingUp className="w-4 h-4" />
                  +15% vs mês anterior
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "configuracoes" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Configurações da Clínica</h2>

          <Card className="p-6 border-border">
            <h3 className="font-semibold text-foreground mb-4">Informações Básicas</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Nome da Clínica</label>
                <Input className="mt-1" defaultValue="OdontoConnect Clínica" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">CNPJ</label>
                <Input className="mt-1" defaultValue="12.345.678/0001-90" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Telefone</label>
                <Input className="mt-1" defaultValue="(11) 98765-4321" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Endereço</label>
                <Input className="mt-1" defaultValue="Rua das Flores, 123 - São Paulo, SP" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border">
            <h3 className="font-semibold text-foreground mb-4">Horário de Funcionamento</h3>
            <div className="space-y-3">
              {["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira"].map((dia) => (
                <div key={dia} className="flex items-center justify-between">
                  <span className="text-foreground">{dia}</span>
                  <span className="text-muted-foreground">08:00 - 18:00</span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-foreground">Sábado</span>
                <span className="text-muted-foreground">08:00 - 12:00</span>
              </div>
            </div>
          </Card>

          <Button className="w-full bg-primary hover:bg-primary/90">Salvar Configurações</Button>
        </div>
      )}
    </div>
  )
}
