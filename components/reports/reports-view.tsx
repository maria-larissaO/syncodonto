"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, TrendingUp, Users, Calendar, DollarSign, FileText, BarChart3, PieChart } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

const revenueData = [
  { month: "Jul", receita: 72000, despesas: 45000 },
  { month: "Ago", receita: 78000, despesas: 43000 },
  { month: "Set", receita: 68000, despesas: 48000 },
  { month: "Out", receita: 82000, despesas: 46000 },
  { month: "Nov", receita: 88000, despesas: 44000 },
  { month: "Dez", receita: 85420, despesas: 46500 },
]

const proceduresData = [
  { name: "Limpeza", value: 145 },
  { name: "Restauração", value: 98 },
  { name: "Canal", value: 56 },
  { name: "Ortodontia", value: 42 },
  { name: "Implante", value: 28 },
]

const COLORS = ["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"]

export function ReportsView() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month")

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground mt-1">Análise detalhada de desempenho</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2">
        <Button
          variant={period === "week" ? "default" : "outline"}
          onClick={() => setPeriod("week")}
          className={period === "week" ? "bg-primary" : ""}
        >
          Semana
        </Button>
        <Button
          variant={period === "month" ? "default" : "outline"}
          onClick={() => setPeriod("month")}
          className={period === "month" ? "bg-primary" : ""}
        >
          Mês
        </Button>
        <Button
          variant={period === "year" ? "default" : "outline"}
          onClick={() => setPeriod("year")}
          className={period === "year" ? "bg-primary" : ""}
        >
          Ano
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Receita Total</p>
              <p className="text-2xl font-bold text-foreground mt-1">R$ 85.420</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12% vs período anterior
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pacientes Atendidos</p>
              <p className="text-2xl font-bold text-foreground mt-1">142</p>
              <p className="text-xs text-green-600 mt-1">+8 novos pacientes</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Consultas Realizadas</p>
              <p className="text-2xl font-bold text-foreground mt-1">369</p>
              <p className="text-xs text-green-600 mt-1">Taxa de 89%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ticket Médio</p>
              <p className="text-2xl font-bold text-foreground mt-1">R$ 231</p>
              <p className="text-xs text-orange-600 mt-1">Por consulta</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="p-6 border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Receitas vs Despesas</h3>
            <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
          </div>
          <FileText className="w-5 h-5 text-muted-foreground" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="receita" stroke="#0ea5e9" strokeWidth={2} name="Receita" />
            <Line type="monotone" dataKey="despesas" stroke="#ef4444" strokeWidth={2} name="Despesas" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Two Column Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Procedures Chart */}
        <Card className="p-6 border-border">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Procedimentos Realizados</h3>
            <p className="text-sm text-muted-foreground">Distribuição por tipo</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={proceduresData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {proceduresData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {proceduresData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-foreground">{item.name}</span>
                </div>
                <span className="font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance by Dentist */}
        <Card className="p-6 border-border">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Performance por Dentista</h3>
            <p className="text-sm text-muted-foreground">Consultas realizadas</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: "Dr. Carlos", consultas: 95 },
                { name: "Dra. Ana", consultas: 88 },
                { name: "Dr. Roberto", consultas: 76 },
                { name: "Dra. Maria", consultas: 110 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="consultas" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Summary Reports */}
      <Card className="p-6 border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Relatórios Disponíveis</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Relatório Financeiro Completo", icon: DollarSign },
            { name: "Relatório de Pacientes", icon: Users },
            { name: "Relatório de Procedimentos", icon: FileText },
            { name: "Relatório de Agendamentos", icon: Calendar },
            { name: "Relatório de Performance", icon: TrendingUp },
            { name: "Relatório Personalizado", icon: PieChart },
          ].map((report, i) => (
            <Button key={i} variant="outline" className="justify-start h-auto py-4 bg-transparent">
              <report.icon className="w-5 h-5 mr-3 text-primary" />
              <div className="text-left">
                <p className="font-medium">{report.name}</p>
                <p className="text-xs text-muted-foreground">Gerar relatório</p>
              </div>
            </Button>
          ))}
        </div>
      </Card>
    </div>
  )
}
