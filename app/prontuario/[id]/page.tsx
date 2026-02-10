import { AppLayout } from "@/components/app-layout"
import { MedicalRecordView } from "@/components/medical-records/medical-record-view"

export default async function ProntuarioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <AppLayout>
      <MedicalRecordView patientId={id} />
    </AppLayout>
  )
}
