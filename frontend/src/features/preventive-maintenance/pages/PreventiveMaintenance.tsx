import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { EmptyState } from '@/components/feedback/EmptyState'
import { SkeletonTable } from '@/components/feedback/Skeletons'
import { useRoleAccess } from '@/hooks/useRoleAccess'
import { AppHeader } from '@/components/navigation/Navbar'
import { toast } from 'sonner'
import { preventiveMaintenanceService, type PreventiveMaintenanceRecord } from '../services/preventiveMaintenance.service'
import { cn } from '@/utils/helpers'
import { usePortalPath } from '@/hooks/usePortal'
import { preventiveMaintenanceApi } from '../api/preventiveMaintenance.api'
import type { PMOccurrenceRecord } from '../types/preventiveMaintenance.types'
import { PageIntro } from '@/components/layout/PageIntro'

export function PreventiveMaintenance() {
  const { role } = useRoleAccess()
  const canManagePM = role === 'admin' || role === 'facility_manager'
  const navigate = useNavigate()
  const pmPath = usePortalPath('preventive-maintenance')
  const [viewMode, setViewMode] = useState<'plans' | 'occurrences' | 'calendar'>('plans')
  const [plans, setPlans] = useState<PreventiveMaintenanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)

  // Filter states for Plans
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [form, setForm] = useState({ title: '', facilityId: '', maintenanceType: 'preventive', frequency: 'monthly', interval: 1 })

  const fetchPlans = () => {
    setLoading(true)
    setApiError(null)
    preventiveMaintenanceService.list()
      .then((result: unknown) => {
        // Backend returns paginated response envelope { data: [...], pagination: {...} } or raw array
        const list = Array.isArray(result)
          ? result
          : (result as { data?: PreventiveMaintenanceRecord[] })?.data ?? []
        setPlans(Array.isArray(list) ? list as PreventiveMaintenanceRecord[] : [])
      })
      .catch((err: { message?: string }) => {
        setApiError(err.message || 'Unable to load preventive maintenance plans from backend API')
        setPlans([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPlans() }, [])

  const filteredPlans = useMemo(() => {
    if (!Array.isArray(plans)) return []
    return plans.filter((plan) => {
      const matchSearch = plan.title.toLowerCase().includes(search.toLowerCase())
      const matchStat = statusFilter === 'all' || plan.status.toLowerCase() === statusFilter.toLowerCase()
      return matchSearch && matchStat
    })
  }, [plans, search, statusFilter])


  return (
    <div className="min-h-full bg-background text-foreground">
      <AppHeader title={viewMode === 'calendar' ? 'PM Calendar' : 'Preventive Maintenance'} hideQuickCreate />

      {/* Page Header */}
      <div className="border-b border-border bg-card px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <PageIntro title={viewMode === 'calendar' ? 'PM Calendar' : 'Preventive Maintenance'} description="Schedule recurring checklists, manage compliance audits, and prevent equipment downtime." />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {canManagePM && (
              <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create PM Plan
              </Button>
            )}
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center rounded-lg border border-border bg-muted/40 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('plans')}
              className={cn(
                'rounded-md px-4 py-1.5 transition-colors',
                viewMode === 'plans' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Plans
            </button>
            <button
              type="button"
              onClick={() => setViewMode('occurrences')}
              className={cn(
                'rounded-md px-4 py-1.5 transition-colors',
                viewMode === 'occurrences' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Occurrences
            </button>
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={cn(
                'rounded-md px-4 py-1.5 transition-colors',
                viewMode === 'calendar' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Calendar
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        {viewMode === 'plans' && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search PM plans..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status: All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={fetchPlans} className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="p-4 sm:p-6 lg:p-8">
        {viewMode === 'plans' ? (
          loading ? (
            <div role="status" aria-live="polite">
              <span className="sr-only">Loading preventive maintenance plans…</span>
              <SkeletonTable rows={5} columns={6} />
            </div>
          ) : apiError ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center text-destructive space-y-3">
              <AlertCircle className="h-10 w-10 text-destructive opacity-80" />
              <div>
                <h3 className="font-semibold text-lg">Backend API Notice</h3>
                <p className="text-sm text-destructive/80 mt-1 max-w-md">{apiError}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Endpoint <code className="bg-muted px-1 py-0.5 rounded font-mono">GET /api/v1/preventive-maintenance</code> returned an error.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={fetchPlans} className="mt-2">
                Retry Connection
              </Button>
            </div>
          ) : filteredPlans.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No PM plans found"
              description={search ? 'Try adjusting your search query.' : 'No preventive maintenance plans have been created yet.'}
              actionLabel={canManagePM ? 'Create PM Plan' : undefined}
              onAction={canManagePM ? () => setShowCreateModal(true) : undefined}
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-muted/40 text-xs font-bold uppercase text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3.5">Plan Title</th>
                      <th className="px-5 py-3.5">Type</th>
                      <th className="px-5 py-3.5">Next Due Date</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredPlans.map((plan) => (
                      <tr key={plan._id} className="hover:bg-accent/40 transition-colors">
                        <td className="px-5 py-4 font-semibold text-foreground">{plan.title}</td>
                        <td className="px-5 py-4 text-muted-foreground capitalize">{plan.maintenanceType}</td>
                        <td className="px-5 py-4 text-muted-foreground">{plan.nextDueDate ? new Date(plan.nextDueDate).toLocaleDateString() : '—'}</td>
                        <td className="px-5 py-4">
                          <StatusBadge status={plan.status} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`${pmPath}/${plan._id}`)}>
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : viewMode === 'calendar' ? (
          <PMCalendarView />
        ) : (
          <PMOccurrencesView />
        )}
      </main>


      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create PM Plan</DialogTitle>
            <p className="text-sm text-muted-foreground">Schedule recurring preventive maintenance for a facility asset or location.</p>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!form.title) {
                toast.error('Title is required.')
                return
              }
              preventiveMaintenanceService
                .create({
                  title: form.title,
                  facilityId: form.facilityId || 'fac-01',
                  maintenanceType: form.maintenanceType,
                  schedule: { frequency: form.frequency, interval: form.interval },
                })
                .then(() => {
                  toast.success('PM Plan created')
                  setShowCreateModal(false)
                  fetchPlans()
                })
                .catch(() => toast.error('Failed to create PM plan'))
            }}
            className="space-y-4 py-2"
          >
            <div className="space-y-2">
              <Label htmlFor="pm-title">Plan Title *</Label>
              <Input
                id="pm-title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Monthly Chiller Service"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pm-type">Maintenance Type</Label>
              <Select value={form.maintenanceType} onValueChange={(v) => setForm((p) => ({ ...p, maintenanceType: v }))}>
                <SelectTrigger id="pm-type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="preventive">Preventive</SelectItem>
                  <SelectItem value="predictive">Predictive</SelectItem>
                  <SelectItem value="corrective">Corrective</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="pm-frequency">Frequency</Label>
                <Select value={form.frequency} onValueChange={(v) => setForm((p) => ({ ...p, frequency: v }))}>
                  <SelectTrigger id="pm-frequency"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem><SelectItem value="weekly">Weekly</SelectItem><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="quarterly">Quarterly</SelectItem><SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pm-interval">Every</Label>
                <Input id="pm-interval" type="number" min={1} value={form.interval} onChange={(e) => setForm((p) => ({ ...p, interval: Math.max(1, Number(e.target.value)) }))} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Plan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PMCalendarView() {
  type CalendarItem = { id?: string; _id?: string; title?: string; plannedDate?: string; occurrenceDate?: string; facilityName?: string; locationName?: string }
  const [schedule, setSchedule] = useState<CalendarItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    preventiveMaintenanceService
      .calendar()
      .then((res) => setSchedule((res ?? []) as CalendarItem[]))
      .catch(() => setSchedule([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <SkeletonTable rows={4} columns={4} />

  const now = new Date()
  const monday = new Date(now)
  const day = monday.getDay()
  monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1))
  monday.setHours(0, 0, 0, 0)
  const endOfThisWeek = new Date(monday); endOfThisWeek.setDate(monday.getDate() + 7)
  const endOfNextWeek = new Date(monday); endOfNextWeek.setDate(monday.getDate() + 14)
  const getDate = (item: CalendarItem) => new Date(item.occurrenceDate ?? item.plannedDate ?? '')
  const thisWeek = schedule.filter((item) => getDate(item) <= endOfThisWeek)
  const nextWeek = schedule.filter((item) => getDate(item) > endOfThisWeek && getDate(item) <= endOfNextWeek)
  const laterThisMonth = schedule.filter((item) => getDate(item) > endOfNextWeek)
  const groups = [['This Week', thisWeek], ['Next Week', nextWeek], ['Later This Month', laterThisMonth]] as const

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
        <h3 className="font-bold text-base text-foreground">Scheduled Maintenance Occurrences</h3>
        <span className="text-xs font-semibold text-muted-foreground">{schedule.length} events scheduled</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {groups.map(([period, items]) => (
          <div key={period} className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">{period}</h4>
            <div className="space-y-2">
              {items.length === 0 ? <p className="text-xs text-muted-foreground">No maintenance scheduled</p> : items.map((item) => <div key={item.id ?? item._id ?? `${item.title}-${item.plannedDate}`} className="rounded-lg border border-border bg-muted/30 p-3 space-y-1"><p className="text-xs font-bold text-foreground">{item.title ?? 'Scheduled maintenance'}</p><p className="text-[11px] text-muted-foreground">Due: {Number.isNaN(getDate(item).getTime()) ? 'Date not available' : getDate(item).toLocaleDateString()} {item.facilityName || item.locationName ? `• ${item.facilityName ?? item.locationName}` : ''}</p></div>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PMOccurrencesView() {
  const [occurrences, setOccurrences] = useState<PMOccurrenceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void preventiveMaintenanceApi.occurrences({ page: 1, limit: 50 })
      .then((result) => setOccurrences(result.data ?? []))
      .catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load PM occurrences'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">Loading occurrences…</div>
  if (error) return <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">{error}</div>
  if (occurrences.length === 0) return <EmptyState icon={AlertCircle} title="No occurrence history" description="No preventive-maintenance occurrences have been generated for this organization." />
  return <div className="overflow-hidden rounded-xl border border-border bg-card"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3">Scheduled</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Approval</th><th className="px-4 py-3">Work order</th></tr></thead><tbody className="divide-y divide-border">{occurrences.map((occurrence) => <tr key={occurrence.id} className="hover:bg-muted/40"><td className="px-4 py-3">{new Date(occurrence.scheduledAt).toLocaleDateString()}</td><td className="px-4 py-3"><StatusBadge status={occurrence.status} /></td><td className="px-4 py-3"><StatusBadge status={occurrence.approvalState} /></td><td className="px-4 py-3 text-muted-foreground">{occurrence.workOrderId || '—'}</td></tr>)}</tbody></table></div></div>
}

export default PreventiveMaintenance
