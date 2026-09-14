import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ClipboardList,
  Wrench,
  ShieldAlert,
  Package,
  Settings,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import { AppHeader as Navbar } from "@/components/navigation/Navbar";
import { KPICard } from "@/features/dashboard/components/StatCard";
import {
  CategoryBreakdownChart,
  WorkOrderTrendChart,
} from "@/features/dashboard/components/DashboardWidgets";
import { useRoleDashboardDateRange } from "@/features/dashboard/hooks/useRoleDashboardDateRange";
import {
  DASHBOARD_RANGE_LABELS,
  type DashboardDateRange,
} from "@/features/dashboard/utils/dashboardDateRange";
import { usePortalPath } from "@/hooks/usePortal";
import { useAuthStore } from "@/app/store";
import { useState } from "react";
import type { WorkOrder } from "@/types/common.types";
import { PageLoader } from "@/components/feedback/PageLoader";
import { PageError } from "@/components/feedback/PageError";
import { HandWaveGreeting } from "@/components/ui/HandWaveGreeting";
import { isDemoMode } from "@/config/runtime";
import { facilitiesApi } from "@/features/facilities/api/facilities.api";
import { useQuery } from "@tanstack/react-query";

// ─── Static placeholder data matching Figma ───────────────────────────────────

const VENDOR_SLA = [
  {
    name: "Apex Elevator Co.",
    service: "Vertical Transport",
    pct: 98,
    color: "var(--success)",
    barFill: "var(--success)",
  },
  {
    name: "Pro HVAC Solutions",
    service: "Climate Systems",
    pct: 91,
    color: "var(--warning)",
    barFill: "var(--warning)",
  },
  {
    name: "Reliable Plumbing",
    service: "Water/Waste Mgmt",
    pct: 86,
    color: "var(--destructive)",
    barFill: "var(--destructive)",
  },
];

const VENDOR_DISPATCH_STATIC = [
  {
    id: "1",
    vendor: "Apex Elevator Co.",
    action: "Updated work order status to In Progress",
    time: "3m ago",
  },
  {
    id: "2",
    vendor: "Pro HVAC Solutions",
    action: "Submitted invoice for WO-4921",
    time: "47m ago",
  },
  {
    id: "3",
    vendor: "Reliable Plumbing",
    action: "Assigned tech to WO-4810",
    time: "2h ago",
  },
];

const PENDING_APPROVALS_STATIC = [
  {
    id: "1",
    type: "Vendor Contract",
    title: "Elevator Annual Maint. • $12,400",
    requester: "Requested by: Sarah Jenkins (FM)",
    time: "2h ago",
  },
  {
    id: "2",
    type: "Asset Purchase",
    title: "Replacement Chiller Pump • $4,200",
    requester: "Requested by: Dave Miller (FM)",
    time: "4h ago",
  },
  {
    id: "3",
    type: "Work Order (Over $1k)",
    title: "Main Roof Patch • $1,850",
    requester: "Requested by: Sarah Jenkins (FM)",
    time: "1d ago",
  },
  {
    id: "4",
    type: "Inventory Restock",
    title: "Bulk LED Replacements • $1,100",
    requester: "Requested by: John Doe (Inv)",
    time: "1d ago",
  },
];

const INVENTORY_WARNINGS = [
  {
    id: "1",
    item: "Chiller Filter Cartridges",
    detail: "In Stock: 2 (Min: 10)",
    status: "CRITICAL LOW",
    color: "var(--destructive)",
    bg: "var(--destructive-muted)",
  },
  {
    id: "2",
    item: "Fluorescent Bulbs 4ft",
    detail: "In Stock: 15 (Min: 40)",
    status: "LOW STOCK",
    color: "var(--warning)",
    bg: "var(--warning-muted)",
  },
  {
    id: "3",
    item: "HVAC Belts (Size 12)",
    detail: "In Stock: 4 (Min: 12)",
    status: "LOW STOCK",
    color: "var(--warning)",
    bg: "var(--warning-muted)",
  },
];

const RECENT_ACTIVITY_STATIC = [
  {
    id: "1",
    text: "Work order 'WO-4810' completed by Apex Elevator Co.",
    time: "12m ago",
    user: "AS",
    userBg: "var(--primary)",
  },
  {
    id: "2",
    text: "New emergency work order created for Server Room HVAC",
    time: "24m ago",
    user: "SJ",
    userBg: "var(--success)",
  },
  {
    id: "3",
    text: "Vendor partner 'Reliable Plumbing' onboarded",
    time: "1h ago",
    user: "SD",
    userBg: "var(--info)",
  },
  {
    id: "4",
    text: "SLA breach warning generated for WO-4790",
    time: "2h ago",
    user: "SY",
    userBg: "var(--muted-foreground)",
  },
  {
    id: "5",
    text: "Quarterly Preventive Maintenance Schedule compiled",
    time: "5h ago",
    user: "SD",
    userBg: "var(--info)",
  },
  {
    id: "6",
    text: "Inventory count audit submitted for West Campus",
    time: "1d ago",
    user: "JD",
    userBg: "var(--chart-5)",
  },
  {
    id: "7",
    text: "Global SLA target modified from 90% to 92%",
    time: "2d ago",
    user: "SD",
    userBg: "var(--info)",
  },
  {
    id: "8",
    text: "New Facility 'East Warehouses' added to organization",
    time: "3d ago",
    user: "SD",
    userBg: "var(--info)",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({
  title,
  subtitle,
  children,
  noPadding,
  demoData,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  noPadding?: boolean;
  demoData?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border/80 bg-gradient-to-r from-card to-muted/20 px-5 py-4">
        <div>
          <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
          <p className="mt-0.5 text-[13px] text-muted-foreground">{subtitle}</p>
        </div>
        {demoData && (
          <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-400">
            Demo
          </span>
        )}
      </div>
      <div className={noPadding ? "" : "px-5 py-4"}>{children}</div>
    </div>
  );
}

function TypeBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium bg-primary/10 text-primary whitespace-nowrap shrink-0">
      {label}
    </span>
  );
}

function CriticalIssuesPanel({
  orders,
  path,
}: {
  orders: WorkOrder[];
  path: string;
}) {
  const CRITICAL_LOCATIONS = ["Main HQ", "West Campus", "North Logistics"];
  const rows =
    orders.length > 0
      ? orders.slice(0, 3).map((o, i) => ({
          id: o.id,
          title: o.title,
          location: o.locationName ?? CRITICAL_LOCATIONS[i] ?? "—",
          time: relativeTime(o.updatedAt),
        }))
      : [];

  return (
    <SectionCard
      title="Critical Issues"
      subtitle="Unresolved safety or operations anomalies needing instant dispatch"
      noPadding
    >
      <div className="divide-y divide-border">
        {rows.map((row) => (
          <Link
            key={row.id}
            to={`${path}/${row.id}`}
            className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition-colors"
          >
            <span className="rounded px-2 py-0.5 text-[11px] font-bold bg-destructive/10 text-destructive">
              CRITICAL
            </span>
            <span className="flex-1 text-[13px] font-medium text-foreground truncate">
              {row.title}
            </span>
            <span className="shrink-0 text-[13px] text-muted-foreground hidden sm:block">
              {row.location}
            </span>
            <span className="shrink-0 text-[12px] text-muted-foreground">
              {row.time}
            </span>
          </Link>
        ))}
      </div>
    </SectionCard>
  );
}

function VendorSLAPanel() {
    return (
      <SectionCard
        title="Vendor SLA Compliance"
        subtitle="Contract response/resolution health"
      >
        <p className="text-sm text-muted-foreground">
          Vendor SLA performance is not available from the dashboard API.
        </p>
      </SectionCard>
    );
}

function StatusBreakdownPanel({ workOrders }: { workOrders: WorkOrder[] }) {
  const STATUS_COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--warning)",
    "var(--success)",
  ];
  const STATUS_LABELS = ["Open", "In Progress", "On Hold", "Completed"];
  const STATUS_KEYS = ["open", "in_progress", "pending_completion", "completed"];

  const counts = STATUS_KEYS.map(
    (key) =>
      workOrders.filter((o) =>
        key === "completed" ? o.status === "completed" : o.status === key,
      ).length,
  );
  // Fallback to static if no data
  const displayCounts = counts;
  const total = Math.max(
    displayCounts.reduce((a, b) => a + b, 0),
    1,
  );

  return (
    <SectionCard
      title="Work Order Status Breakdown"
      subtitle="Current status of all open tickets"
    >
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        {displayCounts.map((count, i) => (
          <span
            key={STATUS_LABELS[i]}
            style={{
              backgroundColor: STATUS_COLORS[i],
              width: `${(count / total) * 100}%`,
            }}
          />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
        {displayCounts.map((count, i) => (
          <span
            key={STATUS_LABELS[i]}
            className="flex items-center gap-1.5 text-[13px] text-muted-foreground"
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[i] }}
            />
            {STATUS_LABELS[i]}:{" "}
            <strong className="text-foreground">{count}</strong>
          </span>
        ))}
      </div>
    </SectionCard>
  );
}

function VendorDispatchPanel() {
    return (
      <SectionCard
        title="Recent Vendor Dispatch"
        subtitle="Real-time activity log of assigned technicians"
      >
        <p className="text-sm text-muted-foreground">
          Vendor dispatch activity is not available from the dashboard API.
        </p>
      </SectionCard>
    );
}

function PendingApprovalsPanel({ approvalsPath }: { approvalsPath: string }) {
  if (!isDemoMode)
    return (
      <SectionCard
        title="Pending Approvals"
        subtitle="Financial and contract permissions waiting on Admin clearance"
      >
        <p className="text-sm text-muted-foreground">
          Pending approval records are not available from the dashboard API.
        </p>
      </SectionCard>
    );
  return (
    <SectionCard
      title="Pending Approvals"
      subtitle="Financial and contract permissions waiting on Admin clearance"
      noPadding
      demoData
    >
      <div className="divide-y divide-border">
        {PENDING_APPROVALS_STATIC.map((row) => (
          <div key={row.id} className="px-5 py-3">
            <div className="flex items-start gap-3">
              <TypeBadge label={row.type} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-foreground leading-snug">
                  {row.title}
                </p>
                <p className="text-[12px] text-muted-foreground">
                  {row.requester}
                </p>
              </div>
              <span className="shrink-0 text-[12px] text-muted-foreground">
                {row.time}
              </span>
            </div>
            <div className="mt-2 flex justify-end gap-2">
              <Link
                to={`${approvalsPath}?highlight=${row.id}`}
                className="rounded px-3 py-1 text-[12px] font-medium text-muted-foreground hover:bg-muted/60 transition-colors"
              >
                Review
              </Link>
              <Link
                to={`${approvalsPath}/${row.id}`}
                className="rounded bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-foreground hover:bg-primary-hover transition-colors"
              >
                Approve
              </Link>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function InventoryWarningsPanel() {
  if (!isDemoMode)
    return (
      <SectionCard
        title="Inventory Level Warnings"
        subtitle="Replacement items below minimal safety stock threshold"
      >
        <p className="text-sm text-muted-foreground">
          Inventory warnings are not available from the dashboard API.
        </p>
      </SectionCard>
    );
  return (
    <SectionCard
      title="Inventory Level Warnings"
      subtitle="Replacement items below minimal safety stock threshold"
      noPadding
      demoData
    >
      <div className="divide-y divide-border">
        {INVENTORY_WARNINGS.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 px-5 py-3"
          >
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-foreground">
                {item.item}
              </p>
              <p className="text-[12px] text-muted-foreground">{item.detail}</p>
            </div>
            <span
              className="shrink-0 rounded px-2 py-0.5 text-[11px] font-bold"
              style={{ backgroundColor: item.bg, color: item.color }}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function RecentActivityPanel({
  orders,
  path,
}: {
  orders: WorkOrder[];
  path: string;
}) {
  const rows =
    orders.length > 0
      ? orders.slice(0, 8).map((o, i) => ({
          id: o.id,
          text: o.title,
          time: RECENT_ACTIVITY_STATIC[i]?.time ?? "Recently",
          user: RECENT_ACTIVITY_STATIC[i]?.user ?? "SD",
          userBg:
            RECENT_ACTIVITY_STATIC[i]?.userBg ?? "var(--primary, #4f46e5)",
        }))
      : isDemoMode
      ? RECENT_ACTIVITY_STATIC
      : [];

  return (
    <SectionCard
      title="Recent Organization Activity"
      subtitle="Complete audit trail of system events across all facilities"
      noPadding
      demoData={isDemoMode && orders.length === 0}
    >
      <div className="divide-y divide-border">
        {rows.map((row) => (
          <Link
            key={row.id}
            to={`${path}/${row.id}`}
            className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition-colors"
          >
            <span className="flex-1 text-[13px] text-foreground">
              {row.text}
            </span>
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{ backgroundColor: row.userBg }}
            >
              {row.user}
            </span>
            <span className="shrink-0 text-[12px] text-muted-foreground w-14 text-right">
              {row.time}
            </span>
          </Link>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export function AdminDashboard() {
  const [_range] = useState<DashboardDateRange>("30d");
  const user = useAuthStore((state) => state.user);
  const {
    activeWorkOrders,
    workOrdersInRange,
    stats,
    reportTrends,
    isLoading,
    error,
    refetch,
  } = useRoleDashboardDateRange("30d");
  const facilitiesQuery = useQuery({
    queryKey: ["dashboard", "facility-statistics", user?.id],
    queryFn: facilitiesApi.statistics,
    enabled: Boolean(user?.id),
    staleTime: 60_000,
    retry: false,
  });
  const workOrdersPath = usePortalPath("work-orders");
  const approvalsPath = usePortalPath("approvals");
  const critical = useMemo(
    () => activeWorkOrders.filter((o) => o.priority === "critical").slice(0, 3),
    [activeWorkOrders],
  );
  const highPriorityCount = useMemo(
    () =>
      activeWorkOrders.filter(
        (order) => order.priority === "high" || order.priority === "critical",
      ).length,
    [activeWorkOrders],
  );
  // Demo cards and panels must use the same local collection. The report
  // query is disabled in demo mode, so an old persisted summary can otherwise
  // leave the KPI at zero while the active-work-order panels contain data.
  const displayStats = stats;
  const trendData = useMemo(() => {
    if (reportTrends.length > 0)
      return reportTrends.map((point) => ({
        month: point.period,
        created: point.created,
        completed: point.completed,
      }));
    const buckets = new Map<
      string,
      { month: string; created: number; completed: number }
    >();
    workOrdersInRange.forEach((order) => {
      const month = new Intl.DateTimeFormat(undefined, {
        month: "short",
      }).format(order.createdAt);
      const item = buckets.get(month) ?? { month, created: 0, completed: 0 };
      item.created += 1;
      if (order.status === "completed") item.completed += 1;
      buckets.set(month, item);
    });
    return [...buckets.values()];
  }, [reportTrends, workOrdersInRange]);
  const categoryData = useMemo(() => {
    const palette = [
      "var(--chart-1)",
      "var(--chart-2)",
      "var(--chart-3)",
      "var(--chart-4)",
      "var(--chart-5)",
    ];
    const counts = new Map<string, number>();
    workOrdersInRange.forEach((order) =>
      counts.set(
        order.category || "Uncategorised",
        (counts.get(order.category || "Uncategorised") ?? 0) + 1,
      ),
    );
    return [...counts.entries()].map(([name, value], index) => ({
      name,
      value,
      fill: palette[index % palette.length],
    }));
  }, [workOrdersInRange]);

  if (isLoading) return <PageLoader label="Loading dashboard data..." />;
  if (error)
    return (
      <PageError
        title="Dashboard unavailable"
        message={
          error instanceof Error
            ? error.message
            : "Unable to load dashboard data."
        }
        onRetry={() => void refetch()}
      />
    );

  return (
    <>
      <Navbar title="Dashboard" subtitle="Overview" />

      <div className="dashboard-page min-h-full bg-background px-6 py-6 pb-12">
        <HandWaveGreeting
          userName={user?.firstName}
          subtext="A clear overview of your organization’s maintenance operations."
          className="mb-6"
        />
        {/* ── KPI Row ── */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          <Link
            to={workOrdersPath}
            className="block rounded-xl transition-shadow hover:ring-2 hover:ring-primary/25 hover:shadow-md"
          >
            <KPICard
              title="Open Work Orders"
              value={displayStats.openWorkOrders}
              changeLabel={`${highPriorityCount} high priority`}
              icon="work-orders"
            />
          </Link>
          <Link
            to={workOrdersPath}
            className="block rounded-xl transition-shadow hover:ring-2 hover:ring-primary/25 hover:shadow-md"
          >
            <KPICard
              title="Critical Issues"
              value={critical.length}
              changeLabel="Requires attention"
              icon="overdue"
              variant="danger"
            />
          </Link>
          <KPICard
            title="SLA Compliance"
            value={`${displayStats.pmCompliance}%`}
            changeLabel="↑ Target > 92%"
            icon="compliance"
            variant="success"
          />
          <KPICard
            title="PM Due This Week"
            value={isDemoMode ? 3 : stats.dueToday}
            changeLabel="Preventive tasks"
            icon="calendar"
          />
          <KPICard
            title="Active Facilities"
            value={isDemoMode ? 4 : facilitiesQuery.data?.total ?? "—"}
            changeLabel={
              isDemoMode
                ? "Demo data"
                : facilitiesQuery.isLoading
                ? "Loading facilities"
                : "Live facility count"
            }
            icon="facilities"
          />
        </div>

        {/* ── Row 1: Critical Issues | Vendor SLA ── */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <CriticalIssuesPanel orders={critical} path={workOrdersPath} />
          </div>
          <div className="lg:col-span-5">
            <VendorSLAPanel />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <WorkOrderTrendChart data={trendData} />
          </div>
          <div className="lg:col-span-5">
            <CategoryBreakdownChart data={categoryData} />
          </div>
        </div>

        {/* ── Row 2: Status Breakdown | Vendor Dispatch ── */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <StatusBreakdownPanel workOrders={workOrdersInRange} />
          </div>
          <div className="lg:col-span-5">
            <VendorDispatchPanel />
          </div>
        </div>

        {/* ── Row 3: Pending Approvals | Inventory Warnings ── */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <PendingApprovalsPanel approvalsPath={approvalsPath} />
          </div>
          <div className="lg:col-span-5">
            <InventoryWarningsPanel />
          </div>
        </div>

        {/* ── Row 4: Full-width Recent Activity ── */}
        <RecentActivityPanel orders={workOrdersInRange} path={workOrdersPath} />
      </div>
    </>
  );
}

function relativeTime(value: Date) {
  const minutes = Math.max(
    1,
    Math.round((Date.now() - new Date(value).getTime()) / 60000),
  );
  return minutes < 60 ? `${minutes}m ago` : `${Math.round(minutes / 60)}h ago`;
}

// suppress unused lint warnings
void CheckCircle2;
void ClipboardList;
void Wrench;
void ShieldAlert;
void Package;
void Settings;
void AlertTriangle;
void BarChart3;
void DASHBOARD_RANGE_LABELS;
