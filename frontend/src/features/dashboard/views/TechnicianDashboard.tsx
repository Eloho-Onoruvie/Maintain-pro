import { AppHeader as Navbar } from '@/components/navigation/Navbar'
import { KPICard } from '../components/StatCard'
import { WorkOrderList } from '../components/ActivityFeed'
import { mockWorkOrders } from '../services/dashboard.service'
import { CategoryBreakdownChart } from '../components/DashboardWidgets'
import { useAuthStore } from '@/app/store'

export function TechnicianDashboard() {
  const user = useAuthStore((state) => state.user)
  const userFullName = user ? `${user.firstName} ${user.lastName}` : 'Mike Rodriguez'

  const assignedWorkOrders = mockWorkOrders.filter(
    (wo) => wo.assigneeName === userFullName
  )

  return (
    <>
      <Navbar
        title="Technician Dashboard"
        subtitle="Your assigned maintenance tasks"
      />

      <div className="space-y-6 page-body">
        <div className="grid gap-4 md:grid-cols-3">
          <KPICard
            title="Assigned Tasks"
            value={assignedWorkOrders.length}
            icon="work-orders"
          />

          <KPICard
            title="In Progress"
            value={
              assignedWorkOrders.filter(
                (wo) => wo.status === 'in_progress'
              ).length
            }
            icon="compliance"
          />

          <KPICard
            title="Completed Today"
            value={4}
            icon="cost"
            variant="success"
          />
        </div>

        <WorkOrderList
          title="My Work Orders"
          workOrders={assignedWorkOrders}
        />
      </div>
    </>
  )
}