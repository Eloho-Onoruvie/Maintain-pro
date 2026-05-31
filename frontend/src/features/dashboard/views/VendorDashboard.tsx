import { useState } from 'react'
import { toast } from 'sonner'

import { AppHeader as Navbar } from '@/components/navigation/Navbar'
import {
  WorkOrderTrendChart,
  CategoryBreakdownChart,
} from '@/features/dashboard/components/DashboardWidgets'
import { DashboardDateRangeControls } from '@/features/dashboard/components/DashboardDateRangeControls'
import { KPICard } from '@/features/dashboard/components/StatCard'
import { WorkOrderList } from '@/features/dashboard/components/ActivityFeed'
import { useRoleDashboardDateRange } from '@/features/dashboard/hooks/useRoleDashboardDateRange'
import {
  computeVendorDashboardStats,
  roleDashboardTitle,
} from '@/features/dashboard/utils/roleScope'
import {
  DASHBOARD_RANGE_LABELS,
  type DashboardDateRange,
} from '@/features/dashboard/utils/dashboardDateRange'
import { useDownloadConfirm } from '@/hooks/useDownloadConfirm'
import { downloadJson } from '@/utils/downloadFile'
import { USER_ROLES } from '@/types/user.types'

export function VendorDashboard() {
  const [range, setRange] = useState<DashboardDateRange>('30d')
  const { requestDownload, DownloadConfirmDialog } = useDownloadConfirm()
  const {
    activeWorkOrders,
    categoryBreakdown,
    workOrderTrend,
    workOrdersInRange,
  } = useRoleDashboardDateRange(range)

  const vendorStats = computeVendorDashboardStats(workOrdersInRange)

  const exportSnapshot = () => {
    requestDownload({
      title: 'Export dashboard snapshot?',
      description: `Download your assigned job stats for ${DASHBOARD_RANGE_LABELS[range].toLowerCase()} as a JSON file.`,
      confirmLabel: 'Download export',
      onDownload: () => {
        downloadJson(`vendor-dashboard-${range}.json`, {
          exportedAt: new Date().toISOString(),
          range,
          stats: vendorStats,
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
        title={roleDashboardTitle(USER_ROLES.VENDOR_TEAM_LEAD)}
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
          <KPICard title="Assigned Jobs" value={vendorStats.assignedJobs} icon="work-orders" />
          <KPICard
            title="Pending Invoices"
            value={vendorStats.pendingInvoices}
            icon="cost"
            variant="warning"
          />
          <KPICard
            title="Completed Jobs"
            value={vendorStats.completedJobs}
            icon="compliance"
            variant="success"
          />
          <KPICard
            title="SLA Compliance"
            value={`${vendorStats.slaCompliance}%`}
            icon="compliance"
            variant="success"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <WorkOrderTrendChart data={workOrderTrend} />
          </div>
          <CategoryBreakdownChart data={categoryBreakdown} />
        </div>

        <WorkOrderList
          title="Active Jobs"
          workOrders={activeWorkOrders}
          maxItems={8}
        />
      </div>
    </>
  )
}
