import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { AppHeader as Navbar } from '@/components/navigation/Navbar'
import {
  WorkOrderTrendChart,
  CategoryBreakdownChart,
} from '@/features/dashboard/components/DashboardWidgets'
import { DashboardDateRangeControls } from '@/features/dashboard/components/DashboardDateRangeControls'
import { KPICard } from '@/features/dashboard/components/StatCard'
import { WorkOrderList } from '@/features/dashboard/components/ActivityFeed'
import { useDashboardDateRange } from '@/features/dashboard/hooks/useDashboardDateRange'
import { useMockDataStore } from '@/services/mockDataStore'
import {
  computeAdminDashboardStats,
  roleDashboardTitle,
} from '@/features/dashboard/utils/roleScope'
import {
  DASHBOARD_RANGE_LABELS,
  type DashboardDateRange,
} from '@/features/dashboard/utils/dashboardDateRange'
import { useDownloadConfirm } from '@/hooks/useDownloadConfirm'
import { downloadJson } from '@/utils/downloadFile'
import { USER_ROLES } from '@/types/user.types'

export function AdminDashboard() {
  const workOrders = useMockDataStore((s) => s.workOrders)
  const [range, setRange] = useState<DashboardDateRange>('30d')
  const { requestDownload, DownloadConfirmDialog } = useDownloadConfirm()
  const {
    activeWorkOrders,
    categoryBreakdown,
    workOrderTrend,
    workOrdersInRange,
    stats,
  } = useDashboardDateRange(range, workOrders)

  const adminStats = useMemo(() => computeAdminDashboardStats(), [])

  const exportSnapshot = () => {
    requestDownload({
      title: 'Export dashboard snapshot?',
      description: `Download admin overview for ${DASHBOARD_RANGE_LABELS[range].toLowerCase()} as a JSON file.`,
      confirmLabel: 'Download export',
      onDownload: () => {
        downloadJson(`admin-dashboard-${range}.json`, {
          exportedAt: new Date().toISOString(),
          range,
          adminStats,
          workOrderStats: stats,
          workOrders: workOrdersInRange,
        })
        toast.success(`Exported dashboard data for ${DASHBOARD_RANGE_LABELS[range].toLowerCase()}`)
      },
    })
  }

  return (
    <>
      {DownloadConfirmDialog}
      <Navbar
        title={roleDashboardTitle(USER_ROLES.ADMIN)}
        subtitle={DASHBOARD_RANGE_LABELS[range]}
        actions={
          <DashboardDateRangeControls
            layout="desktop"
            range={range}
            onRangeChange={setRange}
            onExport={exportSnapshot}
          />
        }
      />
      <DashboardDateRangeControls
        layout="mobile"
        range={range}
        onRangeChange={setRange}
        onExport={exportSnapshot}
      />

      <div className="page-body space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard title="Total Users" value={adminStats.totalUsers} icon="work-orders" />
          <KPICard title="Active Vendors" value={adminStats.activeVendors} icon="compliance" />
          <KPICard
            title="Open Tickets"
            value={adminStats.openTickets}
            icon="overdue"
            variant="warning"
          />
          <KPICard title="Facilities" value={adminStats.facilities} icon="cost" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <WorkOrderTrendChart data={workOrderTrend} />
          </div>
          <CategoryBreakdownChart data={categoryBreakdown} />
        </div>

        <WorkOrderList
          title="Active Work Orders"
          workOrders={activeWorkOrders}
          maxItems={8}
        />
      </div>
    </>
  )
}
