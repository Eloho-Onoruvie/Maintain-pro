import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Plus, Search, MessageSquare, CheckCircle2, Clock, AlertTriangle,
  Star, ArrowRight, Filter, Camera, MapPin, ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuthStore } from '@/app/store'
import { useRoleAccess } from '@/hooks/useRoleAccess'
import { appendNotification } from '@/features/notifications/services/notificationEvents'
import { useMockDataStore } from '@/services/mockDataStore'
import { scopeServiceRequestsForUser } from '@/features/dashboard/utils/roleScope'
import { USER_ROLES } from '@/types/user.types'
import { formatRelativeDate, formatDate } from '@/utils/formatDate'
import { cn } from '@/utils/helpers'
import { EmptyState } from '@/components/feedback/EmptyState'
import { AppHeader } from '@/components/navigation/Navbar'
import { usePortalPath } from '@/hooks/usePortal'
import { ServiceRequestAdvancedFiltersDialog } from '@/features/service-requests/components/ServiceRequestAdvancedFiltersDialog'
import type { ServiceRequestAdvancedFilters } from '@/features/service-requests/components/ServiceRequestAdvancedFiltersDialog'
import { ViewServiceRequestDialog } from '@/features/service-requests/components/ViewServiceRequestDialog'
import { useActionConfirm } from '@/hooks/useActionConfirm'
import type { ServiceRequest, ServiceRequestStatus, WorkOrderPriority } from '@/types/common.types'

const SERVICE_CATEGORIES = ['Electrical','Plumbing','HVAC','Cleaning','Pest Control','Fire Safety','Elevators','Security','Gas','Sewage','General Repairs']

const statusConfig: Record<ServiceRequestStatus, { label: string; color: string; icon: React.ElementType }> = {
  submitted:   { label: 'Submitted',   color: 'bg-blue-400/10 text-blue-400 border-blue-400/20',       icon: MessageSquare },
  reviewed:    { label: 'Reviewed',    color: 'bg-purple-400/10 text-purple-400 border-purple-400/20', icon: Clock },
  approved:    { label: 'Approved',    color: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',       icon: CheckCircle2 },
  in_progress: { label: 'In Progress', color: 'bg-amber-400/10 text-amber-400 border-amber-400/20',    icon: Clock },
  resolved:    { label: 'Resolved',    color: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20', icon: CheckCircle2 },
  rejected:    { label: 'Rejected',    color: 'bg-red-400/10 text-red-400 border-red-400/20',          icon: AlertTriangle },
  reopened:    { label: 'Reopened',    color: 'bg-orange-400/10 text-orange-400 border-orange-400/20', icon: AlertTriangle },
}

const priorityColors: Record<WorkOrderPriority, string> = {
  critical: 'text-red-400 bg-red-400/10 border-red-400/20',
  high:     'text-orange-400 bg-orange-400/10 border-orange-400/20',
  medium:   'text-amber-400 bg-amber-400/10 border-amber-400/20',
  low:      'text-muted-foreground bg-muted border-border',
}

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <button key={i} onClick={() => onChange?.(i)} className={cn('transition-colors', onChange && 'cursor-pointer hover:text-amber-300')}>
          <Star className={cn('h-5 w-5', i <= value ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground')} />
        </button>
      ))}
    </div>
  )
}

export function ServiceRequests() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const serviceRequests = useMockDataStore((s) => s.serviceRequests)
  const locations = useMockDataStore((s) => s.locations)
  const addServiceRequest = useMockDataStore((s) => s.addServiceRequest)
  const updateServiceRequest = useMockDataStore((s) => s.updateServiceRequest)
  const { canConvertServiceRequest, canSubmitServiceRequest, canRateServiceRequest } = useRoleAccess()
  const newWorkOrderPath = usePortalPath('work-orders/new')
  const [showSubmit, setShowSubmit] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showRate, setShowRate] = useState<string | null>(null)
  const [viewRequest, setViewRequest] = useState<ServiceRequest | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [advancedFilters, setAdvancedFilters] = useState<ServiceRequestAdvancedFilters>({})
  const { requestConfirm, ActionConfirmDialog } = useActionConfirm()
  const advancedFilterCount = [
    advancedFilters.priority,
    advancedFilters.category,
    advancedFilters.locationId,
  ].filter(Boolean).length
  const [ratingValue, setRatingValue] = useState(0)
  const [ratingComment, setRatingComment] = useState('')
  const [form, setForm] = useState({
    title: '', category: '', description: '', priority: 'medium' as WorkOrderPriority,
    locationId: '', isGuest: false, guestContact: ''
  })

  const visibleRequests = useMemo(
    () => scopeServiceRequestsForUser(user, serviceRequests),
    [user, serviceRequests],
  )

  const filtered = useMemo(() => visibleRequests.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (advancedFilters.priority && r.priority !== advancedFilters.priority) return false
    if (advancedFilters.category && r.category !== advancedFilters.category) return false
    if (advancedFilters.locationId && r.locationId !== advancedFilters.locationId) return false
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.id.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [search, statusFilter, advancedFilters, visibleRequests])

  const stats = {
    total: visibleRequests.length,
    submitted: visibleRequests.filter(r => r.status === 'submitted').length,
    inProgress: visibleRequests.filter(r => r.status === 'in_progress').length,
    resolved: visibleRequests.filter(r => r.status === 'resolved').length,
    avgRating: (() => {
      const rated = visibleRequests.filter(r => r.rating)
      return rated.length ? (rated.reduce((s,r) => s + (r.rating || 0), 0) / rated.length).toFixed(1) : '—'
    })(),
  }

  const handleSubmit = () => {
    requestConfirm({
      title: 'Submit service request?',
      description: `Submit "${form.title || 'this request'}" for review by your facilities team.`,
      confirmLabel: 'Submit',
      onConfirm: () => {
        const loc = locations.find((l) => l.id === form.locationId)
        const id = `SR-${Date.now().toString().slice(-6)}`
        addServiceRequest({
          id,
          title: form.title,
          description: form.description,
          category: form.category,
          status: 'submitted',
          priority: form.priority,
          requesterId: user?.id ?? 'staff-1',
          requesterName: user ? `${user.firstName} ${user.lastName}` : 'Staff',
          requesterEmail: user?.email ?? '',
          locationId: form.locationId,
          locationName: loc?.name ?? 'Unknown',
          createdAt: new Date(),
        })
        appendNotification('user-1', USER_ROLES.FACILITY_MANAGER, {
          type: 'maintenance',
          title: 'New service request',
          message: `${form.title} (${id})`,
          actionUrl: 'service-requests',
        })
        toast.success(`Request submitted — confirmation #${id}`)
        setShowSubmit(false)
        setForm({ title: '', category: '', description: '', priority: 'medium', locationId: '', isGuest: false, guestContact: '' })
      },
    })
  }

  const handleConvert = (reqId: string, title: string) => {
    requestConfirm({
      title: 'Convert to work order?',
      description: `Create a work order from ${reqId} (${title})?`,
      confirmLabel: 'Convert',
      onConfirm: () => {
        toast.success(`Converting ${reqId} to work order`)
        navigate(`${newWorkOrderPath}?from=${encodeURIComponent(reqId)}&title=${encodeURIComponent(title)}`)
      },
    })
  }

  const handleRateSubmit = () => {
    requestConfirm({
      title: 'Submit rating?',
      description: 'Send your feedback for this resolved service request.',
      confirmLabel: 'Submit rating',
      onConfirm: () => {
        if (showRate) {
          updateServiceRequest(showRate, {
            rating: ratingValue,
            feedback: ratingComment,
          })
        }
        toast.success('Thank you for your feedback')
        setShowRate(null)
        setRatingValue(0)
        setRatingComment('')
      },
    })
  }

  return (
    <div className="flex flex-col bg-background">
      {ActionConfirmDialog}
      <ServiceRequestAdvancedFiltersDialog
        open={showFilters}
        onOpenChange={setShowFilters}
        filters={advancedFilters}
        onApply={setAdvancedFilters}
      />
      <AppHeader
        title="Service Requests"
        subtitle="Submit, track and manage maintenance requests"
        hideQuickCreate
        actions={
          canSubmitServiceRequest ? (
            <Button size="sm" className="gap-2" onClick={() => setShowSubmit(true)}>
              <Plus className="h-4 w-4" /> Submit Request
            </Button>
          ) : undefined
        }
      />

      <div className="space-y-6 page-body">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Total Requests',  value: stats.total,      color: 'text-foreground' },
            { label: 'Pending Review',  value: stats.submitted,  color: 'text-blue-400' },
            { label: 'In Progress',     value: stats.inProgress, color: 'text-amber-400' },
            { label: 'Resolved',        value: stats.resolved,   color: 'text-emerald-400' },
            { label: 'Avg Rating',      value: stats.avgRating,  color: 'text-amber-400' },
          ].map(s => (
            <Card key={s.label} className="bg-card border-border">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={cn('text-2xl font-semibold mt-1', s.color)}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by title or ID..." className="pl-9"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(statusConfig).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            className="relative"
            aria-label={
              advancedFilterCount > 0
                ? `Advanced filters, ${advancedFilterCount} active`
                : 'Open advanced service request filters'
            }
            onClick={() => setShowFilters(true)}
          >
            <Filter className="h-4 w-4" aria-hidden />
            {advancedFilterCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {advancedFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Requests */}
        <div className="space-y-3">
          {filtered.map(req => {
            const s = statusConfig[req.status]
            const Icon = s.icon
            const canConvert =
              canConvertServiceRequest &&
              (req.status === 'reviewed' || req.status === 'approved')
            const canRate = canRateServiceRequest && req.status === 'resolved' && !req.rating
            return (
              <Card key={req.id} className="bg-card border-border hover:border-border/80 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-medium text-sm text-foreground">{req.title}</span>
                        <Badge variant="outline" className={cn('text-xs gap-1', s.color)}>
                          <Icon className="h-3 w-3" />{s.label}
                        </Badge>
                        <Badge variant="outline" className={cn('text-xs capitalize', priorityColors[req.priority])}>{req.priority}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{req.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="font-mono">{req.id}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{req.locationName}</span>
                        <span>By {req.requesterName}</span>
                        <span>{formatRelativeDate(req.createdAt)}</span>
                        {req.rating && <span className="flex items-center gap-1 text-amber-400"><Star className="h-3 w-3 fill-amber-400" />{req.rating}/5</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs"
                        onClick={() => setViewRequest(req)}
                      >
                        View
                      </Button>
                      {canRate && (
                        <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs" onClick={() => setShowRate(req.id)}>
                          <Star className="h-3.5 w-3.5" />Rate
                        </Button>
                      )}
                      {canConvert && (
                        <Button
                          size="sm"
                          className="gap-1.5 h-8 text-xs"
                          onClick={() => handleConvert(req.id, req.title)}
                        >
                          <ArrowRight className="h-3.5 w-3.5" />Convert to WO
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {filtered.length === 0 && (
            <EmptyState
              icon={MessageSquare}
              title="No service requests"
              description={search || statusFilter !== 'all' ? 'Try adjusting your filters.' : undefined}
              actionLabel="Submit first request"
              onAction={() => setShowSubmit(true)}
            />
          )}
        </div>
      </div>

      {/* Submit Dialog */}
      <Dialog open={showSubmit} onOpenChange={setShowSubmit}>
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader><DialogTitle>Submit Service Request</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Issue Title *</Label>
              <Input placeholder="Brief description of the issue" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Category *</Label>
                <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{SERVICE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Priority</Label>
                <Select value={form.priority} onValueChange={v => setForm(p => ({ ...p, priority: v as WorkOrderPriority }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(['critical','high','medium','low'] as WorkOrderPriority[]).map(p => (
                      <SelectItem key={p} value={p} className="capitalize">{p.charAt(0).toUpperCase()+p.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Location *</Label>
              <Select value={form.locationId} onValueChange={v => setForm(p => ({ ...p, locationId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                <SelectContent>{locations.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description *</Label>
              <Textarea placeholder="Describe the issue in detail — what happened, when, and any relevant context..." rows={3}
                value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-dashed border-border p-3 text-muted-foreground transition-colors hover:bg-muted/30"
              onClick={() =>
                requestConfirm({
                  title: 'Add photo?',
                  description: 'Photo upload will be available when connected to the API.',
                  confirmLabel: 'OK',
                  singleAction: true,
                  onConfirm: () => {},
                })
              }
            >
              <Camera className="h-5 w-5" />
              <span className="text-sm">Attach photos (optional)</span>
            </button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmit(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!form.title || !form.category || !form.locationId || !form.description}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rate Dialog */}
      <Dialog open={!!showRate} onOpenChange={() => { setShowRate(null); setRatingValue(0); setRatingComment('') }}>
        <DialogContent className="max-w-sm bg-card border-border">
          <DialogHeader><DialogTitle>Rate Service Quality</DialogTitle></DialogHeader>
          <div className="py-4 space-y-4 text-center">
            <StarRating value={ratingValue} onChange={setRatingValue} />
            <p className="text-sm text-muted-foreground">{['','Poor','Fair','Good','Very Good','Excellent'][ratingValue] || 'Select a rating'}</p>
            <Textarea placeholder="Optional feedback..." rows={3} value={ratingComment} onChange={e => setRatingComment(e.target.value)} />
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="text-destructive"
              onClick={() => {
                if (showRate) {
                  updateServiceRequest(showRate, { status: 'reopened' })
                  toast.success('Request reopened for review')
                }
                setShowRate(null)
              }}
            >
              Reopen — not satisfied
            </Button>
            <Button variant="outline" onClick={() => setShowRate(null)}>Skip</Button>
            <Button onClick={handleRateSubmit} disabled={!ratingValue}>Submit Rating</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ViewServiceRequestDialog
        request={viewRequest}
        open={!!viewRequest}
        onOpenChange={(open) => !open && setViewRequest(null)}
      />
    </div>
  )
}
