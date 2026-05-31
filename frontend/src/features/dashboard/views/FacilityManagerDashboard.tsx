import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
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
import { useMockDataStore } from '@/services/mockDataStore'
import {
  DASHBOARD_RANGE_LABELS,
  type DashboardDateRange,
} from '@/features/dashboard/utils/dashboardDateRange'
import { Button } from '@/components/ui/button'
import { useDownloadConfirm } from '@/hooks/useDownloadConfirm'
import { downloadJson } from '@/utils/downloadFile'
import { usePortalPath } from '@/hooks/usePortal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function FacilityManagerDashboard() {
  const workOrders = useMockDataStore((s) => s.workOrders)
  const locations = useMockDataStore((s) => s.locations)
  const workOrdersPath = usePortalPath('work-orders')
  const [range, setRange] = useState<DashboardDateRange>('30d')
  const [locationFilter, setLocationFilter] = useState<string>('all')
  const { requestDownload, DownloadConfirmDialog } = useDownloadConfirm()
  const {
    activeWorkOrders,
    stats,
    categoryBreakdown,
    workOrderTrend,
    costTrend,
    workOrdersInRange,
  } = useDashboardDateRange(range, workOrders)

  const scopedWorkOrders = useMemo(() => {
    if (locationFilter === 'all') return workOrders
    return workOrders.filter((wo) => wo.locationId === locationFilter)
  }, [locationFilter, workOrders])

  const scoped = useDashboardDateRange(range, scopedWorkOrders)
  const displayStats = locationFilter === 'all' ? stats : scoped.stats
  const displayActive = locationFilter === 'all' ? activeWorkOrders : scoped.activeWorkOrders
  const displayCategory = locationFilter === 'all' ? categoryBreakdown : scoped.categoryBreakdown
  const displayTrend = locationFilter === 'all' ? workOrderTrend : scoped.workOrderTrend
  const displayCost = locationFilter === 'all' ? costTrend : scoped.costTrend

  const exportSnapshot = () => {
    requestDownload({
      title: 'Export dashboard snapshot?',
      description: `Download dashboard stats and work orders for ${DASHBOARD_RANGE_LABELS[range].toLowerCase()} as a JSON file.`,
      confirmLabel: 'Download export',
      onDownload: () => {
        downloadJson(`dashboard-${range}.json`, {
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
      <div className="page-body flex flex-wrap gap-2 pb-0 sm:hidden">
        {(['7d', '30d', '90d'] as const).map((key) => (
          <Button
            key={key}
            variant={range === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRange(key)}
            aria-pressed={range === key}
          >
            {DASHBOARD_RANGE_LABELS[key]}
          </Button>
        ))}
        <Button variant="outline" size="sm" onClick={exportSnapshot}>
          <Download className="mr-2 h-4 w-4" aria-hidden />
          Export
        </Button>
      </div>
      <div className="page-body space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" key={`${range}-${locationFilter}`}>
          <Link to={workOrdersPath} className="block">
            <KPICard
              title="Open Work Orders"
              value={displayStats.openWorkOrders}
              changeLabel="in selected range"
              icon="work-orders"
              variant="default"
            />
          </Link>
          <Link to={workOrdersPath} className="block">
            <KPICard
              title="Overdue"
              value={displayStats.overdueWorkOrders}
              changeLabel="past due date"
              icon="overdue"
              variant="danger"
            />
          </Link>
          <Link to={workOrdersPath} className="block">
            <KPICard
              title="Due Today"
              value={displayStats.dueToday}
              changeLabel="scheduled today"
              icon="clock"
              variant="warning"
            />
          </Link>
          <Link to={workOrdersPath} className="block">
            <KPICard
              title="Completed This Week"
              value={displayStats.completedThisWeek}
              changeLabel="last 7 days"
              icon="completed"
              variant="success"
            />
          </Link>
          <KPICard
            title="PM Compliance"
            value={`${displayStats.pmCompliance}%`}
            changeLabel="in selected range"
            icon="compliance"
            variant="success"
          />
          <KPICard
            title="Spend in range"
            value={`$${displayStats.monthlySpend.toLocaleString()}`}
            changeLabel="estimated & actual"
            icon="cost"
            variant="default"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <WorkOrderTrendChart data={displayTrend} />
          </div>
          <CategoryBreakdownChart data={displayCategory} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <WorkOrderList
              workOrders={displayActive}
              title="Active Work Orders"
              maxItems={8}
            />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <CostTrendChart data={displayCost} />
        </div>
      </div>
    </>
  )
}
