import { useState, useMemo } from 'react'
import {
  Bell, Check, CheckCheck, Trash2, Settings2, Mail, MessageSquare,
  Smartphone, AlertTriangle, Wrench, Package, DollarSign, Shield,
  FileText, ChevronRight, Clock, ToggleLeft, ToggleRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { formatRelativeDate } from '@/utils/formatDate'
import { cn } from '@/utils/helpers'
import type { NotificationType, WorkOrderPriority } from '@/types/common.types'

const mockNotifications = [
  { id: '1', type: 'work_order' as NotificationType, title: 'Work Order Assigned', message: 'WO-2024-089 "HVAC Compressor Repair" has been assigned to you', isRead: false, createdAt: new Date(Date.now() - 5 * 60000), priority: 'high' as const, actionUrl: '/work-orders/WO-2024-089' },
  { id: '2', type: 'maintenance' as NotificationType, title: 'PM Schedule Due', message: 'Quarterly HVAC Inspection at Building A is due in 2 days', isRead: false, createdAt: new Date(Date.now() - 30 * 60000), priority: 'normal' as const, actionUrl: '/preventive-maintenance' },
  { id: '3', type: 'inventory' as NotificationType, title: 'Low Stock Alert', message: 'HVAC Air Filters (SKU-AF-001) is below minimum stock level (3 remaining)', isRead: false, createdAt: new Date(Date.now() - 2 * 3600000), priority: 'normal' as const, actionUrl: '/inventory' },
  { id: '4', type: 'approval' as NotificationType, title: 'Approval Required', message: 'Work Order WO-2024-091 requires your approval — estimated cost $4,500', isRead: false, createdAt: new Date(Date.now() - 3 * 3600000), priority: 'high' as const, actionUrl: '/work-orders/WO-2024-091' },
  { id: '5', type: 'contract' as NotificationType, title: 'Contract Expiring Soon', message: 'CoolTech HVAC Services contract expires in 28 days — renewal required', isRead: true, createdAt: new Date(Date.now() - 5 * 3600000), priority: 'high' as const, actionUrl: '/vendors' },
  { id: '6', type: 'work_order' as NotificationType, title: 'Work Order Completed', message: 'WO-2024-082 "Plumbing Leak — Floor 3" has been marked complete by Mike Rodriguez', isRead: true, createdAt: new Date(Date.now() - 8 * 3600000), priority: 'normal' as const, actionUrl: '/work-orders/WO-2024-082' },
  { id: '7', type: 'escalation' as NotificationType, title: 'Escalation Alert', message: 'WO-2024-077 is 6 hours overdue — escalated to Facilities Director', isRead: true, createdAt: new Date(Date.now() - 24 * 3600000), priority: 'high' as const, actionUrl: '/work-orders/WO-2024-077' },
  { id: '8', type: 'vendor' as NotificationType, title: 'Invoice Submitted', message: 'PestAway Services submitted invoice INV-2024-156 for $1,200 — awaiting verification', isRead: true, createdAt: new Date(Date.now() - 26 * 3600000), priority: 'normal' as const, actionUrl: '/vendors' },
  { id: '9', type: 'system' as NotificationType, title: 'System Backup Completed', message: 'Nightly data backup completed successfully at 03:00 AM', isRead: true, createdAt: new Date(Date.now() - 36 * 3600000), priority: 'normal' as const },
  { id: '10', type: 'maintenance' as NotificationType, title: 'PM Overdue', message: 'Monthly Elevator Inspection at Tower B is 3 days overdue', isRead: true, createdAt: new Date(Date.now() - 48 * 3600000), priority: 'high' as const, actionUrl: '/preventive-maintenance' },
]

const typeConfig: Record<NotificationType, { icon: React.ElementType; color: string; label: string }> = {
  work_order:  { icon: Wrench,         color: 'text-blue-400 bg-blue-400/10',     label: 'Work Orders' },
  maintenance: { icon: Clock,          color: 'text-purple-400 bg-purple-400/10', label: 'Maintenance' },
  inventory:   { icon: Package,        color: 'text-amber-400 bg-amber-400/10',   label: 'Inventory' },
  approval:    { icon: DollarSign,     color: 'text-emerald-400 bg-emerald-400/10', label: 'Approvals' },
  system:      { icon: Settings2,      color: 'text-muted-foreground bg-muted',   label: 'System' },
  vendor:      { icon: FileText,       color: 'text-cyan-400 bg-cyan-400/10',     label: 'Vendors' },
  contract:    { icon: Shield,         color: 'text-orange-400 bg-orange-400/10', label: 'Contracts' },
  escalation:  { icon: AlertTriangle,  color: 'text-red-400 bg-red-400/10',       label: 'Escalations' },
}

const defaultPrefs = {
  work_order:  { inApp: true,  email: true,  sms: false, push: true  },
  maintenance: { inApp: true,  email: true,  sms: false, push: true  },
  inventory:   { inApp: true,  email: false, sms: false, push: false },
  approval:    { inApp: true,  email: true,  sms: true,  push: true  },
  system:      { inApp: true,  email: false, sms: false, push: false },
  vendor:      { inApp: true,  email: true,  sms: false, push: false },
  contract:    { inApp: true,  email: true,  sms: true,  push: true  },
  escalation:  { inApp: true,  email: true,  sms: true,  push: true  },
}

const mockEscalationRules = [
  { id: '1', name: 'Critical WO Overdue', triggerHours: 2,  priority: 'critical' as WorkOrderPriority, escalateTo: 'Operations Director', method: ['email','sms'], isActive: true,  level: 1 },
  { id: '2', name: 'High Priority Overdue', triggerHours: 8,  priority: 'high'     as WorkOrderPriority, escalateTo: 'Facility Manager',    method: ['email'],      isActive: true,  level: 1 },
  { id: '3', name: 'Medium Priority Overdue', triggerHours: 24, priority: 'medium'   as WorkOrderPriority, escalateTo: 'Facility Manager',    method: ['email'],      isActive: true,  level: 1 },
  { id: '4', name: 'Critical L2 Escalation', triggerHours: 4,  priority: 'critical' as WorkOrderPriority, escalateTo: 'VP Operations',       method: ['email','sms'], isActive: true,  level: 2 },
]

export function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [prefs, setPrefs] = useState(defaultPrefs)
  const [filterType, setFilterType] = useState<'all' | 'unread'>('all')
  const [showEscalationCreate, setShowEscalationCreate] = useState(false)
  const [newRule, setNewRule] = useState({ name: '', triggerHours: '4', priority: 'high', escalateTo: '', level: '1' })

  const filtered = useMemo(() =>
    notifications.filter(n => filterType === 'all' || !n.isRead),
    [notifications, filterType])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markRead = (id: string) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, isRead: true } : n))
  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, isRead: true })))
  const deleteNotif = (id: string) => setNotifications(ns => ns.filter(n => n.id !== id))

  const togglePref = (type: NotificationType, channel: 'inApp' | 'email' | 'sms' | 'push') => {
    setPrefs(p => ({ ...p, [type]: { ...p[type as keyof typeof p], [channel]: !p[type as keyof typeof p][channel] } }))
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Notifications</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Alerts, preferences & escalation rules</p>
            </div>
            {unreadCount > 0 && (
              <Badge className="bg-primary text-primary-foreground">{unreadCount} unread</Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={markAllRead} disabled={unreadCount === 0}>
              <CheckCheck className="h-4 w-4" /> Mark all read
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="feed">
          <TabsList className="bg-muted border border-border mb-6">
            <TabsTrigger value="feed" className="gap-2">
              <Bell className="h-3.5 w-3.5" />Feed
              {unreadCount > 0 && <span className="ml-1 bg-primary text-primary-foreground text-[10px] rounded-full px-1.5 py-0.5 font-semibold">{unreadCount}</span>}
            </TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2"><Settings2 className="h-3.5 w-3.5" />Preferences</TabsTrigger>
            <TabsTrigger value="escalation" className="gap-2"><AlertTriangle className="h-3.5 w-3.5" />Escalation Rules</TabsTrigger>
          </TabsList>

          {/* FEED */}
          <TabsContent value="feed" className="mt-0 space-y-4">
            <div className="flex gap-2">
              {(['all', 'unread'] as const).map(f => (
                <Button key={f} size="sm" variant={filterType === f ? 'default' : 'outline'}
                  className="capitalize h-8 text-xs" onClick={() => setFilterType(f)}>
                  {f === 'all' ? 'All' : `Unread (${unreadCount})`}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              {filtered.map(n => {
                const cfg = typeConfig[n.type]
                const Icon = cfg.icon
                return (
                  <Card key={n.id}
                    className={cn('bg-card border-border transition-colors cursor-pointer hover:border-primary/30 group', !n.isRead && 'border-primary/20 bg-primary/[0.02]')}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0', cfg.color)}>
                          <Icon className="h-4.5 w-4.5 h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={cn('text-sm font-medium', !n.isRead ? 'text-foreground' : 'text-muted-foreground')}>{n.title}</span>
                              {!n.isRead && <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />}
                              {n.priority === 'high' && (
                                <Badge variant="outline" className="text-[10px] text-red-400 border-red-400/20 bg-red-400/10">Urgent</Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">{formatRelativeDate(n.createdAt)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
                          {n.actionUrl && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                              <span>View details</span><ChevronRight className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!n.isRead && (
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); markRead(n.id) }}
                              title="Mark as read">
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive" onClick={e => { e.stopPropagation(); deleteNotif(n.id) }}
                            title="Delete">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              {filtered.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">{filterType === 'unread' ? 'All caught up!' : 'No notifications'}</p>
                  <p className="text-sm mt-1">{filterType === 'unread' ? 'No unread notifications' : 'Notifications will appear here'}</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* PREFERENCES */}
          <TabsContent value="preferences" className="mt-0 space-y-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Notification Channels per Event Type</CardTitle>
                <p className="text-xs text-muted-foreground">Control which channels receive each type of notification</p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 pr-8 text-xs text-muted-foreground font-medium">Event Type</th>
                        {[
                          { key: 'inApp', label: 'In-App',  icon: Bell },
                          { key: 'email', label: 'Email',   icon: Mail },
                          { key: 'sms',   label: 'SMS',     icon: MessageSquare },
                          { key: 'push',  label: 'Push',    icon: Smartphone },
                        ].map(ch => (
                          <th key={ch.key} className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">
                            <div className="flex flex-col items-center gap-1">
                              <ch.icon className="h-4 w-4" />
                              {ch.label}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(Object.entries(typeConfig) as [NotificationType, typeof typeConfig[NotificationType]][]).map(([type, cfg]) => {
                        const pref = prefs[type as keyof typeof prefs]
                        const Icon = cfg.icon
                        return (
                          <tr key={type} className="border-b border-border/50 last:border-0">
                            <td className="py-3 pr-8">
                              <div className="flex items-center gap-2">
                                <div className={cn('h-6 w-6 rounded flex items-center justify-center', cfg.color)}>
                                  <Icon className="h-3.5 w-3.5" />
                                </div>
                                <span className="text-sm">{cfg.label}</span>
                              </div>
                            </td>
                            {(['inApp', 'email', 'sms', 'push'] as const).map(ch => (
                              <td key={ch} className="text-center px-4 py-3">
                                <div className="flex justify-center">
                                  <Switch
                                    checked={pref[ch]}
                                    onCheckedChange={() => togglePref(type, ch)}
                                    disabled={ch === 'inApp'} // in-app always on
                                  />
                                </div>
                              </td>
                            ))}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Quiet Hours</CardTitle>
                <p className="text-xs text-muted-foreground">Suppress non-urgent notifications during these hours</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Switch defaultChecked />
                    <span className="text-sm">Enable quiet hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground">From</Label>
                    <Input type="time" defaultValue="22:00" className="w-28 h-8 text-sm" />
                    <Label className="text-xs text-muted-foreground">To</Label>
                    <Input type="time" defaultValue="07:00" className="w-28 h-8 text-sm" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Critical and emergency notifications will still be delivered during quiet hours.</p>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button size="sm">Save Preferences</Button>
            </div>
          </TabsContent>

          {/* ESCALATION RULES */}
          <TabsContent value="escalation" className="mt-0 space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Auto-escalate overdue work orders to management based on priority and time</p>
              <Button size="sm" className="gap-2" onClick={() => setShowEscalationCreate(true)}>
                <Plus className="h-4 w-4" />Add Rule
              </Button>
            </div>

            <div className="space-y-3">
              {mockEscalationRules.map(rule => (
                <Card key={rule.id} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{rule.name}</span>
                          <Badge variant="outline" className="text-[10px]">Level {rule.level}</Badge>
                          <Badge variant="outline" className={cn('text-[10px] capitalize',
                            rule.priority === 'critical' ? 'text-red-400 border-red-400/20 bg-red-400/10' :
                            rule.priority === 'high'     ? 'text-orange-400 border-orange-400/20 bg-orange-400/10' :
                            'text-amber-400 border-amber-400/20 bg-amber-400/10')}>
                            {rule.priority}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Trigger: overdue by {rule.triggerHours}h</span>
                          <span className="flex items-center gap-1"><ChevronRight className="h-3 w-3" />Escalate to: {rule.escalateTo}</span>
                          <span>Channels: {rule.method.join(', ')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch checked={rule.isActive} />
                        <Button variant="ghost" size="sm" className="text-xs">Edit</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-muted/30 border-border border-dashed">
              <CardContent className="p-4 text-center text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Multi-level escalation: Level 1 triggers first, Level 2 triggers if still unresolved</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Escalation Rule Dialog */}
      <Dialog open={showEscalationCreate} onOpenChange={setShowEscalationCreate}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle>Create Escalation Rule</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Rule Name *</Label>
              <Input placeholder="e.g. Critical WO Level 2 Escalation"
                value={newRule.name} onChange={e => setNewRule(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Priority Level</Label>
                <Select value={newRule.priority} onValueChange={v => setNewRule(p => ({ ...p, priority: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['critical','high','medium','low'].map(p => (
                      <SelectItem key={p} value={p} className="capitalize">{p.charAt(0).toUpperCase()+p.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Trigger After (hours overdue)</Label>
                <Input type="number" placeholder="4" value={newRule.triggerHours}
                  onChange={e => setNewRule(p => ({ ...p, triggerHours: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Escalate To</Label>
                <Input placeholder="e.g. Operations Director"
                  value={newRule.escalateTo} onChange={e => setNewRule(p => ({ ...p, escalateTo: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Escalation Level</Label>
                <Select value={newRule.level} onValueChange={v => setNewRule(p => ({ ...p, level: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Level 1 (First)</SelectItem>
                    <SelectItem value="2">Level 2 (If still open)</SelectItem>
                    <SelectItem value="3">Level 3 (Final)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEscalationCreate(false)}>Cancel</Button>
            <Button onClick={() => setShowEscalationCreate(false)} disabled={!newRule.name || !newRule.escalateTo}>Create Rule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 5v14M5 12h14"/></svg>
}
