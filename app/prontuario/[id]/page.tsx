import { AppLayout } from "@/components/app-layout"
import { MedicalRecordView } from "@/components/medical-records/medical-record-view"

export default function ProntuarioDetailPage({ params }: { params: { id: string } }) {
  return (
    <AppLayout>
      <MedicalRecordView patientId={params.id} />
    </AppLayout>
  )
}
