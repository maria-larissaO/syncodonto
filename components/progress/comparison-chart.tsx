"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  { category: "Higiene", before: 35, after: 85 },
  { category: "Saúde Gengival", before: 30, after: 80 },
  { category: "Índice de Cárie", before: 65, after: 18 },
  { category: "Saúde Geral", before: 48, after: 90 },
]

export function ComparisonChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Comparação: Antes vs Depois</CardTitle>
        <p className="text-sm text-muted-foreground">Out/2024 (Início do Tratamento) vs Mar/2025 (Atual)</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="category" className="text-xs" />
            <YAxis className="text-xs" domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="before" fill="#94a3b8" name="Antes (Out/2024)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="after" fill="hsl(var(--success))" name="Depois (Mar/2025)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
