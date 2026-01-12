import { Card, CardContent } from "@/components/ui/card"

const legendItems = [
  { label: "Saudável", color: "bg-success" },
  { label: "Restaurado", color: "bg-primary" },
  { label: "Atenção/Cárie", color: "bg-warning" },
  { label: "Tratamento Canal", color: "bg-danger" },
  { label: "Sem Registros", color: "bg-muted" },
]

export function ChartLegend() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-medium text-foreground">Legenda de Condições</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-4">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`h-4 w-4 rounded ${item.color}`} />
              <span className="text-sm text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
