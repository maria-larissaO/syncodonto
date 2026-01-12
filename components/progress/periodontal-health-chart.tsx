"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  { month: "Out", bleeding: 45, depth: 50 },
  { month: "Nov", bleeding: 38, depth: 45 },
  { month: "Dez", bleeding: 30, depth: 38 },
  { month: "Jan", bleeding: 22, depth: 30 },
  { month: "Fev", bleeding: 15, depth: 20 },
  { month: "Mar", bleeding: 10, depth: 12 },
]

export function PeriodontalHealthChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Saúde Periodontal</CardTitle>
        <p className="text-sm text-muted-foreground">Sangramento e profundidade de bolsa</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" domain={[0, 60]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="bleeding"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Sangramento (%)"
            />
            <Line
              type="monotone"
              dataKey="depth"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Prof. Bolsa (mm)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
