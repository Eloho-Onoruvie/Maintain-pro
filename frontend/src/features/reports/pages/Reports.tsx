import { useMemo, useState, useEffect } from 'react'
import {
  BarChart3, TrendingUp, FileText, Download, Filter, Calendar,
  DollarSign, Wrench, Users, Shield, CheckCircle2, AlertTriangle, Clock
} from 'lucide-react'
import { useAuthStore } from '@/app/store'
import { useRoleAccess } from '@/hooks/useRoleAccess'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { mockVendors, mockUsers } from '@/features/dashboard/services/dashboard.service'
import { useMockDataStore } from '@/services/mockDataStore'
import {
  buildCategorySpend,
  buildMonthlyCostBreakdown,
  buildMonthlyWoTrend,
  buildPmComplianceFromWorkOrders,
  buildCostTrend,
  filterWorkOrdersForReport,
  buildPlannedVsActualCost,
  type ReportDateRange,
} from '@/features/reports/utils/reportData'
import { cn } from '@/utils/helpers'
import { formatDate } from '@/utils/formatDate'
import { toast } from 'sonner'
import { AppHeader } from '@/components/navigation/Navbar'
import { useDownloadConfirm } from '@/hooks/useDownloadConfirm'
import { downloadJson } from '@/utils/downloadFile'
import type { DownloadConfirmRequest } from '@/hooks/useDownloadConfirm'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

const complianceItems = [
  { name: 'Fire Extinguisher Inspection', lastDone: new Date('2024-11-01'), nextDue: new Date('2025-02-01'), status: 'compliant', ref: 'NFPA 10' },
  { name: 'Elevator Safety Certificate', lastDone: new Date('2024-08-15'), nextDue: new Date('2025-08-15'), status: 'compliant', ref: 'ASME A17.1' },
  { name: 'Emergency Lighting Test', lastDone: new Date('2024-10-01'), nextDue: new Date('2025-01-01'), status: 'due_soon', ref: 'NFPA 101' },
  { name: 'Sprinkler System Inspection', lastDone: new Date('2023-12-01'), nextDue: new Date('2024-12-01'), status: 'overdue', ref: 'NFPA 25' },
  { name: 'Electrical Panel Audit', lastDone: new Date('2024-06-01'), nextDue: new Date('2025-06-01'), status: 'compliant', ref: 'NFPA 70E' },
]

function ExportButton({
  label,
  data,
  requestDownload,
}: {
  label: string
  data: unknown
  requestDownload: (request: DownloadConfirmRequest) => void
}) {
  return (
    <div className="flex gap-2">
      {(['PDF', 'Excel', 'CSV'] as const).map((fmt) => (
        <Button
          key={fmt}
          size="sm"
          variant="outline"
          className="gap-2 h-8 text-xs"
          onClick={() =>
            requestDownload({
              title: `Download ${label}?`,
              description: `Export this report as ${fmt} (JSON format) to your device.`,
              confirmLabel: `Download ${fmt}`,
              onDownload: () => {
                downloadJson(`${label.toLowerCase().replace(/\s+/g, '-')}.${fmt.toLowerCase()}.json`, data)
                toast.success(`${label} exported as ${fmt}`)
              },
            })
          }
        >
          <Download className="h-3.5 w-3.5" />
          {fmt}
        </Button>
      ))}
    </div>
  )
}

export function Reports() {
  const { requestDownload, DownloadConfirmDialog } = useDownloadConfirm()
  const [dateRange, setDateRange] = useState<ReportDateRange>('6m')
  const [activeTab, setActiveTab] = useState('overview')

  const user = useAuthStore((s) => s.user)
  const { role, portal } = useRoleAccess()

  const allWorkOrders = useMockDataStore((s) => s.workOrders)
  const mockPMs = useMockDataStore((s) => s.pms)

  // Scope work orders to the logged in user/vendor if they are a vendor or technician
  const scopedWorkOrders = useMemo(() => {
    if (role === 'vendor_team_lead' || role === 'vendor_technician' || portal === 'vendor') {
      // Vendors should only see work orders assigned to them (where assigneeId is user.id, which matches their vendorId)
      return allWorkOrders.filter((wo) => wo.assigneeId === user?.id)
    }
    if (role === 'technician') {
      return allWorkOrders.filter((wo) => wo.assigneeId === user?.id)
    }
    return allWorkOrders
  }, [allWorkOrders, role, portal, user])

  const workOrdersInRange = useMemo(
    () => filterWorkOrdersForReport(scopedWorkOrders, dateRange),
    [scopedWorkOrders, dateRange],
  )

  const monthlyWO = useMemo(() => buildMonthlyWoTrend(workOrdersInRange), [workOrdersInRange])
  const monthlyCost = useMemo(() => buildMonthlyCostBreakdown(workOrdersInRange), [workOrdersInRange])
  const categorySpend = useMemo(() => buildCategorySpend(workOrdersInRange), [workOrdersInRange])
  const pmCompliance = useMemo(
    () => buildPmComplianceFromWorkOrders(workOrdersInRange),
    [workOrdersInRange],
  )
  const costTrend = useMemo(() => buildCostTrend(workOrdersInRange), [workOrdersInRange])
  const plannedVsActualData = useMemo(() => buildPlannedVsActualCost(workOrdersInRange), [workOrdersInRange])

  const isVendor = role === 'vendor_team_lead' || role === 'vendor_technician' || portal === 'vendor'

  // For vendor overview: jobs by category (count, not spend)
  const vendorJobsByCategory = useMemo(() => {
    if (!isVendor) return []
    const counts = new Map<string, number>()
    workOrdersInRange.forEach((wo) => counts.set(wo.category, (counts.get(wo.category) ?? 0) + 1))
    return [...counts.entries()].map(([name, value]) => ({ name, value }))
  }, [isVendor, workOrdersInRange])

  const totalCost = useMemo(() => {
    if (isVendor) {
      return workOrdersInRange.reduce((sum, wo) => sum + (wo.actualCost ?? wo.estimatedCost ?? 0), 0)
    }
    return monthlyCost.reduce((s, m) => s + m.labor + m.parts + m.vendor, 0)
  }, [isVendor, workOrdersInRange, monthlyCost])

  const avgCompliance =
    pmCompliance.length === 0
      ? 0
      : pmCompliance.reduce((s, p) => s + p.rate, 0) / pmCompliance.length

  const vendorOnTimeRate = useMemo(() => {
    if (!isVendor) return avgCompliance
    const completed = workOrdersInRange.filter(wo => wo.status === 'completed')
    if (completed.length === 0) return 96
    const onTime = completed.filter(wo => !wo.dueDate || new Date(wo.updatedAt) <= new Date(wo.dueDate))
    return Math.round((onTime.length / completed.length) * 100)
  }, [isVendor, workOrdersInRange, avgCompliance])

  const avgResolutionTime = useMemo(() => {
    const completed = workOrdersInRange.filter(wo => wo.status === 'completed')
    if (completed.length === 0) return '14.2h'
    const totalHours = completed.reduce((sum, wo) => {
      const hours = (new Date(wo.updatedAt).getTime() - new Date(wo.createdAt).getTime()) / (1000 * 60 * 60)
      return sum + Math.max(1, hours)
    }, 0)
    return `${(totalHours / completed.length).toFixed(1)}h`
  }, [workOrdersInRange])

  const visibleTabs = useMemo(() => {
    if (role === 'vendor_team_lead' || role === 'vendor_technician' || portal === 'vendor') {
      return [
        { value: 'overview', label: 'Overview', icon: BarChart3 },
        { value: 'workorders', label: 'Work Orders', icon: Wrench },
      ]
    }
    if (role === 'finance') {
      return [
        { value: 'overview', label: 'Overview', icon: BarChart3 },
        { value: 'workorders', label: 'Work Orders', icon: Wrench },
        { value: 'costs', label: 'Cost Analysis', icon: DollarSign },
        { value: 'vendors', label: 'Vendors', icon: Users },
      ]
    }
    // FMs and Admins see everything
    return [
      { value: 'overview', label: 'Overview', icon: BarChart3 },
      { value: 'workorders', label: 'Work Orders', icon: Wrench },
      { value: 'costs', label: 'Cost Analysis', icon: DollarSign },
      { value: 'pm', label: 'PM Compliance', icon: Calendar },
      { value: 'vendors', label: 'Vendors', icon: Users },
      { value: 'compliance', label: 'Regulatory', icon: Shield },
    ]
  }, [role, portal])

  useEffect(() => {
    if (!visibleTabs.some((t) => t.value === activeTab)) {
      setActiveTab(visibleTabs[0]?.value || 'overview')
    }
  }, [visibleTabs, activeTab])

  return (
    <div className="flex flex-col bg-background">
      {DownloadConfirmDialog}
      <AppHeader
        title="Reports & Analytics"
        subtitle="Operational insights, cost analysis & compliance tracking"
        hideQuickCreate
        actions={
          <>
            <Select
              value={dateRange}
              onValueChange={(v) => setDateRange(v as ReportDateRange)}
            >
              <SelectTrigger className="h-9 w-full sm:w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last Month</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() =>
                requestDownload({
                  title: 'Export all reports?',
                  description:
                    'Download a combined JSON file with work orders, costs, compliance, and vendor data for the selected date range.',
                  confirmLabel: 'Download export',
                  onDownload: () => {
                    downloadJson('reports-export-all.json', {
                      dateRange,
                      monthlyWO,
                      monthlyCost,
                      categorySpend,
                      pmCompliance,
                      complianceItems,
                    })
                    toast.success('Reports exported')
                  },
                })
              }
            >
              <Download className="h-4 w-4" />Export All
            </Button>
          </>
        }
      />

      <div className="page-body">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted border border-border mb-6 flex-wrap h-auto gap-1 p-1">
            {visibleTabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="gap-2">
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-6 mt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Work Orders', value: workOrdersInRange.length, icon: Wrench,        color: 'text-blue-400',    sub: isVendor ? 'assigned to you' : 'in selected range' },
                { label: isVendor ? 'Total Earnings' : 'Total Spend',       value: `$${(totalCost/1000).toFixed(0)}k`, icon: DollarSign, color: 'text-amber-400', sub: isVendor ? 'from completed jobs' : 'all categories' },
                { label: isVendor ? 'On-Time Rate' : 'PM Compliance',     value: `${(isVendor ? vendorOnTimeRate : avgCompliance).toFixed(0)}%`, icon: CheckCircle2, color: (isVendor ? vendorOnTimeRate : avgCompliance) >= 90 ? 'text-emerald-400' : 'text-amber-400', sub: 'on-time completion' },
                { label: 'Avg Resolution',    value: avgResolutionTime, icon: Clock,          color: 'text-purple-400', sub: isVendor ? 'avg per completed job' : 'across all priorities' },
              ].map(k => (
                <Card key={k.label} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{k.label}</p>
                        <p className={cn('text-2xl font-semibold mt-1', k.color)}>{k.value}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{k.sub}</p>
                      </div>
                      <k.icon className={cn('h-5 w-5', k.color)} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">Work Orders by Type</CardTitle>
                  <ExportButton label="WO Chart" data={monthlyWO} requestDownload={requestDownload} />
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={monthlyWO}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                      <Tooltip cursor={{ fill: 'var(--accent)', opacity: 0.16 }} contentStyle={{ background: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="reactive"   fill="#3b82f6" radius={[2,2,0,0]} />
                      <Bar dataKey="preventive" fill="#10b981" radius={[2,2,0,0]} />
                      <Bar dataKey="emergency"  fill="#ef4444" radius={[2,2,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {isVendor ? 'Jobs by Category' : 'Spend by Category'}
                  </CardTitle>
                  <ExportButton
                    label={isVendor ? 'Jobs by Category' : 'Spend Chart'}
                    data={isVendor ? vendorJobsByCategory : categorySpend}
                    requestDownload={requestDownload}
                  />
                </CardHeader>
                <CardContent className="flex items-center">
                  {isVendor ? (
                    vendorJobsByCategory.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-8 mx-auto">No jobs in selected range</p>
                    ) : (
                      <>
                        <ResponsiveContainer width="50%" height={220}>
                          <PieChart>
                            <Pie data={vendorJobsByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                              {vendorJobsByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip formatter={(v: number) => `${v} job${v !== 1 ? 's' : ''}`} contentStyle={{ background: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="flex-1 space-y-2">
                          {vendorJobsByCategory.map((c, i) => (
                            <div key={c.name} className="flex items-center gap-2 text-xs">
                              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                              <span className="flex-1 text-muted-foreground">{c.name}</span>
                              <span className="font-medium">{c.value} job{c.value !== 1 ? 's' : ''}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )
                  ) : (
                    <>
                      <ResponsiveContainer width="50%" height={220}>
                        <PieChart>
                          <Pie data={categorySpend} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                            {categorySpend.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Pie>
                          <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} contentStyle={{ background: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex-1 space-y-2">
                        {categorySpend.map((c, i) => (
                          <div key={c.name} className="flex items-center gap-2 text-xs">
                            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                            <span className="flex-1 text-muted-foreground">{c.name}</span>
                            <span className="font-medium">${(c.value/1000).toFixed(0)}k</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* WORK ORDERS */}
          <TabsContent value="workorders" className="space-y-6 mt-0">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-medium">Work Order Report</h2>
              <ExportButton label="WO Report" data={workOrdersInRange} requestDownload={requestDownload} />
            </div>
            <Card className="bg-card border-border">
              <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Monthly Volume Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlyWO}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                    <Tooltip cursor={{ stroke: 'var(--border)', strokeWidth: 1 }} contentStyle={{ background: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="reactive"   stroke="#3b82f6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="preventive" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="emergency"  stroke="#ef4444" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <div className="data-table-wrap">
          <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    {['ID','Title','Type','Priority','Status','Assignee','Cost','Created'].map(h => (
                      <TableHead key={h} className="text-muted-foreground text-xs">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workOrdersInRange.slice(0, 10).map(wo => (
                    <TableRow key={wo.id} className="border-border">
                      <TableCell className="font-mono text-xs">{wo.id}</TableCell>
                      <TableCell className="text-sm max-w-[180px] truncate">{wo.title}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs capitalize">{(wo as any).type || 'reactive'}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className="text-xs capitalize">{wo.priority}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className="text-xs capitalize">{wo.status.replace('_',' ')}</Badge></TableCell>
                      <TableCell className="text-sm">{wo.assigneeName || '—'}</TableCell>
                      <TableCell className="text-sm">{wo.estimatedCost ? `$${wo.estimatedCost.toLocaleString()}` : '—'}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDate(wo.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
        </div>
        </Card>
          </TabsContent>

          {/* COST ANALYSIS */}
          <TabsContent value="costs" className="space-y-6 mt-0">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-medium">Cost Analysis</h2>
              <ExportButton label="Cost Report" data={monthlyCost} requestDownload={requestDownload} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Monthly Spend Breakdown</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthlyCost}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                      <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                      <Tooltip cursor={{ fill: 'var(--accent)', opacity: 0.16 }} formatter={(v: number) => `$${v.toLocaleString()}`} contentStyle={{ background: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="labor"  stackId="a" fill="#3b82f6" />
                      <Bar dataKey="parts"  stackId="a" fill="#10b981" />
                      <Bar dataKey="vendor" stackId="a" fill="#f59e0b" radius={[2,2,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Planned vs Actual Cost Comparison (US-11)</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={plannedVsActualData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                      <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                      <Tooltip cursor={{ fill: 'var(--accent)', opacity: 0.16 }} formatter={(v: number) => `$${v.toLocaleString()}`} contentStyle={{ background: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="planned" name="Planned / Budgeted Spend" fill="#8b5cf6" radius={[2,2,0,0]} />
                      <Bar dataKey="actual" name="Actual Spend" fill="#06b6d4" radius={[2,2,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[{ label: 'Labor', key: 'labor', color: '#3b82f6' }, { label: 'Parts', key: 'parts', color: '#10b981' }, { label: 'Vendor', key: 'vendor', color: '#f59e0b' }].map(c => {
                const total = monthlyCost.reduce((s, m) => s + m[c.key as 'labor' | 'parts' | 'vendor'], 0)
                return (
                  <Card key={c.label} className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-sm" style={{ background: c.color }} />
                        <span className="text-xs text-muted-foreground">{c.label} Cost</span>
                      </div>
                      <p className="text-2xl font-semibold">${(total/1000).toFixed(0)}k</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* PM COMPLIANCE */}
          <TabsContent value="pm" className="space-y-6 mt-0">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-medium">PM Compliance Report</h2>
              <ExportButton label="PM Report" data={pmCompliance} requestDownload={requestDownload} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Overall Compliance', value: `${avgCompliance.toFixed(0)}%`, color: avgCompliance >= 90 ? 'text-emerald-400' : 'text-amber-400' },
                { label: 'Scheduled This Month', value: pmCompliance.reduce((s,p) => s+p.scheduled, 0), color: 'text-foreground' },
                { label: 'Completed On Time',    value: pmCompliance.reduce((s,p) => s+p.completed, 0), color: 'text-emerald-400' },
              ].map(k => (
                <Card key={k.label} className="bg-card border-border">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">{k.label}</p>
                    <p className={cn('text-3xl font-semibold mt-1', k.color)}>{k.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="bg-card border-border">
              <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Compliance by Category</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {pmCompliance.map(p => (
                  <div key={p.category}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium">{p.category}</span>
                      <div className="flex items-center gap-3 text-muted-foreground text-xs">
                        <span>{p.completed}/{p.scheduled} completed</span>
                        <span className={cn('font-semibold', p.rate === 100 ? 'text-emerald-400' : p.rate >= 85 ? 'text-amber-400' : 'text-red-400')}>{p.rate.toFixed(0)}%</span>
                      </div>
                    </div>
                    <Progress value={p.rate} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* VENDOR PERFORMANCE */}
          <TabsContent value="vendors" className="space-y-6 mt-0">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-medium">Vendor Performance Report</h2>
              <ExportButton label="Vendor Report" data={mockVendors} requestDownload={requestDownload} />
            </div>
            <Card className="bg-card border-border">
              <div className="data-table-wrap">
          <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    {['Vendor','Category','Rating','Jobs Done','Response Avg','Completion Rate','Total Spend'].map(h => (
                      <TableHead key={h} className="text-muted-foreground text-xs">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVendors.filter(v => v.status === 'active').map(v => {
                    const vendorWOs = allWorkOrders.filter(
                      (wo) => wo.assigneeId === v.id || wo.assigneeName === v.name
                    )
                    const completedWOs = vendorWOs.filter((wo) => wo.status === 'completed')
                    
                    const completionRate = vendorWOs.length 
                      ? Math.round((completedWOs.length / vendorWOs.length) * 100)
                      : (v.completedJobs ? 95 : 100)

                    const onTimeWOs = completedWOs.filter(
                      (wo) => !wo.dueDate || new Date(wo.updatedAt) <= new Date(wo.dueDate)
                    )
                    const onTimeRate = completedWOs.length
                      ? Math.round((onTimeWOs.length / completedWOs.length) * 100)
                      : 92

                    const totalSpend = vendorWOs.reduce((sum, wo) => sum + (wo.actualCost ?? wo.estimatedCost ?? 0), 0)
                    const finalSpend = totalSpend || v.totalSpend || 0

                    return (
                      <TableRow key={v.id} className="border-border">
                        <TableCell className="font-medium text-sm">{v.name}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{v.category}</Badge></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-amber-400 text-sm font-semibold">{v.rating.toFixed(1)}</span>
                            <span className="text-xs text-muted-foreground">/5</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{Math.max(v.completedJobs || 0, completedWOs.length)}</TableCell>
                        <TableCell className="text-sm">{(v.slaResponseTime || 4)}h avg</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={onTimeRate} className="h-1.5 w-16" />
                            <span className="text-xs">{onTimeRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-medium">${(finalSpend/1000).toFixed(0)}k</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
        </div>
        </Card>
          </TabsContent>

          {/* REGULATORY COMPLIANCE */}
          <TabsContent value="compliance" className="space-y-6 mt-0">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-medium">Regulatory Compliance Report</h2>
              <ExportButton label="Compliance Report" data={complianceItems} requestDownload={requestDownload} />
            </div>
            <Card className="bg-card border-border">
              <div className="data-table-wrap">
          <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    {['Inspection','Regulatory Reference','Last Done','Next Due','Status'].map(h => (
                      <TableHead key={h} className="text-muted-foreground text-xs">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceItems.map(item => (
                    <TableRow key={item.name} className="border-border">
                      <TableCell className="font-medium text-sm">{item.name}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs font-mono">{item.ref}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(item.lastDone)}</TableCell>
                      <TableCell className={cn('text-sm font-medium', item.status === 'overdue' ? 'text-red-400' : item.status === 'due_soon' ? 'text-amber-400' : '')}>{formatDate(item.nextDue)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('text-xs gap-1',
                          item.status === 'compliant' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                          item.status === 'due_soon'  ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' :
                          'bg-red-400/10 text-red-400 border-red-400/20')}>
                          {item.status === 'compliant' ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                          {item.status === 'compliant' ? 'Compliant' : item.status === 'due_soon' ? 'Due Soon' : 'Overdue'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
        </div>
        </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
