import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'

import { AppHeader as Navbar } from '@/components/navigation/Navbar'
import { DashboardDateRangeControls } from '@/features/dashboard/components/DashboardDateRangeControls'
import { KPICard } from '@/features/dashboard/components/StatCard'
import { useMockDataStore } from '@/services/mockDataStore'
import {
  computeStaffDashboardStats,
  filterServiceRequestsByRange,
  getServiceRequestReferenceDate,
  roleDashboardTitle,
  scopeServiceRequestsForUser,
} from '@/features/dashboard/utils/roleScope'
import {
  DASHBOARD_RANGE_LABELS,
  type DashboardDateRange,
} from '@/features/dashboard/utils/dashboardDateRange'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/app/store'
import { usePortalPath } from '@/hooks/usePortal'
import { useDownloadConfirm } from '@/hooks/useDownloadConfirm'
import { downloadJson } from '@/utils/downloadFile'
import { cn } from '@/utils/helpers'
import { USER_ROLES } from '@/types/user.types'

export function StaffDashboard() {
  const [range, setRange] = useState<DashboardDateRange>('30d')
  const user = useAuthStore((state) => state.user)
  const serviceRequests = useMockDataStore((s) => s.serviceRequests)
  const serviceRequestsPath = usePortalPath('service-requests')
  const { requestDownload, DownloadConfirmDialog } = useDownloadConfirm()

  const myRequests = useMemo(
    () => scopeServiceRequestsForUser(user, serviceRequests),
    [user, serviceRequests],
  )

  const referenceDate = useMemo(
    () => getServiceRequestReferenceDate(myRequests),
    [myRequests],
  )

  const requestsInRange = useMemo(
    () => filterServiceRequestsByRange(myRequests, range, referenceDate),
    [myRequests, range, referenceDate],
  )

  const staffStats = useMemo(
    () => computeStaffDashboardStats(requestsInRange),
    [requestsInRange],
  )

  const exportSnapshot = () => {
    requestDownload({
      title: 'Export dashboard snapshot?',
      description: `Download your service request stats for ${DASHBOARD_RANGE_LABELS[range].toLowerCase()} as a JSON file.`,
      confirmLabel: 'Download export',
      onDownload: () => {
        downloadJson(`staff-dashboard-${range}.json`, {
          exportedAt: new Date().toISOString(),
          range,
          stats: staffStats,
          requests: requestsInRange,
        })
        toast.success(`Exported dashboard data for ${DASHBOARD_RANGE_LABELS[range].toLowerCase()}`)
      },
    })
  }

  return (
    <>
      {DownloadConfirmDialog}
      <Navbar
        title={roleDashboardTitle(USER_ROLES.STAFF)}
        subtitle={DASHBOARD_RANGE_LABELS[range]}
        actions={
          <>
            <DashboardDateRangeControls
              layout="desktop"
              range={range}
              onRangeChange={setRange}
              onExport={exportSnapshot}
            />
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to={serviceRequestsPath}>
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Link>
            </Button>
          </>
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
          <KPICard title="My Requests" value={staffStats.total} icon="work-orders" />
          <KPICard
            title="Submitted"
            value={staffStats.submitted}
            icon="clock"
            variant="warning"
          />
          <KPICard
            title="In Progress"
            value={staffStats.inProgress}
            icon="compliance"
          />
          <KPICard
            title="Resolved"
            value={staffStats.resolved}
            icon="completed"
            variant="success"
          />
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Requests</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to={serviceRequestsPath}>View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {requestsInRange.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                No service requests in this date range.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {requestsInRange.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{request.title}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" /> {request.category}
                        </span>
                        <span>
                          Submitted {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] capitalize',
                        request.status === 'resolved'
                          ? 'border-emerald-400/20 text-emerald-400'
                          : request.status === 'in_progress'
                            ? 'border-blue-400/20 text-blue-400'
                            : 'border-amber-400/20 text-amber-400',
                      )}
                    >
                      {request.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
