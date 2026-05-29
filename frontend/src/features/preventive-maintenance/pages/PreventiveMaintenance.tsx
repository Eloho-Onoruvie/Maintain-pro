import { useState, useMemo } from 'react'
import {
  Calendar, Plus, Clock, CheckCircle2, AlertTriangle, ChevronLeft, ChevronRight,
  Play, Pause, SkipForward, MoreVertical, Filter, Search, Repeat, Shield
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
import { Switch } from '@/components/ui/switch'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { mockPMs, mockAssets, mockLocations, mockUsers } from '@/features/dashboard/services/dashboard.service'
import { formatDate, getDaysUntil } from '@/utils/formatDate'
import { cn } from '@/utils/helpers'
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { AppHeader } from '@/components/navigation/Navbar'
import { EditPMScheduleDialog } from '@/features/preventive-maintenance/components/EditPMScheduleDialog'
import { SkipPMScheduleDialog } from '@/features/preventive-maintenance/components/SkipPMScheduleDialog'
import type { PMFrequency, PreventiveMaintenance as PMSchedule } from '@/types/common.types'
import { toast } from 'sonner'

const freqColors: Record<PMFrequency | string, string> = {
  daily:     'bg-red-400/10 text-red-400 border-red-400/20',
  weekly:    'bg-orange-400/10 text-orange-400 border-orange-400/20',
  monthly:   'bg-blue-400/10 text-blue-400 border-blue-400/20',
  quarterly: 'bg-purple-400/10 text-purple-400 border-purple-400/20',
  yearly:    'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  custom:    'bg-muted text-muted-foreground border-border',
}

function CalendarView({ schedules }: { schedules: typeof mockPMs }) {
  const today = new Date()
  const [current, setCurrent] = useState(today)

  const year = current.getFullYear()
  const month = current.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cellEvents = useMemo(() => {
    const map: Record<number, typeof mockPMs> = {}
    schedules.forEach(s => {
      const d = new Date(s.nextDue)
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate()
        if (!map[day]) map[day] = []
        map[day].push(s)
      }
    })
    return map
  }, [schedules, year, month])

  const monthName = current.toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="page-header-row">
          <CardTitle className="text-sm font-medium">{monthName}</CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1))}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-3 text-xs" onClick={() => setCurrent(new Date())}>Today</Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1))}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto p-3">
        <div className="grid min-w-[320px] grid-cols-7 gap-px sm:min-w-0">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="text-center text-xs text-muted-foreground font-medium py-2">{d}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="h-20" />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
            const events = cellEvents[day] || []
            return (
              <div key={day} className={cn('h-20 p-1.5 rounded border border-border/50 hover:bg-muted/30 transition-colors', isToday && 'border-primary/50 bg-primary/5')}>
                <span className={cn('text-xs font-medium', isToday ? 'text-primary' : 'text-foreground')}>{day}</span>
                <div className="mt-1 space-y-0.5">
                  {events.slice(0, 2).map(e => (
                    <div key={e.id} className={cn('text-[10px] px-1 rounded truncate', freqColors[e.frequency])}>
                      {e.title.substring(0, 16)}…
                    </div>
                  ))}
                  {events.length > 2 && <div className="text-[10px] text-muted-foreground">+{events.length - 2} more</div>}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export function PreventiveMaintenance() {
  const [showCreate, setShowCreate] = useState(false)
  const [editSchedule, setEditSchedule] = useState<PMSchedule | null>(null)
  const [skipSchedule, setSkipSchedule] = useState<PMSchedule | null>(null)
  const [deleteSchedule, setDeleteSchedule] = useState<PMSchedule | null>(null)
  const [toggleSchedule, setToggleSchedule] = useState<PMSchedule | null>(null)
  const [generateWoSchedule, setGenerateWoSchedule] = useState<PMSchedule | null>(null)
  const [search, setSearch] = useState('')
  const [filterFreq, setFilterFreq] = useState('all')
  const [form, setForm] = useState({
    title: '', description: '', assetId: '', locationId: '', frequency: 'monthly' as PMFrequency,
    assigneeId: '', vendorId: '', estimatedDuration: '', estimatedCost: '',
    isComplianceRequired: false, regulatoryRef: '',
    checklist: [{ id: '1', text: '', isCompleted: false }]
  })

  const filtered = mockPMs.filter(pm => {
    if (search && !pm.title.toLowerCase().includes(search.toLowerCase())) return false
    if (filterFreq !== 'all' && pm.frequency !== filterFreq) return false
    return true
  })

  const stats = {
    total: mockPMs.length,
    dueSoon: mockPMs.filter(p => getDaysUntil(p.nextDue) <= 7 && getDaysUntil(p.nextDue) >= 0).length,
    overdue: mockPMs.filter(p => getDaysUntil(p.nextDue) < 0).length,
    compliance: Math.round((mockPMs.filter(p => p.lastCompleted).length / mockPMs.length) * 100),
    complianceRequired: mockPMs.filter(p => p.isComplianceRequired).length,
  }

  const addChecklistItem = () => setForm(f => ({ ...f, checklist: [...f.checklist, { id: Date.now().toString(), text: '', isCompleted: false }] }))
  const updateChecklistItem = (id: string, text: string) => setForm(f => ({ ...f, checklist: f.checklist.map(c => c.id === id ? { ...c, text } : c) }))
  const removeChecklistItem = (id: string) => setForm(f => ({ ...f, checklist: f.checklist.filter(c => c.id !== id) }))

  return (
    <div className="flex flex-col bg-background">
      <EditPMScheduleDialog schedule={editSchedule} open={!!editSchedule} onOpenChange={(o) => !o && setEditSchedule(null)} />
      <SkipPMScheduleDialog schedule={skipSchedule} open={!!skipSchedule} onOpenChange={(o) => !o && setSkipSchedule(null)} />
      <ConfirmDialog
        open={!!deleteSchedule}
        onOpenChange={(o) => !o && setDeleteSchedule(null)}
        title="Delete schedule?"
        description={deleteSchedule ? `Remove "${deleteSchedule.title}" from preventive maintenance?` : ''}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteSchedule) toast.success(`Delete request submitted for ${deleteSchedule.title}`)
          setDeleteSchedule(null)
        }}
      />
      <ConfirmDialog
        open={!!toggleSchedule}
        onOpenChange={(o) => !o && setToggleSchedule(null)}
        title={toggleSchedule?.isActive ? 'Pause schedule?' : 'Resume schedule?'}
        description={toggleSchedule ? toggleSchedule.title : ''}
        confirmLabel={toggleSchedule?.isActive ? 'Pause' : 'Resume'}
        onConfirm={() => {
          if (toggleSchedule) {
            toast.success(`${toggleSchedule.isActive ? 'Paused' : 'Resumed'} ${toggleSchedule.title}`)
          }
          setToggleSchedule(null)
        }}
      />
      <ConfirmDialog
        open={!!generateWoSchedule}
        onOpenChange={(o) => !o && setGenerateWoSchedule(null)}
        title="Generate work order?"
        description={generateWoSchedule ? `Create a work order from "${generateWoSchedule.title}"?` : ''}
        confirmLabel="Generate"
        onConfirm={() => {
          if (generateWoSchedule) toast.success(`Generated work order from ${generateWoSchedule.title}`)
          setGenerateWoSchedule(null)
        }}
      />
      <AppHeader
        title="Preventive Maintenance"
        subtitle="Schedules, compliance tracking & auto work order generation"
        hideQuickCreate
        actions={
          <Button size="sm" className="gap-2" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> Create Schedule
          </Button>
        }
      />

      <div className="space-y-6 page-body">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Total Schedules', value: stats.total, color: 'text-foreground', icon: Repeat },
            { label: 'Due This Week', value: stats.dueSoon, color: 'text-amber-400', icon: Clock },
            { label: 'Overdue', value: stats.overdue, color: 'text-red-400', icon: AlertTriangle },
            { label: 'PM Compliance', value: `${stats.compliance}%`, color: stats.compliance >= 90 ? 'text-emerald-400' : stats.compliance >= 70 ? 'text-amber-400' : 'text-red-400', icon: CheckCircle2 },
            { label: 'Compliance Req.', value: stats.complianceRequired, color: 'text-purple-400', icon: Shield },
          ].map(s => (
            <Card key={s.label} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className={cn('text-2xl font-semibold mt-1', s.color)}>{s.value}</p>
                  </div>
                  <s.icon className={cn('h-5 w-5', s.color)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="list">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-muted border border-border">
              <TabsTrigger value="list">Schedule List</TabsTrigger>
              <TabsTrigger value="calendar" className="gap-2"><Calendar className="h-3.5 w-3.5" />Calendar</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search schedules..." className="pl-8 w-52"
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Select value={filterFreq} onValueChange={setFilterFreq}>
                <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frequencies</SelectItem>
                  {['daily','weekly','monthly','quarterly','yearly'].map(f => (
                    <SelectItem key={f} value={f} className="capitalize">{f.charAt(0).toUpperCase()+f.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="list" className="space-y-3 mt-0">
            {filtered.map(pm => {
              const daysUntil = getDaysUntil(pm.nextDue)
              const isOverdue = daysUntil < 0
              const isDueSoon = daysUntil >= 0 && daysUntil <= 7
              return (
                <Card key={pm.id} className={cn('bg-card border-border transition-colors hover:border-primary/30', isOverdue && 'border-red-400/30', isDueSoon && !isOverdue && 'border-amber-400/30')}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-medium text-foreground text-sm">{pm.title}</span>
                          <Badge variant="outline" className={cn('text-xs capitalize', freqColors[pm.frequency])}>{pm.frequency}</Badge>
                          {pm.isComplianceRequired && <Badge variant="outline" className="text-xs bg-purple-400/10 text-purple-400 border-purple-400/20 gap-1"><Shield className="h-3 w-3"/>Compliance</Badge>}
                          {!pm.isActive && <Badge variant="outline" className="text-xs bg-muted text-muted-foreground">Paused</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{pm.assetName} · {pm.locationName}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span className={cn(isOverdue ? 'text-red-400 font-medium' : isDueSoon ? 'text-amber-400 font-medium' : '')}>
                              {isOverdue ? `${Math.abs(daysUntil)}d overdue` : daysUntil === 0 ? 'Due today' : `Due in ${daysUntil}d`}
                              {' '}({formatDate(pm.nextDue)})
                            </span>
                          </span>
                          {pm.lastCompleted && <span>Last done: {formatDate(pm.lastCompleted)}</span>}
                          {pm.assigneeName && <span>→ {pm.assigneeName}</span>}
                          {pm.checklist.length > 0 && <span>{pm.checklist.filter(c=>c.isCompleted).length}/{pm.checklist.length} tasks</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 h-8"
                          onClick={() => toast.success(`Started schedule ${pm.title}`)}
                        >
                          <Play className="h-3.5 w-3.5"/>Start
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              aria-label={`Actions for PM schedule ${pm.title}`}
                            >
                              <MoreVertical className="h-4 w-4" aria-hidden />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2" onClick={() => setGenerateWoSchedule(pm)}><Play className="h-4 w-4"/>Generate Work Order</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={() => setSkipSchedule(pm)}><SkipForward className="h-4 w-4"/>Skip (with reason)</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={() => setToggleSchedule(pm)}>{pm.isActive ? <><Pause className="h-4 w-4"/>Pause Schedule</> : <><Play className="h-4 w-4"/>Resume Schedule</>}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditSchedule(pm)}>Edit Schedule</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteSchedule(pm)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Calendar className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No schedules found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-0">
            <CalendarView schedules={filtered} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create PM Schedule</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Schedule Title *</Label>
              <Input placeholder="e.g. Quarterly HVAC Inspection" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea placeholder="Describe the maintenance tasks..." rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Asset *</Label>
                <Select value={form.assetId} onValueChange={v => setForm(p => ({ ...p, assetId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select asset" /></SelectTrigger>
                  <SelectContent>{mockAssets.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Location</Label>
                <Select value={form.locationId} onValueChange={v => setForm(p => ({ ...p, locationId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                  <SelectContent>{mockLocations.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Frequency *</Label>
                <Select value={form.frequency} onValueChange={v => setForm(p => ({ ...p, frequency: v as PMFrequency }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['daily','weekly','monthly','quarterly','yearly','custom'].map(f => (
                      <SelectItem key={f} value={f} className="capitalize">{f.charAt(0).toUpperCase()+f.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Assign To</Label>
                <Select value={form.assigneeId} onValueChange={v => setForm(p => ({ ...p, assigneeId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select assignee" /></SelectTrigger>
                  <SelectContent>{mockUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Est. Duration (min)</Label>
                <Input type="number" placeholder="60" value={form.estimatedDuration} onChange={e => setForm(p => ({ ...p, estimatedDuration: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Est. Cost ($)</Label>
                <Input type="number" placeholder="0.00" value={form.estimatedCost} onChange={e => setForm(p => ({ ...p, estimatedCost: e.target.value }))} />
              </div>
            </div>

            {/* Compliance toggle */}
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
              <Shield className="h-4 w-4 text-purple-400" />
              <div className="flex-1">
                <p className="text-sm font-medium">Regulatory / Compliance Schedule</p>
                <p className="text-xs text-muted-foreground">Enable for inspections that are legally required</p>
              </div>
              <Switch checked={form.isComplianceRequired} onCheckedChange={v => setForm(p => ({ ...p, isComplianceRequired: v }))} />
            </div>
            {form.isComplianceRequired && (
              <div className="space-y-1.5">
                <Label className="text-xs">Regulatory Reference</Label>
                <Input placeholder="e.g. NFPA 72, Local Building Code §12" value={form.regulatoryRef} onChange={e => setForm(p => ({ ...p, regulatoryRef: e.target.value }))} />
              </div>
            )}

            {/* Checklist */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Task Checklist</Label>
                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={addChecklistItem}><Plus2 className="h-3 w-3"/>Add Task</Button>
              </div>
              {form.checklist.map((item, i) => (
                <div key={item.id} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-5 text-right">{i + 1}.</span>
                  <Input className="flex-1 h-8 text-sm" placeholder={`Task ${i + 1}`} value={item.text} onChange={e => updateChecklistItem(item.id, e.target.value)} />
                  {form.checklist.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeChecklistItem(item.id)}
                      aria-label={`Remove checklist item ${item.text || `row ${i + 1}`}`}
                    >
                      <span aria-hidden>×</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button
              onClick={() => {
                setShowCreate(false)
                toast.success('PM schedule created')
              }}
              disabled={!form.title || !form.assetId}
            >
              Create Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Plus2(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 5v14M5 12h14"/></svg>
}
