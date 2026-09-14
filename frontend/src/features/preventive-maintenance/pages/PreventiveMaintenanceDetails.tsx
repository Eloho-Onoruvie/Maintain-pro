import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, ClipboardList } from 'lucide-react'
import { AppHeader } from '@/components/navigation/Navbar'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/badge'
import { PageLoader } from '@/components/feedback/PageLoader'
import { PageError } from '@/components/feedback/PageError'
import { EmptyState } from '@/components/feedback/EmptyState'
import { preventiveMaintenanceService, type PreventiveMaintenanceRecord } from '../services/preventiveMaintenance.service'
import { preventiveMaintenanceApi } from '../api/preventiveMaintenance.api'
import type { PMOccurrenceRecord } from '../types/preventiveMaintenance.types'
import { SkipPMScheduleDialog } from '../components/SkipPMScheduleDialog'
import { apiClient } from '@/api/client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function PreventiveMaintenanceDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [plan, setPlan] = useState<PreventiveMaintenanceRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [occurrences, setOccurrences] = useState<PMOccurrenceRecord[]>([])
  const [occurrencesLoading, setOccurrencesLoading] = useState(true)
  const [occurrencesError, setOccurrencesError] = useState<Error | null>(null)
  const [skipOpen, setSkipOpen] = useState(false)
  const [technicians, setTechnicians] = useState<Array<{ id: string; name: string }>>([])
  const [assigningOccurrence, setAssigningOccurrence] = useState<string | null>(null)

  const loadPlan = async () => {
    if (!id) return
    setLoading(true); setError(null)
    try {
      setPlan(await preventiveMaintenanceService.get(id))
    }
    catch (cause) { setError(cause instanceof Error ? cause : new Error('Unable to load PM plan')) }
    finally { setLoading(false) }
  }

  useEffect(() => { void loadPlan() }, [id])

  useEffect(() => {
    if (!id) return
    setOccurrencesLoading(true); setOccurrencesError(null)
    void preventiveMaintenanceApi.planOccurrences(id, { page: 1, limit: 50 })
      .then((result) => setOccurrences(result.data ?? []))
      .catch((cause) => setOccurrencesError(cause instanceof Error ? cause : new Error('Unable to load PM occurrences')))
      .finally(() => setOccurrencesLoading(false))
  }, [id])

  useEffect(() => {
    if (!id) return
    void apiClient.get<Array<{ id: string; firstName?: string; lastName?: string; name?: string; role: string }>>('/users')
      .then((users) => setTechnicians(users.filter((user) => user.role === 'technician').map((user) => ({ id: user.id, name: user.name || `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.id }))))
      .catch(() => setTechnicians([]))
  }, [id])

  if (loading) return <PageLoader label="Loading preventive maintenance plan..." />
  if (error) return <PageError message={error.message} onRetry={() => void loadPlan()} />
  if (!plan) return <EmptyState icon={ClipboardList} title="PM plan not found" description="This preventive maintenance plan may have been archived or removed." />

  return <div className="min-h-full bg-background text-foreground"><AppHeader title="Preventive Maintenance" hideQuickCreate /><main className="p-4 sm:p-6 lg:p-8 space-y-6"><Button variant="outline" onClick={() => navigate(-1)} className="gap-2"><ArrowLeft className="h-4 w-4" />Back</Button><section className="rounded-xl border border-border bg-card p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-2xl font-bold">{plan.title}</h2><p className="mt-1 text-sm text-muted-foreground">{plan.maintenanceType} maintenance plan</p></div><div className="flex items-center gap-3"><StatusBadge status={plan.status} /><Button variant="outline" size="sm" onClick={() => setSkipOpen(true)}>Skip plan</Button></div></div><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><div><p className="text-xs uppercase text-muted-foreground">Next due</p><p className="mt-1 font-semibold">{plan.nextDueDate ? new Date(plan.nextDueDate).toLocaleDateString() : '—'}</p></div><div><p className="text-xs uppercase text-muted-foreground">Planned date</p><p className="mt-1 font-semibold">{plan.plannedDate ? new Date(plan.plannedDate).toLocaleDateString() : '—'}</p></div><div><p className="text-xs uppercase text-muted-foreground">Priority</p><p className="mt-1 font-semibold capitalize">{plan.priority || '—'}</p></div><div><p className="text-xs uppercase text-muted-foreground">Facility</p><p className="mt-1 font-semibold">{plan.facilityId || '—'}</p></div></div></section>{plan.description && <section className="rounded-xl border border-border bg-card p-6"><h2 className="font-semibold">Plan description</h2><p className="mt-2 text-sm text-muted-foreground">{plan.description}</p></section>}<section className="rounded-xl border border-border bg-card p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Occurrences</h2><p className="mt-1 text-sm text-muted-foreground">Scheduled execution history for this plan.</p></div></div>{occurrencesLoading ? <p className="mt-4 text-sm text-muted-foreground">Loading occurrences…</p> : occurrencesError ? <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"><span>{occurrencesError.message}</span><Button size="sm" variant="outline" onClick={() => { setOccurrencesError(null); setOccurrencesLoading(true); void preventiveMaintenanceApi.planOccurrences(id!, { page: 1, limit: 50 }).then((result) => setOccurrences(result.data ?? [])).catch((cause) => setOccurrencesError(cause instanceof Error ? cause : new Error('Unable to load PM occurrences'))).finally(() => setOccurrencesLoading(false)) }}>Retry</Button></div> : occurrences.length === 0 ? <p className="mt-4 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No occurrences have been generated for this plan.</p> : <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-border text-xs uppercase text-muted-foreground"><tr><th className="px-3 py-2">Scheduled</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Approval</th><th className="px-3 py-2">Assigned technician</th><th className="px-3 py-2">Work order</th></tr></thead><tbody className="divide-y divide-border">{occurrences.map((occurrence) => <tr key={occurrence.id}><td className="px-3 py-3">{new Date(occurrence.scheduledAt).toLocaleDateString()}</td><td className="px-3 py-3"><StatusBadge status={occurrence.status} /></td><td className="px-3 py-3"><StatusBadge status={occurrence.approvalState} /></td><td className="px-3 py-3"><Select value={occurrence.assignment?.targetId ?? 'unassigned'} disabled={assigningOccurrence === occurrence.id || technicians.length === 0} onValueChange={(targetId) => { if (targetId === 'unassigned') return; setAssigningOccurrence(occurrence.id); void preventiveMaintenanceApi.assignOccurrence(occurrence.id, { targetType: 'user', targetId }).then((updated) => setOccurrences((items) => items.map((item) => item.id === occurrence.id ? updated : item))).catch(() => toast.error('Unable to assign technician')).finally(() => setAssigningOccurrence(null)) }}><SelectTrigger className="w-44"><SelectValue placeholder={technicians.length ? 'Assign technician' : 'No technicians'} /></SelectTrigger><SelectContent><SelectItem value="unassigned">Unassigned</SelectItem>{technicians.map((technician) => <SelectItem key={technician.id} value={technician.id}>{technician.name}</SelectItem>)}</SelectContent></Select></td><td className="px-3 py-3 text-muted-foreground">{occurrence.workOrderId || '—'}</td></tr>)}</tbody></table></div>}</section></main><SkipPMScheduleDialog schedule={{ id: plan._id, title: plan.title }} open={skipOpen} onOpenChange={setSkipOpen} onCompleted={() => void loadPlan()} /></div>
}

export default PreventiveMaintenanceDetails
