import { AppLayout } from "@/components/app-layout"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments"
import { AiAlerts } from "@/components/dashboard/ai-alerts"
import { QuickAccess } from "@/components/dashboard/quick-access"

export default function Home() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral da sua clínica odontológica</p>
        </div>

        <DashboardStats />

        <div className="grid gap-6 lg:grid-cols-2">
          <UpcomingAppointments />
          <AiAlerts />
        </div>

        <QuickAccess />
      </div>
    </AppLayout>
  )
}
