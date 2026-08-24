import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePortalPath } from '@/hooks/usePortal'
import { FileText, Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AppHeader } from '@/components/navigation/Navbar'
import { toast } from 'sonner'
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts'

export function Reports() {
  const [activeTab, setActiveTab] = useState<'generation_hub' | 'maintenance_summary' | 'inventory_report'>('generation_hub')
  const navigate = useNavigate()
  const reportsPath = usePortalPath('reports')

  return (
    <div className="min-h-full bg-background text-foreground">
      {/* Top Bar Header */}
      <AppHeader
        title={
          activeTab === 'generation_hub'
            ? 'Generation Hub'
            : activeTab === 'maintenance_summary'
            ? 'Maintenance Summary'
            : 'Inventory Report'
        }
        subtitle="Reports"
        hideQuickCreate
      />

      {/* Main Page Top Header & Sub-Navigation */}
      <div className="border-b border-border bg-card px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {activeTab === 'generation_hub'
                ? 'Reports Generation Hub'
                : activeTab === 'maintenance_summary'
                ? 'Maintenance Summary'
                : 'Inventory Report'}
            </h1>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              {activeTab === 'generation_hub'
                ? 'Instantly compile data models, audits, compliance rates, and vendor performance history.'
                : activeTab === 'maintenance_summary'
                ? 'Review and analyze cross-facility hardware performance, dispatch duration, and SLA rates.'
                : 'Monitor storage reserves, parts valuation, low-stock triggers, and critical safety thresholds.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'maintenance_summary' ? (
              <Button
                onClick={() => toast.success('Exporting PDF Report...')}
                className="flex items-center gap-2 rounded-lg bg-[#4f46e5] px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[#4338ca] transition-colors"
              >
                <Plus className="h-4 w-4" />
                Export PDF Report
              </Button>
            ) : activeTab === 'inventory_report' ? (
              <Button
                onClick={() => toast.success('Restock request initialized')}
                className="flex items-center gap-2 rounded-lg bg-[#4f46e5] px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[#4338ca] transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create Restock Request
              </Button>
            ) : null}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-5 flex items-center rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-1 text-[12px] font-semibold w-fit">
          <button
            onClick={() => setActiveTab('generation_hub')}
            className={`rounded-md px-4 py-1.5 transition-colors ${activeTab === 'generation_hub' ? 'bg-white text-[#0f172a] shadow-sm' : 'text-[#64748b] hover:text-[#0f172a]'}`}
          >
            Reports Hub
          </button>
          <button
            onClick={() => setActiveTab('maintenance_summary')}
            className={`rounded-md px-4 py-1.5 transition-colors ${activeTab === 'maintenance_summary' ? 'bg-white text-[#0f172a] shadow-sm' : 'text-[#64748b] hover:text-[#0f172a]'}`}
          >
            Maintenance Summary
          </button>
          <button
            onClick={() => setActiveTab('inventory_report')}
            className={`rounded-md px-4 py-1.5 transition-colors ${activeTab === 'inventory_report' ? 'bg-white text-[#0f172a] shadow-sm' : 'text-[#64748b] hover:text-[#0f172a]'}`}
          >
            Inventory Report
          </button>
        </div>
      </div>

      {/* Main Tab Contents */}
      <div className="p-8">
        {activeTab === 'generation_hub' ? (
          <GenerationHubView setActiveTab={setActiveTab} onOpenReport={(slug) => navigate(`${reportsPath}/${slug}`)} />
        ) : activeTab === 'maintenance_summary' ? (
          <MaintenanceSummaryView />
        ) : (
          <InventoryReportView />
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   1. GENERATION HUB VIEW
   ───────────────────────────────────────────────────────────────────────────── */
function GenerationHubView({ setActiveTab, onOpenReport }: { setActiveTab: (t: 'generation_hub' | 'maintenance_summary' | 'inventory_report') => void; onOpenReport: (slug: string) => void }) {
  return (
    <div className="space-y-6">
      {/* Global Report Filters Card */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-[#0f172a]">Global Report Filters</h2>
          <span className="text-[11px] text-[#94a3b8]">Apply parameters prior to file extraction</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[13px]">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-[#64748b]">SELECT FACILITY</label>
            <Select defaultValue="all">
              <SelectTrigger className="h-9 border-[#e2e8f0] bg-[#f8fafc]">
                <SelectValue placeholder="All Facilities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Facilities</SelectItem>
                <SelectItem value="hq">HQ Office Tower</SelectItem>
                <SelectItem value="west">West Campus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-[#64748b]">DATE RANGE</label>
            <Select defaultValue="30d">
              <SelectTrigger className="h-9 border-[#e2e8f0] bg-[#f8fafc]">
                <SelectValue placeholder="Last 30 Days (Jan 1 - Jan 30)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">Last 30 Days (Jan 1 - Jan 30)</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-[#64748b]">EXPORT FORMAT</label>
            <Select defaultValue="pdf">
              <SelectTrigger className="h-9 border-[#e2e8f0] bg-[#f8fafc]">
                <SelectValue placeholder="Adobe PDF Document (.pdf)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">Adobe PDF Document (.pdf)</SelectItem>
                <SelectItem value="csv">CSV Spreadsheet (.csv)</SelectItem>
                <SelectItem value="excel">Excel Workbook (.xlsx)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 6 Report Generation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            title: 'Maintenance Summary',
            desc: 'Overall health index, count of requests vs. completions, and active labor cost estimations.',
            actionLabel: 'Generate Summary',
            tabTarget: 'maintenance_summary' as const,
          },
          {
            title: 'Work Order Analysis',
            desc: 'Distribution of tickets by severity level, priority category, average times, and backlog age.',
            actionLabel: 'Generate Analysis',
            reportSlug: 'work-order-analysis',
          },
          {
            title: 'SLA Compliance Report',
            desc: 'Vendor performance benchmarks, emergency response success, and breach warning tallies.',
            actionLabel: 'Generate SLA Report',
            reportSlug: 'sla-compliance',
          },
          {
            title: 'PM Compliance Report',
            desc: 'Preventive task adherence index, missed checkup lists, and mechanical lifecycles remaining.',
            actionLabel: 'Generate PM Report',
            reportSlug: 'pm-compliance',
          },
          {
            title: 'Inventory Report',
            desc: 'Total stock valuation, low thresholds list, replacement frequency, and safety margins.',
            actionLabel: 'Generate Inventory Report',
            tabTarget: 'inventory_report' as const,
          },
          {
            title: 'Vendor Performance Report',
            desc: 'Rating summaries, dispatch frequency, invoice accuracies, and technician evaluations.',
            actionLabel: 'Generate Vendor Report',
            reportSlug: 'vendor-performance',
          },
        ].map((card, idx) => (
          <div key={idx} className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-[15px] font-bold text-[#0f172a]">{card.title}</h3>
              <p className="text-[12.5px] text-[#64748b] leading-relaxed">{card.desc}</p>
            </div>
            <Button
              onClick={() => {
                if (card.tabTarget) setActiveTab(card.tabTarget)
                else if (card.reportSlug) onOpenReport(card.reportSlug)
              }}
              className="w-fit rounded-lg bg-[#4f46e5] px-4 py-2 text-[12.5px] font-semibold text-white shadow-sm hover:bg-[#4338ca]"
            >
              {card.actionLabel}
            </Button>
          </div>
        ))}
      </div>

      {/* Recently Generated Reports Table */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-[15px] font-bold text-[#0f172a]">Recently Generated Reports</h2>
          <p className="text-[12px] text-[#64748b]">Download previously compiled report executions from history cache</p>
        </div>

        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[10px] font-bold uppercase text-[#64748b]">
            <tr>
              <th className="py-2.5 px-4">REPORT NAME</th>
              <th className="py-2.5 px-4">REPORT TYPE</th>
              <th className="py-2.5 px-4">DATE RANGE</th>
              <th className="py-2.5 px-4">GENERATED BY</th>
              <th className="py-2.5 px-4">GENERATION DATE</th>
              <th className="py-2.5 px-4 text-right">DOWNLOAD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {[
              { name: 'HQ_Tower_Jan_SLA_Compliance_v2', type: 'SLA Compliance Report', range: 'Jan 1, 2026 - Jan 31, 2026', by: 'Samuel Dane', date: 'Jan 30, 2026' },
              { name: 'PM_Preventive_Quarterly_Compiled', type: 'PM Compliance Report', range: 'Oct 1, 2025 - Dec 31, 2025', by: 'Dave Miller', date: 'Jan 28, 2026' },
              { name: 'Full_Organization_Inventory_Valuation', type: 'Inventory Report', range: 'As of Jan 25, 2026', by: 'Sarah Jenkins', date: 'Jan 25, 2026' },
              { name: 'HQ_HVAC_SLA_Audit_Anomalies', type: 'SLA Compliance Report', range: 'Jan 1, 2026 - Jan 20, 2026', by: 'System (Auto)', date: 'Jan 20, 2026' },
              { name: 'West_Campus_Backlog_Analysis_Q4', type: 'Work Order Analysis', range: 'Oct 1, 2025 - Dec 31, 2025', by: 'John Doe', date: 'Jan 15, 2026' },
            ].map((row, idx) => (
              <tr key={idx} className="hover:bg-[#f8fafc] transition-colors">
                <td className="py-3 px-4 font-bold text-[#0f172a] flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#64748b]" />
                  {row.name}
                </td>
                <td className="py-3 px-4 text-[#475569]">{row.type}</td>
                <td className="py-3 px-4 text-[#64748b]">{row.range}</td>
                <td className="py-3 px-4 text-[#475569] font-medium">{row.by}</td>
                <td className="py-3 px-4 text-[#64748b]">{row.date}</td>
                <td className="py-3 px-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast.success(`Downloading ${row.name}.pdf`)}
                    className="h-7 rounded bg-[#e0f2fe] px-2.5 text-[11px] font-bold text-[#0284c7] hover:bg-[#bae6fd]"
                  >
                    PDF
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. MAINTENANCE SUMMARY VIEW
   ───────────────────────────────────────────────────────────────────────────── */
function MaintenanceSummaryView() {
  const trend = [
    { day: 'Jan 08', created: 18, completed: 14 }, { day: 'Jan 10', created: 22, completed: 19 },
    { day: 'Jan 12', created: 16, completed: 21 }, { day: 'Jan 14', created: 25, completed: 20 },
    { day: 'Jan 16', created: 19, completed: 23 }, { day: 'Jan 18', created: 14, completed: 18 },
  ]
  const categories = [{ name: 'HVAC', value: 42 }, { name: 'Electrical', value: 28 }, { name: 'Plumbing', value: 19 }, { name: 'Other', value: 11 }]
  const colors = ['#4f46e5', '#0ea5e9', '#f59e0b', '#94a3b8']
  return (
    <div className="space-y-6">
      {/* 5 Filter Bar Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <Select defaultValue="all">
          <SelectTrigger className="h-9 w-44 border-[#e2e8f0] bg-white text-[13px]">
            <SelectValue placeholder="Facility: All Facilities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Facility: All</SelectItem>
            <SelectItem value="hq">HQ Office Tower</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="30d">
          <SelectTrigger className="h-9 w-48 border-[#e2e8f0] bg-white text-[13px]">
            <SelectValue placeholder="Date Range: Last 30 Days" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30d">Date Range: Last 30 Days</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="h-9 w-44 border-[#e2e8f0] bg-white text-[13px]">
            <SelectValue placeholder="Priority: All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Priority: All</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="h-9 w-48 border-[#e2e8f0] bg-white text-[13px]">
            <SelectValue placeholder="Category: All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Category: All</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="h-9 w-44 border-[#e2e8f0] bg-white text-[13px]">
            <SelectValue placeholder="Status: All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Status: All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Operational graphs */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm xl:col-span-3">
          <div className="mb-3"><h2 className="text-[15px] font-bold text-[#0f172a]">Work order flow</h2><p className="text-[12px] text-[#64748b]">Created versus completed in the selected period</p></div>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend} margin={{ left: -20, right: 8 }}><defs><linearGradient id="reportCreated" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f46e5" stopOpacity={.25}/><stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/><XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11}/><YAxis tickLine={false} axisLine={false} fontSize={11}/><Tooltip/><Area type="monotone" dataKey="created" stroke="#4f46e5" fill="url(#reportCreated)" strokeWidth={2}/><Area type="monotone" dataKey="completed" stroke="#10b981" fill="transparent" strokeWidth={2}/></AreaChart></ResponsiveContainer></div>
        </div>
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-3"><h2 className="text-[15px] font-bold text-[#0f172a]">Requests by category</h2><p className="text-[12px] text-[#64748b]">Share of maintenance volume</p></div>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categories} dataKey="value" nameKey="name" innerRadius={54} outerRadius={82} paddingAngle={3}>{categories.map((entry, index) => <Cell key={entry.name} fill={colors[index]}/>)}</Pie><Tooltip/><Legend verticalAlign="bottom" height={28}/></PieChart></ResponsiveContainer></div>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Work Orders', val: '148', sub: '◆ +12% from last month', isPositive: true },
          { label: 'Completed Orders', val: '124', sub: '◆ 83.7% completion rate', isPositive: true },
          { label: 'Avg. Resolution Time', val: '4h 12m', sub: '◆ -22m since last week', isPositive: true },
          { label: 'SLA Compliance Rate', val: '94.2%', sub: '◆ Target SLA is 92%', isPositive: true },
        ].map((kpi, idx) => (
          <div key={idx} className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm space-y-1">
            <p className="text-[12px] font-medium text-[#64748b]">{kpi.label}</p>
            <p className="text-3xl font-extrabold text-[#0f172a]">{kpi.val}</p>
            <p className="text-[11px] font-medium text-[#16a34a]">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Work Orders Ledger Table */}
      <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold uppercase text-[#64748b]">
            <tr>
              <th className="px-6 py-3.5">WO #</th>
              <th className="px-6 py-3.5">FACILITY</th>
              <th className="px-6 py-3.5">LOCATION</th>
              <th className="px-6 py-3.5">ASSET</th>
              <th className="px-6 py-3.5">CATEGORY</th>
              <th className="px-6 py-3.5">PRIORITY</th>
              <th className="px-6 py-3.5">STATUS</th>
              <th className="px-6 py-3.5">ASSIGNED TO</th>
              <th className="px-6 py-3.5">CREATED</th>
              <th className="px-6 py-3.5">RESOLVED</th>
              <th className="px-6 py-3.5 text-right">RES. TIME</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {[
              { id: 'WO-4810', fac: 'HQ Office Tower', loc: 'Conf Room B', asset: 'Carrier HVAC v4', cat: 'HVAC', pri: 'CRITICAL', stat: 'PROGRESS', tech: 'Sarah Jenkins', cr: 'Jan 12, 09:00', res: 'Jan 12, 13:12', time: '4h 12m' },
              { id: 'WO-4809', fac: 'West Campus', loc: 'Elevator Shaft B', asset: 'Otis Lift 2000', cat: 'Elevator', pri: 'HIGH', stat: 'COMPLETED', tech: 'Dave Miller', cr: 'Jan 11, 10:15', res: 'Jan 11, 12:45', time: '2h 30m' },
              { id: 'WO-4808', fac: 'North Logistics', loc: 'Basement Pump Room', asset: 'Grundfos Seal Pump', cat: 'Plumbing', pri: 'CRITICAL', stat: 'HOLD', tech: 'John Doe', cr: 'Jan 10, 08:30', res: '—', time: '—' },
              { id: 'WO-4807', fac: 'HQ Office Tower', loc: 'Cafeteria Kitchen', asset: 'Hobart Dishwasher', cat: 'Appliances', pri: 'MEDIUM', stat: 'COMPLETED', tech: 'Unassigned', cr: 'Jan 10, 14:20', res: 'Jan 10, 17:50', time: '3h 30m' },
              { id: 'WO-4806', fac: 'East Warehouses', loc: 'Dock Gate 3', asset: 'Linear Safety Loop', cat: 'Security', pri: 'HIGH', stat: 'PROGRESS', tech: 'John Doe', cr: 'Jan 09, 11:10', res: '—', time: '—' },
              { id: 'WO-4805', fac: 'HQ Office Tower', loc: 'All Floors', asset: 'Honeywell Alarm Gen3', cat: 'Fire Safety', pri: 'HIGH', stat: 'COMPLETED', tech: 'Sarah Jenkins', cr: 'Jan 09, 08:00', res: 'Jan 09, 10:15', time: '2h 15m' },
              { id: 'WO-4804', fac: 'Silicon Valley Lab', loc: 'Room 102', asset: 'APC Backup UPS 10k', cat: 'Electrical', pri: 'CRITICAL', stat: 'PROGRESS', tech: 'Dave Miller', cr: 'Jan 08, 12:00', res: '—', time: '—' },
              { id: 'WO-4803', fac: 'HQ Office Tower', loc: 'Lobby Front', asset: 'Philips LED Panel', cat: 'Lighting', pri: 'LOW', stat: 'COMPLETED', tech: 'Unassigned', cr: 'Jan 08, 15:45', res: 'Jan 08, 16:30', time: '45m' },
            ].map(row => (
              <tr key={row.id} className="hover:bg-[#f8fafc] transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-[#0f172a]">{row.id}</td>
                <td className="px-6 py-4 text-[#475569]">{row.fac}</td>
                <td className="px-6 py-4 text-[#475569]">{row.loc}</td>
                <td className="px-6 py-4 text-[#0f172a] font-medium">{row.asset}</td>
                <td className="px-6 py-4 text-[#475569]">{row.cat}</td>
                <td className="px-6 py-4">
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${row.pri === 'CRITICAL' || row.pri === 'HIGH' ? 'bg-[#fee2e2] text-[#ef4444]' : 'bg-[#fef3c7] text-[#d97706]'}`}>
                    {row.pri}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${row.stat === 'COMPLETED' ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#e0f2fe] text-[#0284c7]'}`}>
                    {row.stat}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#475569] font-medium">{row.tech}</td>
                <td className="px-6 py-4 text-[#64748b]">{row.cr}</td>
                <td className="px-6 py-4 text-[#64748b]">{row.res}</td>
                <td className="px-6 py-4 text-right font-bold text-[#0f172a]">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#e2e8f0] bg-white px-6 py-4 text-[13px] text-[#64748b]">
          <div>
            Showing <span className="font-semibold text-[#0f172a]">1-8</span> of{' '}
            <span className="font-semibold text-[#0f172a]">148</span> entries
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" className="h-8 rounded-md border-[#e2e8f0] px-3 text-[12px]">Previous</Button>
            <Button size="sm" className="h-8 rounded-md bg-[#4f46e5] px-3 text-[12px] font-semibold text-white">1</Button>
            <Button variant="outline" size="sm" className="h-8 rounded-md border-[#e2e8f0] px-3 text-[12px]">2</Button>
            <Button variant="outline" size="sm" className="h-8 rounded-md border-[#e2e8f0] px-3 text-[12px]">3</Button>
            <Button variant="outline" size="sm" className="h-8 rounded-md border-[#e2e8f0] px-3 text-[12px]">Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   3. INVENTORY REPORT VIEW
   ───────────────────────────────────────────────────────────────────────────── */
function InventoryReportView() {
  const stockLevels = [{ name: 'In stock', value: 68 }, { name: 'Low stock', value: 14 }, { name: 'Out of stock', value: 3 }]
  return (
    <div className="space-y-6">
      {/* 4 Filter Bar Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <Select defaultValue="all">
          <SelectTrigger className="h-9 w-44 border-[#e2e8f0] bg-white text-[13px]">
            <SelectValue placeholder="Facility: All Facilities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Facility: All</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="h-9 w-52 border-[#e2e8f0] bg-white text-[13px]">
            <SelectValue placeholder="Location: All Storage Rooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Location: All Rooms</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="h-9 w-48 border-[#e2e8f0] bg-white text-[13px]">
            <SelectValue placeholder="Category: Spare Parts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Category: Spare Parts</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="low">
          <SelectTrigger className="h-9 w-52 border-[#e2e8f0] bg-white text-[13px]">
            <SelectValue placeholder="Stock Status: Low & Critical" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Stock Status: Low & Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm"><h2 className="text-[15px] font-bold text-[#0f172a]">Stock health</h2><p className="mb-3 text-[12px] text-[#64748b]">Items by replenishment state</p><div className="h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={stockLevels} margin={{ left: -20 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/><XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11}/><YAxis tickLine={false} axisLine={false} fontSize={11}/><Tooltip/><Bar dataKey="value" fill="#4f46e5" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div></div>
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm"><h2 className="text-[15px] font-bold text-[#0f172a]">Inventory value outlook</h2><p className="mb-3 text-[12px] text-[#64748b]">Current value remains concentrated in healthy stock</p><div className="h-56"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{name:'Healthy value',value:42850},{name:'At-risk value',value:6200}]} dataKey="value" innerRadius={54} outerRadius={82} paddingAngle={3}><Cell fill="#10b981"/><Cell fill="#f59e0b"/></Pie><Tooltip formatter={(value: number) => `$${value.toLocaleString()}`}/></PieChart></ResponsiveContainer></div></div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Monitored Items', val: '482', sub: 'Across 8 storage units', color: '#0284c7' },
          { label: 'Low Stock Warnings', val: '14', sub: 'Needs replenishment action', isWarn: true },
          { label: 'Out of Stock', val: '3', sub: 'Severe backlog risk', isCrit: true },
          { label: 'Total Inventory Value', val: '$42,850', sub: 'Audit completed yesterday', isSuccess: true },
        ].map((kpi, idx) => (
          <div key={idx} className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm space-y-1">
            <p className="text-[12px] font-medium text-[#64748b]">{kpi.label}</p>
            <p className="text-3xl font-extrabold text-[#0f172a]">{kpi.val}</p>
            <p className={`text-[11px] font-medium ${kpi.isWarn ? 'text-[#d97706]' : kpi.isCrit ? 'text-[#ef4444]' : kpi.isSuccess ? 'text-[#16a34a]' : 'text-[#64748b]'}`}>
              {kpi.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Inventory Report Table */}
      <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold uppercase text-[#64748b]">
            <tr>
              <th className="px-6 py-3.5">ITEM NAME / SKU</th>
              <th className="px-6 py-3.5">CATEGORY</th>
              <th className="px-6 py-3.5">FACILITY</th>
              <th className="px-6 py-3.5 text-center">CURRENT STOCK</th>
              <th className="px-6 py-3.5 text-center">MIN STOCK</th>
              <th className="px-6 py-3.5 text-center">MAX STOCK</th>
              <th className="px-6 py-3.5">UNIT COST</th>
              <th className="px-6 py-3.5">TOTAL VALUE</th>
              <th className="px-6 py-3.5 text-right">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {[
              { sku: 'FLT-CH-8201', cat: 'HVAC Filters', fac: 'Silicon Valley Lab', stock: 2, min: 10, max: 40, cost: '$45.00', val: '$90.00', stat: 'CRITICAL LOW', sColor: { bg: '#fee2e2', text: '#ef4444' } },
              { sku: 'BULB-4FT-09', cat: 'Electrical', fac: 'HQ Office Tower', stock: 15, min: 40, max: 200, cost: '$8.50', val: '$225.00', stat: 'LOW STOCK', sColor: { bg: '#fef3c7', text: '#d97706' } },
              { sku: 'BLT-HVAC-12', cat: 'Mechanical', fac: 'North Logistics', stock: 4, min: 12, max: 50, cost: '$18.00', val: '$72.00', stat: 'LOW STOCK', sColor: { bg: '#fef3c7', text: '#d97706' } },
              { sku: 'LIFT-G-002', cat: 'Elevator Parts', fac: 'West Campus', stock: 0, min: 4, max: 20, cost: '—', val: '—', stat: 'OUT OF STOCK', sColor: { bg: '#fee2e2', text: '#ef4444' } },
              { sku: 'GAS-R410A-C', cat: 'HVAC Gas', fac: 'All Facilities', stock: 18, min: 8, max: 30, cost: '$110.00', val: '$1,980.00', stat: 'IN STOCK', sColor: { bg: '#dcfce7', text: '#16a34a' } },
              { sku: 'SL-PMP-G9', cat: 'Plumbing Accessories', fac: 'North Logistics', stock: 42, min: 20, max: 100, cost: '$3.20', val: '$134.40', stat: 'IN STOCK', sColor: { bg: '#dcfce7', text: '#16a34a' } },
              { sku: 'GLS-EM-EX0', cat: 'Safety Hardwares', fac: 'HQ Office Tower', stock: 1, min: 10, max: 25, cost: '$35.00', val: '$35.00', stat: 'CRITICAL LOW', sColor: { bg: '#fee2e2', text: '#ef4444' } },
              { sku: 'CBL-C6-SPL', cat: 'Cabling', fac: 'Silicon Valley Lab', stock: 8, min: 5, max: 15, cost: '$145.00', val: '$1,160.00', stat: 'IN STOCK', sColor: { bg: '#dcfce7', text: '#16a34a' } },
            ].map((row, idx) => (
              <tr key={idx} className="hover:bg-[#f8fafc] transition-colors">
                <td className="px-6 py-4 font-bold text-[#0f172a]">{row.sku}</td>
                <td className="px-6 py-4 text-[#475569]">{row.cat}</td>
                <td className="px-6 py-4 text-[#475569]">{row.fac}</td>
                <td className="px-6 py-4 text-center font-bold text-[#0f172a]">{row.stock}</td>
                <td className="px-6 py-4 text-center text-[#64748b]">{row.min}</td>
                <td className="px-6 py-4 text-center text-[#64748b]">{row.max}</td>
                <td className="px-6 py-4 font-medium text-[#475569]">{row.cost}</td>
                <td className="px-6 py-4 font-bold text-[#0f172a]">{row.val}</td>
                <td className="px-6 py-4 text-right">
                  <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase" style={{ backgroundColor: row.sColor.bg, color: row.sColor.text }}>
                    {row.stat}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#e2e8f0] bg-white px-6 py-4 text-[13px] text-[#64748b]">
          <div>
            Showing <span className="font-semibold text-[#0f172a]">1-8</span> of{' '}
            <span className="font-semibold text-[#0f172a]">482</span> entries
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" className="h-8 rounded-md border-[#e2e8f0] px-3 text-[12px]">Previous</Button>
            <Button size="sm" className="h-8 rounded-md bg-[#4f46e5] px-3 text-[12px] font-semibold text-white">1</Button>
            <Button variant="outline" size="sm" className="h-8 rounded-md border-[#e2e8f0] px-3 text-[12px]">2</Button>
            <Button variant="outline" size="sm" className="h-8 rounded-md border-[#e2e8f0] px-3 text-[12px]">3</Button>
            <Button variant="outline" size="sm" className="h-8 rounded-md border-[#e2e8f0] px-3 text-[12px]">Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
