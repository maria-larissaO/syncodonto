"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "Out", value: 3.2 },
  { month: "Nov", value: 2.4 },
  { month: "Dez", value: 2.0 },
  { month: "Jan", value: 1.6 },
  { month: "Fev", value: 1.2 },
  { month: "Mar", value: 0.8 },
]

export function CariesIndexChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Evolução do Índice de Cárie</CardTitle>
        <p className="text-sm text-muted-foreground">Redução significativa nos últimos meses</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" domain={[0, 4]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
