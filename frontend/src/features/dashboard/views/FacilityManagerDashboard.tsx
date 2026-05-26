

import { AppHeader as Navbar } from '@/components/navigation/Navbar'
import { 
   
   
  // PMSchedule, 
  // InventoryAlerts,
  WorkOrderTrendChart,
  CategoryBreakdownChart,
  CostTrendChart,
  // VendorPerformance
} from '@/features/dashboard/components/DashboardWidgets'
import { KPICard } from '@/features/dashboard/components/StatCard'
import {WorkOrderList } from '@/features/dashboard/components/ActivityFeed'
import { 
  mockWorkOrders, 
  // mockPMs, 
  // mockInventory, 
  // mockVendors,
  dashboardStats 
} from '../services/dashboard.service'
import { Button } from '@/components/ui/button'
import { Calendar, Download, Filter } from 'lucide-react'

export function FacilityManagerDashboard() {
  return (
    <>
      <Navbar 
        title="Dashboard" 
        subtitle="Facility Manager Overview"
        actions={
          <div className="hidden items-center gap-2 sm:flex">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Last 30 Days
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              <span className="sr-only">Export</span>
            </Button>
          </div>
        }
      />
      <div className="p-4 lg:p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Open Work Orders"
            value={dashboardStats.openWorkOrders}
            change={12}
            changeLabel="vs last month"
            icon="work-orders"
            variant="default"
          />
          <KPICard
            title="Overdue Tasks"
            value={dashboardStats.overdueWorkOrders}
            change={-8}
            changeLabel="vs last month"
            icon="overdue"
            variant="danger"
          />
          <KPICard
            title="PM Compliance"
            value={`${dashboardStats.pmCompliance}%`}
            change={5}
            changeLabel="vs last month"
            icon="compliance"
            variant="success"
          />
          <KPICard
            title="Monthly Spend"
            value={`$${dashboardStats.monthlySpend.toLocaleString()}`}
            change={-3}
            changeLabel="vs last month"
            icon="cost"
            variant="default"
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <WorkOrderTrendChart />
          </div>
          <CategoryBreakdownChart />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {/* Work Orders */}
          <div className="xl:col-span-2">
            <WorkOrderList 
              workOrders={mockWorkOrders.filter(wo => wo.status !== 'completed')} 
              title="Active Work Orders"
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* <PMSchedule schedules={mockPMs} /> */}
            {/* <InventoryAlerts items={mockInventory} /> */}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid gap-4 lg:grid-cols-2">
          <CostTrendChart />
          {/* <VendorPerformance vendors={mockVendors} /> */}
        </div>
      </div>
    </>
  )
}
