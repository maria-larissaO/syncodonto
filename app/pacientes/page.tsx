import { AppLayout } from "@/components/app-layout"
import { PatientList } from "@/components/patients/patient-list"

export default function PacientesPage() {
  return (
    <AppLayout>
      <PatientList />
    </AppLayout>
  )
}
