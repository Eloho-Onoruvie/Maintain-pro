import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { AppHeader as Navbar } from '@/components/navigation/Navbar'
import { CostTrendChart } from '@/features/dashboard/components/DashboardWidgets'
import { DashboardDateRangeControls } from '@/features/dashboard/components/DashboardDateRangeControls'
import { KPICard } from '@/features/dashboard/components/StatCard'
import { useDashboardDateRange } from '@/features/dashboard/hooks/useDashboardDateRange'
import { useMockDataStore } from '@/services/mockDataStore'
import {
  computeFinanceDashboardStats,
  roleDashboardTitle,
} from '@/features/dashboard/utils/roleScope'
import {
  DASHBOARD_RANGE_LABELS,
  type DashboardDateRange,
} from '@/features/dashboard/utils/dashboardDateRange'
import { useDownloadConfirm } from '@/hooks/useDownloadConfirm'
import { downloadJson } from '@/utils/downloadFile'
import { USER_ROLES } from '@/types/user.types'
import { usePortalPath } from '@/hooks/usePortal'
import { Button } from '@/components/ui/button'

export function FinanceDashboard() {
  const workOrders = useMockDataStore((s) => s.workOrders)
  const approvalsPath = usePortalPath('approvals')
  const invoicesPath = usePortalPath('invoices')
  const [range, setRange] = useState<DashboardDateRange>('30d')
  const { requestDownload, DownloadConfirmDialog } = useDownloadConfirm()
  const { stats, costTrend, workOrdersInRange } = useDashboardDateRange(range, workOrders)

  const financeStats = useMemo(
    () => computeFinanceDashboardStats(workOrdersInRange),
    [workOrdersInRange],
  )

  const exportSnapshot = () => {
    requestDownload({
      title: 'Export dashboard snapshot?',
      description: `Download finance metrics for ${DASHBOARD_RANGE_LABELS[range].toLowerCase()} as a JSON file.`,
      confirmLabel: 'Download export',
      onDownload: () => {
        downloadJson(`finance-dashboard-${range}.json`, {
          exportedAt: new Date().toISOString(),
          range,
          stats: financeStats,
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
        title={roleDashboardTitle(USER_ROLES.FINANCE)}
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
            title="Spend in range"
            value={`$${financeStats.monthlySpend.toLocaleString()}`}
            changeLabel="estimated & actual"
            icon="cost"
          />
          <Link to={approvalsPath} className="block">
            <KPICard
              title="Pending Approvals"
              value={financeStats.pendingApprovals}
              icon="overdue"
              variant="warning"
            />
          </Link>
          <Link to={invoicesPath} className="block">
            <KPICard
              title="Pending Invoices"
              value={financeStats.pendingInvoices}
              icon="compliance"
              variant="warning"
            />
          </Link>
          <KPICard
            title="Approved Invoices"
            value={financeStats.approvedInvoices}
            icon="completed"
            variant="success"
          />
          <KPICard
            title="Budget Remaining"
            value={`$${financeStats.budgetRemaining.toLocaleString()}`}
            icon="cost"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={approvalsPath}>Review approvals</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to={invoicesPath}>Verify invoices</Link>
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <CostTrendChart data={costTrend} />
          <KPICard
            title="PM Compliance"
            value={`${stats.pmCompliance}%`}
            changeLabel="org-wide in selected range"
            icon="compliance"
            variant="success"
          />
        </div>
      </div>
    </>
  )
}
