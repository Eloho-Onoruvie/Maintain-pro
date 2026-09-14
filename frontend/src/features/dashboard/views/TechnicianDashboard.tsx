import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AppHeader as Navbar } from '@/components/navigation/Navbar'
import { KPICard } from '@/features/dashboard/components/StatCard'
import { useAuthStore } from '@/app/store'
import { useRoleDashboardDateRange } from '@/features/dashboard/hooks/useRoleDashboardDateRange'
import { usePortalPath } from '@/hooks/usePortal'
import type { WorkOrder } from '@/types/common.types'
import { HandWaveGreeting } from '@/components/ui/HandWaveGreeting'

// ─── Static Mock Data for Parity ──────────────────────────────────────────────

const DISPATCHED_TICKETS_STATIC = [
  {
    id: 'WO-8422',
    location: 'Main Office HQ Tower',
    title: 'Elevator Cab #3 Chiller Pump Failure',
    asset: 'Schindler 5500 Elevator • Floor 4 Mechanics Room',
    slaText: 'SLA Target: 2h left (1:30 PM deadline)',
    badge: 'CRITICAL',
    badgeBg: 'var(--destructive-muted)',
    badgeColor: 'var(--destructive)',
  },
  {
    id: 'WO-7994',
    location: 'North Logistics Hub',
    title: 'Semi-Annual Safety Cable Tension Check',
    asset: 'Freight Elevator Freight-1 • Loading Dock B',
    slaText: 'SLA Target: 4.2h left',
    badge: 'MEDIUM',
    badgeBg: 'var(--warning-muted)',
    badgeColor: 'var(--warning)',
  },
]

const TIMELINE_STATIC = [
  { time: '08:00 AM', title: 'Travel & Check-In', subtitle: 'HQ Tower Security Gate', status: 'Done', statusBg: 'var(--success-muted)', statusColor: 'var(--success)' },
  { time: '10:30 AM', title: 'Chiller Repair', subtitle: 'WO-8422 (HQ Room 4)', status: 'Active', statusBg: 'var(--info-muted)', statusColor: 'var(--info)' },
  { time: '02:00 PM', title: 'Cable Tension PM', subtitle: 'WO-7994 (North Logistics)', status: 'Next', statusBg: 'var(--warning-muted)', statusColor: 'var(--warning)' },
]

const RECENT_ACTIVITY_STATIC = [
  { title: 'Checked in at HQ Tower Lobby', subtitle: 'Dispatched by Samuel Dane', time: '15m ago' },
  { title: 'WO-8100 marked as Complete', subtitle: 'Chiller Filter replacement signed off by Sarah J.', time: '2h ago' },
  { title: 'SLA target updated for WO-8422', subtitle: 'SLA prioritized from Medium to Critical', time: '3h ago' },
]

const PREVENTIVE_MAINT_STATIC = [
  { date: 'Tomorrow, 9:00 AM', desc: 'Hydraulic fluid replacement & valve clean - West Campus', code: 'PM-80' },
  { date: 'Friday, 1:00 PM', desc: 'Emergency Brake Pad Wear Audit - HQ Tower Lobby', code: 'PM-82' },
]

function SectionCard({ title, subtitle, children, noPadding }: { title: string; subtitle: string; children: React.ReactNode; noPadding?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-none">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
        <p className="mt-0.5 text-[12px] text-muted-foreground">{subtitle}</p>
      </div>
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  )
}

export function TechnicianDashboard() {
  const user = useAuthStore((state) => state.user)
  const { workOrdersInRange } = useRoleDashboardDateRange('30d')
  const workOrdersPath = usePortalPath('work-orders')

  const assignedCount = workOrdersInRange.length
  const criticalCount = workOrdersInRange.filter((w) => w.priority === 'critical').length
  const dueTodayCount = workOrdersInRange.filter((w) => w.priority === 'high' || w.priority === 'critical').length
  const completedCount = workOrdersInRange.filter((w) => w.status === 'completed').length


  return (
    <>
      <Navbar title="My Work Desk" subtitle="Apex Dispatch" />

      <div className="dashboard-page min-h-full bg-background px-6 py-6 pb-12">
        <HandWaveGreeting
          userName={user?.firstName}
          subtext="Stay on top of your assigned work and service activities."
          className="mb-6"
        />
        {/* ── 4 KPI Cards ── */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard
            title="My Assignments"
            value={assignedCount}
            changeLabel="Across 2 locations"
            icon="work-orders"
          />
          <KPICard
            title="Critical / Urgent"
            value={criticalCount}
            changeLabel="SLA expiring soon"
            icon="overdue"
            variant="danger"
          />
          <KPICard
            title="Due Today"
            value={dueTodayCount}
            changeLabel="Target resolution by 5PM"
            icon="clock"
            variant="warning"
          />
          <KPICard
            title="Completed This Week"
            value={completedCount}
            changeLabel="SLA met 100%"
            icon="completed"
            variant="success"
          />
        </div>

        {/* ── 2 Column Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (8 cols on lg) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Today's Dispatched Tickets */}
            <SectionCard
              title="Today's Dispatched Tickets"
              subtitle="Direct queue with live action requirements"
            >
              <div className="space-y-4">
                {([] as typeof DISPATCHED_TICKETS_STATIC).map((ticket) => (
                  <div
                    key={ticket.id}
                    className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-border"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-primary">
                        <span>{ticket.id}</span>
                        <span className="text-muted-foreground"> • </span>
                        <span className="text-muted-foreground font-normal">{ticket.location}</span>
                      </div>
                      <span
                        className="rounded px-2 py-0.5 text-[11px] font-bold"
                        style={{ backgroundColor: ticket.badgeBg, color: ticket.badgeColor }}
                      >
                        {ticket.badge}
                      </span>
                    </div>

                    <h3 className="mt-2 text-[16px] font-bold text-foreground">{ticket.title}</h3>
                    <p className="mt-1 text-[13px] text-muted-foreground">{ticket.asset}</p>
                    <p className="mt-1 text-[12px] font-semibold text-destructive">{ticket.slaText}</p>

                    <div className="mt-4 flex items-center gap-3">
                      <Link
                        to={`${workOrdersPath}/${ticket.id}`}
                        className="rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        Start Work
                      </Link>
                      <Link to={`${workOrdersPath}/${ticket.id}`} className="rounded-lg border border-border bg-card px-4 py-2 text-[13px] font-semibold text-foreground transition-colors hover:bg-muted">
                        View details
                      </Link>
                    </div>
                  </div>
                ))}
                <p className="text-sm text-muted-foreground">Assigned tickets are available in the Work Orders workspace.</p>
              </div>
            </SectionCard>

            {/* Upcoming Preventive Maintenance */}
            <SectionCard
              title="Upcoming Preventive Maintenance"
              subtitle="Scheduled appointments for the next 48 hours"
            >
              <div className="space-y-3">
                {([] as typeof PREVENTIVE_MAINT_STATIC).map((pm) => (
                  <div
                    key={pm.code}
                    className="flex items-center justify-between rounded-xl border border-border bg-muted p-4"
                  >
                    <div>
                      <p className="text-[13px] font-bold text-foreground">{pm.date}</p>
                      <p className="mt-0.5 text-[13px] text-muted-foreground">{pm.desc}</p>
                    </div>
                    <span className="rounded bg-muted px-2 py-1 text-[11px] font-bold text-muted-foreground">
                      {pm.code}
                    </span>
                  </div>
                ))}
                <p className="text-sm text-muted-foreground">Upcoming preventive-maintenance assignments are not included in the dashboard response.</p>
              </div>
            </SectionCard>
          </div>

          {/* Right Column (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Today's Timeline */}
            <SectionCard title="Today's Timeline" subtitle="My hourly dispatch breakdown">
              <div className="space-y-3">
                {([] as typeof TIMELINE_STATIC).map((item) => (
                  <div
                    key={item.time}
                    className="flex items-start gap-3 rounded-xl border border-border bg-muted p-3.5"
                  >
                    <span className="shrink-0 text-[12px] font-bold text-foreground w-16 pt-0.5">
                      {item.time}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-foreground leading-tight">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{item.subtitle}</p>
                    </div>
                    <span
                      className="shrink-0 rounded px-2 py-0.5 text-[10px] font-bold"
                      style={{ backgroundColor: item.statusBg, color: item.statusColor }}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
                <p className="text-sm text-muted-foreground">Timeline data is not available from the dashboard API.</p>
              </div>
            </SectionCard>

            {/* Recent Activity Log */}
            <SectionCard title="Recent Activity Log" subtitle="Recent sign-offs and status alerts" noPadding>
              <div className="divide-y divide-border">
                {([] as typeof RECENT_ACTIVITY_STATIC).map((act, i) => (
                  <div key={i} className="px-5 py-3.5">
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-semibold text-foreground">{act.title}</p>
                      <span className="text-[11px] text-muted-foreground">{act.time}</span>
                    </div>
                    <p className="mt-0.5 text-[12px] text-muted-foreground">{act.subtitle}</p>
                  </div>
                ))}
                <p className="px-5 py-4 text-sm text-muted-foreground">Recent activity is not available from the dashboard API.</p>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </>
  )
}
