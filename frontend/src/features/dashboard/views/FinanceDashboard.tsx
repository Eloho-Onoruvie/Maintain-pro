import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  FileText,
  ScrollText,
  DollarSign,
  AlertTriangle,
  Target,
  Clock,
  ReceiptText,
} from "lucide-react";
import { AppHeader as Navbar } from "@/components/navigation/Navbar";
import { KPICard } from "@/features/dashboard/components/StatCard";
import { CostTrendChart } from "@/features/dashboard/components/DashboardWidgets";
import { useRoleDashboardDateRange } from "@/features/dashboard/hooks/useRoleDashboardDateRange";
import { computeFinanceDashboardStats } from "@/features/dashboard/utils/roleScope";
import { usePortalPath } from "@/hooks/usePortal";
import { useAuthStore } from "@/app/store";
import type { WorkOrder } from "@/types/common.types";
import { invoicesService } from "@/features/finance/services/invoices.service";
import { HandWaveGreeting } from "@/components/ui/HandWaveGreeting";

// ─── Static placeholder data matching Figma ──────────────────────────────────

const PENDING_APPROVALS_STATIC = [
  {
    id: "1",
    type: "Vendor Contract",
    vendor: "Apex Elevator Co.",
    amount: "$12,400",
    time: "2h ago",
  },
  {
    id: "2",
    type: "Asset Purchase",
    vendor: "Pro HVAC Solutions",
    amount: "$4,200",
    time: "4h ago",
  },
  {
    id: "3",
    type: "Work Order (Over $1k)",
    vendor: "Sarah Jenkins (FM)",
    amount: "$1,850",
    time: "1d ago",
  },
  {
    id: "4",
    type: "Inventory Restock",
    vendor: "John Doe (Inv)",
    amount: "$1,100",
    time: "1d ago",
  },
  {
    id: "5",
    type: "Emergency Plumbing",
    vendor: "Reliable Plumbing",
    amount: "$950",
    time: "2d ago",
  },
];

const SLA_VENDORS = [
  {
    name: "Apex Elevator Co.",
    service: "Vertical Transport • $8,500/mo",
    pct: 98,
    color: "var(--success)",
  },
  {
    name: "Pro HVAC Solutions",
    service: "Climate Control Systems • $14,200/mo",
    pct: 91,
    color: "var(--warning)",
  },
  {
    name: "Reliable Plumbing",
    service: "Water & Waste Management • $6,100/mo",
    pct: 86,
    color: "var(--destructive)",
  },
];

const QUOTATIONS_STATIC = [
  {
    id: "1",
    vendor: "Pro HVAC Solutions",
    desc: "Server Room B Diagnostic Survey",
    amount: "$450.00",
    status: "Awaiting Action",
    statusColor: "var(--warning)",
    statusBg: "var(--warning-muted)",
  },
  {
    id: "2",
    vendor: "Reliable Plumbing",
    desc: "Toilet Stack replacement (Lobby)",
    amount: "$280.00",
    status: "Pre-Approved",
    statusColor: "var(--success)",
    statusBg: "var(--success-muted)",
  },
  {
    id: "3",
    vendor: "GateMasters Inc.",
    desc: "Lobby Front Security Gate Repair",
    amount: "$1,200.00",
    status: "Under Review",
    statusColor: "var(--muted-foreground)",
    statusBg: "var(--accent)",
  },
  {
    id: "4",
    vendor: "SafeFire Corp",
    desc: "Quarterly Fire System Testing Schedule",
    amount: "$850.00",
    status: "Pre-Approved",
    statusColor: "var(--success)",
    statusBg: "var(--success-muted)",
  },
];

const BILLING_INFO = {
  plan: "MaintainPro Enterprise",
  licenses: "150 Active Seats",
  nextInvoice: "Feb 15, 2026",
};

const FINANCIAL_EVENTS = [
  {
    id: "1",
    event: "Invoice processed: Elevator PM contract",
    detail: "Logged under: Apex Elevator",
    time: "1h ago",
  },
  {
    id: "2",
    event: "Quotation updated: Thermostat repair",
    detail: "Logged under: Pro HVAC Solutions",
    time: "3h ago",
  },
  {
    id: "3",
    event: "Approval rejected: Luxury office decor plan",
    detail: "Logged under: Dave Miller",
    time: "1d ago",
  },
  {
    id: "4",
    event: "Contract finalized: West Warehouses",
    detail: "Logged under: Reliable Plumbing",
    time: "2d ago",
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
    <div className="rounded-xl border border-border bg-card shadow-none">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
        <div className="mt-0.5 flex items-center gap-2">
          <p className="text-[13px] text-muted-foreground">{subtitle}</p>
          {demoData && (
            <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warning">
              Demo
            </span>
          )}
        </div>
      </div>
      <div className={noPadding ? "" : "px-5 py-4"}>{children}</div>
    </div>
  );
}

function TypeBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium bg-primary/10 text-primary whitespace-nowrap">
      {label}
    </span>
  );
}

function ApprovalRows({
  approvalsPath,
  demoData,
}: {
  approvalsPath: string;
  demoData: boolean;
}) {
  if (!demoData)
    return (
      <p className="px-5 py-4 text-sm text-muted-foreground">
        No pending approval records are available yet.
      </p>
    );
  return (
    <div className="divide-y divide-border">
      {PENDING_APPROVALS_STATIC.map((row) => (
        <div key={row.id} className="flex items-center gap-3 px-5 py-3">
          <TypeBadge label={row.type} />
          <span className="flex-1 truncate text-[13px] text-muted-foreground">
            ...{row.vendor}
          </span>
          <span className="text-[13px] font-semibold text-foreground w-20 text-right">
            {row.amount}
          </span>
          <span className="w-14 text-right text-[12px] text-muted-foreground">
            {row.time}
          </span>
          <Link
            to={approvalsPath}
            className="rounded px-3 py-1 text-[12px] font-medium text-muted-foreground hover:bg-accent transition-colors"
          >
            Review
          </Link>
          <Link
            to={approvalsPath}
            className="rounded bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Approve
          </Link>
        </div>
      ))}
    </div>
  );
}

function SLAVendorRows({ demoData }: { demoData: boolean }) {
  if (!demoData)
    return (
      <p className="px-5 py-4 text-sm text-muted-foreground">
        SLA performance data is not available yet.
      </p>
    );
  return (
    <div className="divide-y divide-border">
      {SLA_VENDORS.map((v) => (
        <div key={v.name} className="px-5 py-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[13px] font-semibold text-foreground">
                {v.name}
              </p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {v.service}
              </p>
            </div>
            <span
              className="rounded px-2 py-0.5 text-[12px] font-semibold whitespace-nowrap"
              style={{ backgroundColor: `${v.color}18`, color: v.color }}
            >
              {v.pct}% Compliance
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuotationRows({ demoData }: { demoData: boolean }) {
  if (!demoData)
    return (
      <p className="px-5 py-4 text-sm text-muted-foreground">
        No quotation records are available yet.
      </p>
    );
  return (
    <div className="divide-y divide-border">
      {QUOTATIONS_STATIC.map((q) => (
        <div key={q.id} className="flex items-center gap-3 px-5 py-4">
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-foreground">
              {q.vendor}
            </p>
            <p className="mt-0.5 text-[12px] text-muted-foreground truncate">
              {q.desc}
            </p>
          </div>
          <span className="text-[13px] font-semibold text-foreground w-20 text-right">
            {q.amount}
          </span>
          <span
            className="rounded px-2.5 py-0.5 text-[12px] font-medium whitespace-nowrap"
            style={{ backgroundColor: q.statusBg, color: q.statusColor }}
          >
            {q.status}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export function FinanceDashboard() {
  const user = useAuthStore((state) => state.user);
  const approvalsPath = usePortalPath("approvals");
  const { workOrdersInRange } = useRoleDashboardDateRange("30d");
  const invoicesQuery = useQuery({
    queryKey: ["dashboard", "invoices", user?.id],
    queryFn: invoicesService.list,
    enabled: Boolean(user?.id),
    staleTime: 60_000,
    retry: false,
  });
  const stats = useMemo(
    () =>
      computeFinanceDashboardStats(
        workOrdersInRange,
        invoicesQuery.data ?? [],
      ),
    [workOrdersInRange, invoicesQuery.data],
  );
  const costTrendData = useMemo(() => {
    const buckets = new Map<string, number>();
    workOrdersInRange.forEach((order) => {
      const month = new Intl.DateTimeFormat(undefined, {
        month: "short",
      }).format(order.createdAt);
      const cost = order.actualCost ?? order.estimatedCost ?? 0;
      buckets.set(month, (buckets.get(month) ?? 0) + cost);
    });
    return [...buckets.entries()].map(([month, cost]) => ({ month, cost }));
  }, [workOrdersInRange]);

  return (
    <>
      <Navbar title="Dashboard" subtitle="Finance" />

      <div className="dashboard-page min-h-full bg-background px-6 py-6 pb-12">
        <HandWaveGreeting
          userName={user?.firstName}
          subtext="Review approvals, invoices, contracts, and financial performance."
          className="mb-6"
        />
        {/* ── KPI Row ── */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          <Link to={approvalsPath}>
            <KPICard
              title="Pending Approvals"
              value={stats.pendingApprovals}
              changeLabel="Awaiting signature"
              icon="overdue"
              variant="warning"
            />
          </Link>
          {/* TODO: these financial metrics await dedicated quotation, contract, and billing data sources. */}
          <KPICard
            title="Open Quotations"
            value="—"
            changeLabel="Quotation API pending"
            icon="compliance"
          />
          <KPICard
            title="Active Contracts"
            value="—"
            changeLabel="Contract API pending"
            icon="completed"
            variant="success"
          />
          <KPICard
            title="Monthly Obligations"
            value="—"
            changeLabel="Billing summary API pending"
            icon="cost"
          />
          <KPICard
            title="Outstanding Invoices"
            value={stats.pendingInvoices}
            changeLabel="Critical attention required"
            icon="overdue"
            variant="danger"
          />
        </div>

        {/* ── Row 1: Pending Approvals | Contract SLA ── */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <SectionCard
              title="Pending Financial Approvals"
              subtitle="Review and audit operational expenses before confirming authorization"
              noPadding
            >
              <ApprovalRows
                approvalsPath={approvalsPath}
                demoData={false}
              />
            </SectionCard>
          </div>

          <div className="lg:col-span-5">
            <SectionCard
              title="Contract SLA Status"
              subtitle="Overview of monthly values and target compliance"
              noPadding
            >
              <SLAVendorRows demoData={false} />
            </SectionCard>
          </div>
        </div>

        {/* ── Row: Maintenance Cost Trend ── */}
        <div className="mb-6">
          <CostTrendChart data={costTrendData} />
        </div>

        {/* ── Row 2: Recent Quotations | Billing + Event History ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <SectionCard
              title="Recent Quotations"
              subtitle="Sourced vendor offers currently under pricing assessment"
              noPadding
            >
              <QuotationRows demoData={false} />
            </SectionCard>
          </div>

          <div className="flex flex-col gap-6">
            {/* Subscription & Billing */}
            <SectionCard
              title="Subscription & Billing"
              subtitle="Enterprise system plan details"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-muted-foreground">Current Plan</span>
                  <span className="font-semibold text-primary">
                    "—"
                  </span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-muted-foreground">Active Licenses</span>
                  <span className="font-semibold text-foreground">
                    "—"
                  </span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-muted-foreground">
                    Next Invoice Date
                  </span>
                  <span className="font-semibold text-foreground">
                    "—"
                  </span>
                </div>
              </div>
            </SectionCard>

            {/* Financial Event History */}
            <SectionCard
              title="Financial Event History"
              subtitle="Audit records of recent ledger changes"
            >
              <div className="space-y-3">
                {([] as typeof FINANCIAL_EVENTS).map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-foreground leading-snug">
                        {ev.event}
                      </p>
                      <p className="mt-0.5 text-[12px] text-muted-foreground">
                        {ev.detail}
                      </p>
                    </div>
                    <span className="shrink-0 text-[12px] text-muted-foreground">
                      {ev.time}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </>
  );
}

// suppress unused icon lint warnings
void ClipboardList;
void FileText;
void ScrollText;
void DollarSign;
void AlertTriangle;
void Target;
void Clock;
void ReceiptText;
