import { useMemo, useState } from 'react'
import {
  BarChart3, TrendingUp, FileText, Download, Filter, Calendar,
  DollarSign, Wrench, Users, Shield, CheckCircle2, AlertTriangle, Clock
} from 'lucide-react'
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
  const allWorkOrders = useMockDataStore((s) => s.workOrders)
  const mockPMs = useMockDataStore((s) => s.pms)

  const workOrdersInRange = useMemo(
    () => filterWorkOrdersForReport(allWorkOrders, dateRange),
    [allWorkOrders, dateRange],
  )

  const monthlyWO = useMemo(() => buildMonthlyWoTrend(workOrdersInRange), [workOrdersInRange])
  const monthlyCost = useMemo(() => buildMonthlyCostBreakdown(workOrdersInRange), [workOrdersInRange])
  const categorySpend = useMemo(() => buildCategorySpend(workOrdersInRange), [workOrdersInRange])
  const pmCompliance = useMemo(
    () => buildPmComplianceFromWorkOrders(workOrdersInRange),
    [workOrdersInRange],
  )
  const costTrend = useMemo(() => buildCostTrend(workOrdersInRange), [workOrdersInRange])

  const totalCost = monthlyCost.reduce((s, m) => s + m.labor + m.parts + m.vendor, 0)
  const avgCompliance =
    pmCompliance.length === 0
      ? 0
      : pmCompliance.reduce((s, p) => s + p.rate, 0) / pmCompliance.length

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
          <TabsList className="bg-muted border border-border mb-6">
            <TabsTrigger value="overview" className="gap-2"><BarChart3 className="h-3.5 w-3.5" />Overview</TabsTrigger>
            <TabsTrigger value="workorders" className="gap-2"><Wrench className="h-3.5 w-3.5" />Work Orders</TabsTrigger>
            <TabsTrigger value="costs" className="gap-2"><DollarSign className="h-3.5 w-3.5" />Cost Analysis</TabsTrigger>
            <TabsTrigger value="pm" className="gap-2"><Calendar className="h-3.5 w-3.5" />PM Compliance</TabsTrigger>
            <TabsTrigger value="vendors" className="gap-2"><Users className="h-3.5 w-3.5" />Vendors</TabsTrigger>
            <TabsTrigger value="compliance" className="gap-2"><Shield className="h-3.5 w-3.5" />Regulatory</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-6 mt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Work Orders', value: workOrdersInRange.length, icon: Wrench,        color: 'text-blue-400',    sub: 'in selected range' },
                { label: 'Total Spend',       value: `$${(totalCost/1000).toFixed(0)}k`, icon: DollarSign, color: 'text-amber-400', sub: 'all categories' },
                { label: 'PM Compliance',     value: `${avgCompliance.toFixed(0)}%`, icon: CheckCircle2, color: avgCompliance >= 90 ? 'text-emerald-400' : 'text-amber-400', sub: 'on-time completion' },
                { label: 'Avg Resolution',    value: '14.2h', icon: Clock,          color: 'text-purple-400', sub: 'across all priorities' },
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
                  <CardTitle className="text-sm font-medium">Spend by Category</CardTitle>
                  <ExportButton label="Spend Chart" data={categorySpend} requestDownload={requestDownload} />
                </CardHeader>
                <CardContent className="flex items-center">
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
                  {mockVendors.filter(v => v.status === 'active').map(v => (
                    <TableRow key={v.id} className="border-border">
                      <TableCell className="font-medium text-sm">{v.name}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{v.category}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-amber-400 text-sm font-semibold">{v.rating.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground">/5</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{v.completedJobs || 0}</TableCell>
                      <TableCell className="text-sm">{(v.slaResponseTime || 4)}h avg</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={88 + Math.random() * 10} className="h-1.5 w-16" />
                          <span className="text-xs">{(88 + Math.floor(Math.random() * 10))}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium">${((v.totalSpend || 0)/1000).toFixed(0)}k</TableCell>
                    </TableRow>
                  ))}
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
