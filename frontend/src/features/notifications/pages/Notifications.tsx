import { useEffect, useMemo, useState } from 'react'
import {
  Bell, Check, CheckCheck, Trash2, Settings2, Mail, MessageSquare,
  Smartphone, AlertTriangle, ChevronRight, Clock, Plus
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
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AppHeader } from '@/components/navigation/Navbar'
import {
  DEFAULT_NOTIFICATION_PREFS,
  NOTIFICATION_TYPE_CONFIG,
} from '@/features/notifications/config/notificationConfig'
import { useUserNotifications } from '@/features/notifications/hooks/useUserNotifications'
import { useMockDataStore } from '@/services/mockDataStore'
import type { EscalationRule } from '@/types/common.types'

export function Notifications() {
  const navigate = useNavigate()
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    deleteNotification,
    notificationTypes,
    showEscalationRules,
    pageSubtitle,
    user,
  } = useUserNotifications()

  const roleTypeConfig = useMemo(() => {
    const entries = notificationTypes.map((type) => [type, NOTIFICATION_TYPE_CONFIG[type]] as const)
    return Object.fromEntries(entries) as Record<
      NotificationType,
      (typeof NOTIFICATION_TYPE_CONFIG)[NotificationType]
    >
  }, [notificationTypes])

  const defaultPrefsForRole = useMemo(() => {
    const prefs = {} as typeof DEFAULT_NOTIFICATION_PREFS
    for (const type of notificationTypes) {
      prefs[type] = DEFAULT_NOTIFICATION_PREFS[type]
    }
    return prefs
  }, [notificationTypes])

  const [prefs, setPrefs] = useState(defaultPrefsForRole)
  const [filterType, setFilterType] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    setPrefs(defaultPrefsForRole)
  }, [defaultPrefsForRole])
  const escalationRules = useMockDataStore((s) => s.escalationRules)
  const addEscalationRule = useMockDataStore((s) => s.addEscalationRule)
  const setEscalationRules = useMockDataStore((s) => s.setEscalationRules)
  const [showEscalationCreate, setShowEscalationCreate] = useState(false)
  const [newRule, setNewRule] = useState({ name: '', triggerHours: '4', priority: 'high', escalateTo: '', level: '1' })

  const toggleRuleActive = (rule: EscalationRule) => {
    setEscalationRules(
      escalationRules.map((r) =>
        r.id === rule.id ? { ...r, isActive: !r.isActive } : r,
      ),
    )
    toast.success(rule.isActive ? 'Rule paused' : 'Rule activated')
  }

  const filtered = useMemo(
    () => notifications.filter((n) => filterType === 'all' || !n.isRead),
    [notifications, filterType],
  )

  const togglePref = (type: NotificationType, channel: 'inApp' | 'email' | 'sms' | 'push') => {
    setPrefs((p) => ({
      ...p,
      [type]: { ...p[type as keyof typeof p], [channel]: !p[type as keyof typeof p][channel] },
    }))
  }

  return (
    <div className="flex flex-col bg-background">
      <AppHeader
        title="Notifications"
        subtitle={pageSubtitle}
        hideQuickCreate
        actions={
          <>
            {unreadCount > 0 && (
              <Badge className="bg-primary text-primary-foreground">{unreadCount} unread</Badge>
            )}
            <Button variant="outline" size="sm" className="gap-2" onClick={markAllRead} disabled={unreadCount === 0}>
              <CheckCheck className="h-4 w-4" /> Mark all read
            </Button>
          </>
        }
      />

      <div className="page-body">
        {user && (
          <p className="text-xs text-muted-foreground mb-4">
            Showing notifications for {user.email} ({user.role.replace(/_/g, ' ')})
          </p>
        )}

        <Tabs defaultValue="feed">
          <TabsList className="tabs-list-scroll bg-muted border border-border">
            <TabsTrigger value="feed" className="gap-2">
              <Bell className="h-3.5 w-3.5" />Feed
              {unreadCount > 0 && <span className="ml-1 bg-primary text-primary-foreground text-[10px] rounded-full px-1.5 py-0.5 font-semibold">{unreadCount}</span>}
            </TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2"><Settings2 className="h-3.5 w-3.5" />Preferences</TabsTrigger>
            {showEscalationRules && (
              <TabsTrigger value="escalation" className="gap-2"><AlertTriangle className="h-3.5 w-3.5" />Escalation Rules</TabsTrigger>
            )}
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
                const cfg = roleTypeConfig[n.type]
                if (!cfg) return null
                const Icon = cfg.icon
                return (
                  <Card
                    key={n.id}
                    className={cn('bg-card border-border transition-colors cursor-pointer hover:border-primary/30 group', !n.isRead && 'border-primary/20 bg-primary/2')}
                    onClick={() => {
                      if (!n.isRead) markRead(n.id)
                      if (n.actionUrl) navigate(n.actionUrl)
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0', cfg.color)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={cn('text-sm font-medium', !n.isRead ? 'text-foreground' : 'text-muted-foreground')}>{n.title}</span>
                              {!n.isRead && <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                              {n.priority === 'high' && (
                                <Badge variant="outline" className="text-[10px] text-red-400 border-red-400/20 bg-red-400/10">Urgent</Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{formatRelativeDate(n.createdAt)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
                          {n.actionUrl && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                              <span>View details</span><ChevronRight className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!n.isRead && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={e => { e.stopPropagation(); markRead(n.id) }}
                              aria-label={`Mark notification "${n.title}" as read`}
                            >
                              <Check className="h-3.5 w-3.5" aria-hidden />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:text-destructive"
                            onClick={e => { e.stopPropagation(); deleteNotification(n.id) }}
                            aria-label={`Delete notification "${n.title}"`}
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden />
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
                <p className="text-xs text-muted-foreground">
                  Control which channels receive each type of notification relevant to your role
                </p>
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
                      {(Object.entries(roleTypeConfig) as [NotificationType, typeof roleTypeConfig[NotificationType]][]).map(([type, cfg]) => {
                        const pref = prefs[type as keyof typeof prefs]
                        const Icon = cfg.icon
                        return (
                          <tr key={type} className="border-b border-border/50 last:border-0">
                            <td className="py-3 pr-8">
                              <div className="flex items-center gap-2">
                                <div className={cn('h-7 w-7 rounded-md flex items-center justify-center', cfg.color)}>
                                  <Icon className="h-3.5 w-3.5" />
                                </div>
                                <span className="text-sm">{cfg.label}</span>
                              </div>
                            </td>
                            {(['inApp', 'email', 'sms', 'push'] as const).map(channel => (
                              <td key={channel} className="text-center px-4 py-3">
                                <div className="flex justify-center">
                                  <Switch
                                    checked={pref[channel]}
                                    onCheckedChange={() => togglePref(type, channel)}
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
          {showEscalationRules && (
          <TabsContent value="escalation" className="mt-0 space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Auto-escalate overdue work orders to management based on priority and time</p>
              <Button size="sm" className="gap-2" onClick={() => setShowEscalationCreate(true)}>
                <Plus className="h-4 w-4" />Add Rule
              </Button>
            </div>

            <div className="space-y-3">
              {escalationRules.map(rule => (
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
                        <Switch checked={rule.isActive} onCheckedChange={() => toggleRuleActive(rule)} />
                        <Button variant="ghost" size="sm" className="text-xs" onClick={() => toast.info(`Edit rule: ${rule.name}`)}>Edit</Button>
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
          )}
        </Tabs>
      </div>

      {/* Create Escalation Rule Dialog */}
      {showEscalationRules && (
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
                    <SelectItem value="1">Level 1</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEscalationCreate(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (!newRule.name.trim() || !newRule.escalateTo.trim()) {
                  toast.error('Name and recipient required')
                  return
                }
                addEscalationRule({
                  id: `esc-${Date.now()}`,
                  name: newRule.name,
                  triggerHours: Number(newRule.triggerHours) || 4,
                  priority: newRule.priority as WorkOrderPriority,
                  escalateTo: newRule.escalateTo,
                  method: ['in_app', 'email'],
                  isActive: false,
                  level: Number(newRule.level) || 1,
                })
                toast.success('Rule created — activate when ready (US-14)')
                setShowEscalationCreate(false)
                setNewRule({ name: '', triggerHours: '4', priority: 'high', escalateTo: '', level: '1' })
              }}
            >
              Create Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      )}
    </div>
  )
}
