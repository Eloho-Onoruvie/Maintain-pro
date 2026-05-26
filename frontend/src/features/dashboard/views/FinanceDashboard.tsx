import { AppHeader as Navbar } from "@/components/navigation/Navbar";

import { KPICard } from "../components/StatCard";

import { CostTrendChart } from "../components/DashboardWidgets";

export function FinanceDashboard() {
  return (
    <>
      <Navbar
        title="Finance Dashboard"
        subtitle="Maintenance spend & approvals"
      />

      <div className="space-y-6 p-4 lg:p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KPICard title="Monthly Spend" value="$128,000" icon="cost" />

          <KPICard
            title="Pending Approvals"
            value={8}
            icon="overdue"
            variant="warning"
          />

          <KPICard
            title="Approved Invoices"
            value={34}
            icon="compliance"
            variant="success"
          />

          <KPICard title="Budget Remaining" value="$72,000" icon="cost" />
        </div>

        <CostTrendChart />
      </div>
    </>
  );
}
