import { AppHeader as Navbar } from '@/components/navigation/Navbar'

import { KPICard } from '../components/StatCard'
import { 
  WorkOrderTrendChart, 
  CategoryBreakdownChart 
} from '../components/DashboardWidgets'

export function AdminDashboard() {
  return (
    <>
      <Navbar
        title="Admin Dashboard"
        subtitle="System administration overview"
      />

      <div className="space-y-6 p-4 lg:p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KPICard
            title="Total Users"
            value={248}
            icon="work-orders"
          />

          <KPICard
            title="Active Vendors"
            value={34}
            icon="compliance"
          />

          <KPICard
            title="Open Tickets"
            value={12}
            icon="overdue"
            variant="warning"
          />

          <KPICard
            title="Facilities"
            value={18}
            icon="cost"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <WorkOrderTrendChart />
          </div>
          <CategoryBreakdownChart />
        </div>
      </div>
    </>
  )
}