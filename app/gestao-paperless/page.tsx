import { AppLayout } from "@/components/app-layout"
import { DocumentManagementView } from "@/components/documents/document-management-view"

export default function GestaoPaperlessPage() {
  return (
    <AppLayout>
      <DocumentManagementView />
    </AppLayout>
  )
}
