import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileImage, FileText, Plus } from "lucide-react"

const exams = [
  {
    id: 1,
    type: "Radiografia Panorâmica",
    date: "10/10/2024",
    icon: FileImage,
    status: "Imagem",
  },
  {
    id: 2,
    type: "Periapical - Dente 16",
    date: "14/12/2024",
    icon: FileImage,
    status: "Imagem",
  },
  {
    id: 3,
    type: "Hemograma Completo",
    date: "05/10/2024",
    icon: FileText,
    status: "Documento",
  },
]

export function AttachedExams() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Exames Anexados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {exams.map((exam) => {
          const Icon = exam.icon
          return (
            <div key={exam.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <Icon className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{exam.type}</p>
                  <p className="text-xs text-muted-foreground">{exam.date}</p>
                </div>
              </div>
              <Button variant="link" size="sm" className="text-primary">
                {exam.status}
              </Button>
            </div>
          )
        })}

        <Button variant="outline" className="w-full gap-2 bg-transparent">
          <Plus className="h-4 w-4" />
          Adicionar Exame
        </Button>
      </CardContent>
    </Card>
  )
}
