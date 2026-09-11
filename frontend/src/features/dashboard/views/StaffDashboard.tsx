import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'

import { AppHeader as Navbar } from '@/components/navigation/Navbar'
import { KPICard } from '@/features/dashboard/components/StatCard'
import { PageHeader } from '@/components/ui/page-header'
import { getTimeGreeting } from '@/utils/timeGreeting'
import { useAuthStore } from '@/app/store'
import { usePortalPath } from '@/hooks/usePortal'
import { isDemoMode } from '@/config/runtime'
import { useQuery } from '@tanstack/react-query'
import { serviceRequestsService } from '@/features/service-requests/services/serviceRequests.service'
import type { ServiceRequestRecord } from '@/features/service-requests/services/serviceRequests.service'

// ─── Static Mock Data matching Figma ─────────────────────────────────────────

const MY_SERVICE_REQUESTS_STATIC = [
  { id: '1', title: 'Conference Room B thermostat is unresponsive', location: 'Lobby Building - Fl 4', priority: 'Medium Priority', priorityBg: 'var(--muted)', priorityColor: 'var(--muted-foreground)', status: 'In Progress', statusBg: 'var(--warning-muted)', statusColor: 'var(--warning)' },
  { id: '2', title: 'Broken lock mechanism on main storage cabinet', location: 'West Wing HR Hub', priority: 'Low Priority', priorityBg: 'var(--muted)', priorityColor: 'var(--muted-foreground)', status: 'Approved', statusBg: 'var(--success-muted)', statusColor: 'var(--success)' },
  { id: '3', title: 'Restroom faucet leaks continuously', location: 'Lobby Main restroom', priority: 'Low Priority', priorityBg: 'var(--muted)', priorityColor: 'var(--muted-foreground)', status: 'Dispatched', statusBg: 'var(--info-muted)', statusColor: 'var(--info)' },
  { id: '4', title: 'Water spot on ceiling panel above workstation 12', location: 'HQ Floor 2 Corridor', priority: 'Medium Priority', priorityBg: 'var(--muted)', priorityColor: 'var(--muted-foreground)', status: 'Under Review', statusBg: 'var(--warning-muted)', statusColor: 'var(--warning)' },
  { id: '5', title: 'Flickering lights in pantry corridor', location: 'East Warehouse Annex', priority: 'Low Priority', priorityBg: 'var(--muted)', priorityColor: 'var(--muted-foreground)', status: 'Resolved', statusBg: 'var(--success-muted)', statusColor: 'var(--success)' },
]

const RECENT_REQUEST_UPDATES_STATIC = [
  { title: 'Work order completed', desc: 'Corridor lighting issue resolved', time: '10m ago' },
  { title: 'Technician Dispatched', desc: 'Dave Miller assigned to Thermostat request', time: '1h ago' },
  { title: 'Request approved', desc: 'Lock replacement scheduled for next Tuesday', time: '2h ago' },
]

function SectionCard({ title, subtitle, children, noPadding }: { title: string; subtitle?: string; children: React.ReactNode; noPadding?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-none">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[12px] text-muted-foreground">{subtitle}</p>}
      </div>
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  )
}


export function StaffDashboard() {
  const user = useAuthStore((state) => state.user)
  const serviceRequestsPath = usePortalPath('service-requests')
  const navigate = useNavigate()
  const requestsQuery = useQuery<{ data: ServiceRequestRecord[] }>({ queryKey: ['dashboard', 'staff-service-requests', user?.id], queryFn: () => serviceRequestsService.list({ limit: 100 }), enabled: Boolean(user?.id) && !isDemoMode, staleTime: 60_000 })
  const liveRequests = requestsQuery.data?.data ?? []

  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [problem, setProblem] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // The dashboard shortcut does not have enough fields to create a request safely.
    // Send the staff member to the full validated request form instead of discarding input.
    navigate(`${serviceRequestsPath}/new`)
  }

  return (
    <>
      <Navbar title="Dashboard" subtitle="Home" />

      <div className="dashboard-page min-h-full bg-background px-6 py-6 pb-12">
        {/* ── Header ── */}
        <PageHeader
          className="mb-6 rounded-xl border border-border/80"
          title={getTimeGreeting(user?.firstName || 'Samuel').greeting}
          subtitle="Report issues and keep track of your maintenance requests."
          actions={
            <Link
              to={serviceRequestsPath}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Create Service Request
            </Link>
          }
        />

        {/* ── 3 KPI Cards ── */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <KPICard
            title="My Open Requests"
            // TODO: no real data source wired yet
            value={isDemoMode ? 3 : liveRequests.filter((request: ServiceRequestRecord) => !['rejected', 'completed'].includes(request.status)).length}
            changeLabel={isDemoMode ? 'All assigned' : 'Live requests'}
            icon="work-orders"
          />
          <KPICard
            title="Resolved This Month"
            // TODO: no real data source wired yet
            value={isDemoMode ? 7 : liveRequests.filter((request: ServiceRequestRecord) => request.status === 'approved').length}
            changeLabel={isDemoMode ? '+2 this week' : 'Approved requests'}
            icon="completed"
            variant="success"
          />
          <KPICard
            title="Avg Resolution Time"
            value={isDemoMode ? '6.2 hrs' : '—'}
            changeLabel={isDemoMode ? 'Standard delivery' : 'Not available'}
            icon="clock"
          />
        </div>

        {/* ── 2 Column Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: My Service Requests (7 cols on lg) */}
          <div className="lg:col-span-7">
            <SectionCard
              title="My Service Requests"
              subtitle="Tracking and updates for facilities reports you submitted"
              noPadding
            >
              <div className="divide-y divide-[#f1f5f9]">
                {(isDemoMode ? MY_SERVICE_REQUESTS_STATIC : []).map((req) => (
                  <div key={req.id} className="flex items-center justify-between gap-3 px-5 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-foreground truncate">{req.title}</p>
                      <p className="mt-0.5 text-[12px] text-muted-foreground">{req.location}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className="rounded px-2 py-0.5 text-[11px] font-medium"
                        style={{ backgroundColor: req.priorityBg, color: req.priorityColor }}
                      >
                        {req.priority}
                      </span>
                      <span
                        className="rounded px-2.5 py-0.5 text-[11px] font-semibold"
                        style={{ backgroundColor: req.statusBg, color: req.statusColor }}
                      >
                        {req.status}
                      </span>
                    </div>
                  </div>
                ))}
                {!isDemoMode && liveRequests.length === 0 && <p className="px-5 py-6 text-sm text-muted-foreground">No service requests have been submitted yet.</p>}
              </div>
            </SectionCard>
          </div>

          {/* Right Column: Quick Service Request & Activity (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Service Request Form */}
            <SectionCard
              title="Quick Service Request"
              subtitle="Instantly report an issue to your facilities officer"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold text-foreground">
                    Issue Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-[13px] text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="">Select category...</option>
                    <option value="hvac">HVAC & Climate</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical & Lighting</option>
                    <option value="doors">Doors & Security</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-foreground">
                    Specific Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Conference Room B"
                    className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-foreground">
                    Describe the problem
                  </label>
                  <textarea
                    rows={3}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="Provide details such as broken equipment or anomalies..."
                    className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary py-2.5 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Submit Request
                </button>
              </form>
            </SectionCard>

            {/* Recent Request Updates */}
            <SectionCard
              title="Recent Request Updates"
              subtitle="Activity logs regarding your submissions"
              noPadding
            >
              <div className="divide-y divide-[#f1f5f9]">
                {(isDemoMode ? RECENT_REQUEST_UPDATES_STATIC : []).map((upd, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 px-5 py-3.5">
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">{upd.title}</p>
                      <p className="text-[12px] text-muted-foreground mt-0.5">{upd.desc}</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground shrink-0">{upd.time}</span>
                  </div>
                ))}
                {!isDemoMode && <p className="px-5 py-6 text-sm text-muted-foreground">Recent request activity is not available from the dashboard API.</p>}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </>
  )
}
