import { useState } from 'react'
import { toast } from 'sonner'

import { AppHeader as Navbar } from '@/components/navigation/Navbar'
import {
  WorkOrderTrendChart,
  CategoryBreakdownChart,
  CostTrendChart,
} from '@/features/dashboard/components/DashboardWidgets'
import { DashboardDateRangeControls } from '@/features/dashboard/components/DashboardDateRangeControls'
import { KPICard } from '@/features/dashboard/components/StatCard'
import { WorkOrderList } from '@/features/dashboard/components/ActivityFeed'
import { useRoleDashboardDateRange } from '@/features/dashboard/hooks/useRoleDashboardDateRange'
import {
  computeTechnicianDashboardStats,
  roleDashboardTitle,
} from '@/features/dashboard/utils/roleScope'
import {
  DASHBOARD_RANGE_LABELS,
  type DashboardDateRange,
} from '@/features/dashboard/utils/dashboardDateRange'
import { useDownloadConfirm } from '@/hooks/useDownloadConfirm'
import { downloadJson } from '@/utils/downloadFile'
import { USER_ROLES } from '@/types/user.types'

export function TechnicianDashboard() {
  const [range, setRange] = useState<DashboardDateRange>('30d')
  const { requestDownload, DownloadConfirmDialog } = useDownloadConfirm()
  const {
    activeWorkOrders,
    stats,
    categoryBreakdown,
    workOrderTrend,
    costTrend,
    workOrdersInRange,
  } = useRoleDashboardDateRange(range)

  const techStats = computeTechnicianDashboardStats(workOrdersInRange)

  const exportSnapshot = () => {
    requestDownload({
      title: 'Export dashboard snapshot?',
      description: `Download your assigned work order stats for ${DASHBOARD_RANGE_LABELS[range].toLowerCase()} as a JSON file.`,
      confirmLabel: 'Download export',
      onDownload: () => {
        downloadJson(`technician-dashboard-${range}.json`, {
          exportedAt: new Date().toISOString(),
          range,
          stats,
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
        title={roleDashboardTitle(USER_ROLES.TECHNICIAN)}
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
          <KPICard
            title="Assigned Tasks"
            value={techStats.assigned}
            changeLabel="in selected range"
            icon="work-orders"
          />
          <KPICard
            title="In Progress"
            value={techStats.inProgress}
            changeLabel="in selected range"
            icon="compliance"
          />
          <KPICard
            title="Overdue"
            value={techStats.overdue}
            changeLabel="in selected range"
            icon="overdue"
            variant="danger"
          />
          <KPICard
            title="Completed"
            value={techStats.completedToday}
            changeLabel="in selected range"
            icon="completed"
            variant="success"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <WorkOrderTrendChart data={workOrderTrend} />
          </div>
          <CategoryBreakdownChart data={categoryBreakdown} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <WorkOrderList
              workOrders={activeWorkOrders}
              title="My Active Work Orders"
              maxItems={8}
            />
          </div>
          <KPICard
            title="PM Compliance"
            value={`${stats.pmCompliance}%`}
            changeLabel="in selected range"
            icon="compliance"
            variant="success"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <CostTrendChart data={costTrend} />
        </div>
      </div>
    </>
  )
}
