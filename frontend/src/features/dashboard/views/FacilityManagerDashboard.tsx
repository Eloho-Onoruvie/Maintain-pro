import { useState } from 'react'
import { Calendar, Download } from 'lucide-react'
import { toast } from 'sonner'

import { AppHeader as Navbar } from '@/components/navigation/Navbar'
import {
  WorkOrderTrendChart,
  CategoryBreakdownChart,
  CostTrendChart,
} from '@/features/dashboard/components/DashboardWidgets'
import { KPICard } from '@/features/dashboard/components/StatCard'
import { WorkOrderList } from '@/features/dashboard/components/ActivityFeed'
import { useDashboardDateRange } from '@/features/dashboard/hooks/useDashboardDateRange'
import {
  DASHBOARD_RANGE_LABELS,
  type DashboardDateRange,
} from '@/features/dashboard/utils/dashboardDateRange'
import { Button } from '@/components/ui/button'

export function FacilityManagerDashboard() {
  const [range, setRange] = useState<DashboardDateRange>('30d')
  const {
    activeWorkOrders,
    stats,
    categoryBreakdown,
    workOrderTrend,
    costTrend,
    workOrdersInRange,
  } = useDashboardDateRange(range)

  const exportSnapshot = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      range,
      stats,
      workOrders: workOrdersInRange,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `dashboard-${range}.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    toast.success(`Exported dashboard data for ${DASHBOARD_RANGE_LABELS[range].toLowerCase()}`)
  }

  return (
    <>
      <Navbar
        title="Dashboard"
        subtitle={DASHBOARD_RANGE_LABELS[range]}
        actions={
          <div className="hidden items-center gap-2 sm:flex">
            {(['7d', '30d', '90d'] as const).map((key) => (
              <Button
                key={key}
                variant={range === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRange(key)}
                aria-label={`Filter dashboard to ${DASHBOARD_RANGE_LABELS[key]}`}
                aria-pressed={range === key}
              >
                {key === '30d' ? (
                  <>
                    <Calendar className="mr-2 h-4 w-4" aria-hidden />
                    {DASHBOARD_RANGE_LABELS[key]}
                  </>
                ) : (
                  key.toUpperCase()
                )}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={exportSnapshot}
              aria-label={`Export dashboard snapshot for ${DASHBOARD_RANGE_LABELS[range]}`}
            >
              <Download className="h-4 w-4" aria-hidden />
              <span className="sr-only">Export dashboard</span>
            </Button>
          </div>
        }
      />
      <div className="space-y-6 p-4 lg:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Open Work Orders"
            value={stats.openWorkOrders}
            change={12}
            changeLabel="in selected range"
            icon="work-orders"
            variant="default"
          />
          <KPICard
            title="Overdue Tasks"
            value={stats.overdueWorkOrders}
            change={-8}
            changeLabel="in selected range"
            icon="overdue"
            variant="danger"
          />
          <KPICard
            title="PM Compliance"
            value={`${stats.pmCompliance}%`}
            change={5}
            changeLabel="in selected range"
            icon="compliance"
            variant="success"
          />
          <KPICard
            title="Spend in range"
            value={`$${stats.monthlySpend.toLocaleString()}`}
            change={-3}
            changeLabel="estimated & actual"
            icon="cost"
            variant="default"
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
              title="Active Work Orders"
              maxItems={8}
            />
          </div>
          <div className="space-y-4" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <CostTrendChart data={costTrend} />
        </div>
      </div>
    </>
  )
}
