import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function MedicalInformation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Informações Médicas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Alergias</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="destructive">Penicilina</Badge>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-2">Condições Pré-existentes</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-warning/10 text-warning hover:bg-warning/20">
              Hipertensão controlada
            </Badge>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-2">Medicamentos em Uso</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
              Losartana 50mg
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
