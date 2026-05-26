import { AppHeader as Navbar } from '@/components/navigation/Navbar'

import { KPICard } from '../components/StatCard'
import { WorkOrderList } from '../components/ActivityFeed'
import { mockWorkOrders } from '../services/dashboard.service'

export function VendorDashboard() {
  return (
    <>
      <Navbar
        title="Vendor Portal"
        subtitle="Manage assigned service jobs"
      />

      <div className="space-y-6 p-4 lg:p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KPICard
            title="Assigned Jobs"
            value={12}
            icon="work-orders"
          />

          <KPICard
            title="Pending Invoices"
            value={5}
            icon="cost"
          />

          <KPICard
            title="Completed Jobs"
            value={42}
            icon="compliance"
            variant="success"
          />

          <KPICard
            title="SLA Compliance"
            value="94%"
            icon="compliance"
            variant="success"
          />
        </div>

        <WorkOrderList 
          title="Active Jobs"
          workOrders={mockWorkOrders.filter(wo => wo.status !== 'completed').slice(0, 3)}
        />
      </div>
    </>
  )
}