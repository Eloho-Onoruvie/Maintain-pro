import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { queryTiming } from '@/lib/query-options'
import { reportsApi, type ReportQuery, type MaintenanceSummary, type TrendPoint, type WorkOrderReportRow, type Paginated, type PreventiveMaintenanceReport, type SlaComplianceReport, type VendorPerformanceReport } from '../api/reports.api'
import { isDemoMode } from '@/config/runtime'
import { mockWorkOrders } from '@/features/dashboard/services/dashboard.service'

function shiftDemoDateToToday(value?: Date) {
  if (!value) return undefined
  const source = new Date(value)
  const sourceAnchor = new Date('2024-01-20T12:00:00.000Z')
  const currentAnchor = new Date()
  currentAnchor.setHours(12, 0, 0, 0)
  return new Date(currentAnchor.getTime() - (sourceAnchor.getTime() - source.getTime()))
}

export function useReports(query: ReportQuery) {
  type ReportPayload = { summary: MaintenanceSummary; trends: TrendPoint[]; workOrders: Paginated<WorkOrderReportRow>; preventiveMaintenance: PreventiveMaintenanceReport | null }
  const report = useQuery<ReportPayload>({
    queryKey: ['reports', query],
    queryFn: async () => {
      if (isDemoMode) {
        const filtered = mockWorkOrders.filter((item) => (!query.priority || item.priority === query.priority) && (!query.status || item.status === query.status))
        const completed = filtered.filter((item) => item.status === 'completed').length
        return {
          summary: { startDate: query.startDate, endDate: query.endDate, totalWorkOrders: filtered.length, completedWorkOrders: completed, openWorkOrders: filtered.length - completed, overdueWorkOrders: 0, completionRate: filtered.length ? Math.round((completed / filtered.length) * 100) : 0, byPriority: {}, byStatus: {} },
          trends: [{ period: 'Jan', created: 18, completed: 14 }, { period: 'Feb', created: 24, completed: 20 }, { period: 'Mar', created: 16, completed: 15 }, { period: 'Apr', created: 29, completed: 23 }, { period: 'May', created: 21, completed: 19 }, { period: 'Jun', created: 26, completed: 24 }],
          workOrders: { items: filtered.map((item) => ({ id: item.id, title: item.title, status: item.status, priority: item.priority, serviceCategory: item.category, facilityId: item.facilityId ?? '', locationId: item.locationId, assetId: item.assetId, createdAt: shiftDemoDateToToday(item.createdAt)!.toISOString(), dueDate: shiftDemoDateToToday(item.dueDate)?.toISOString(), completedAt: item.status === 'completed' ? shiftDemoDateToToday(item.updatedAt)?.toISOString() : undefined })), page: 1, pageSize: filtered.length || 1, total: filtered.length, totalPages: 1 },
          preventiveMaintenance: null,
        }
      }
      const [summary, trends, workOrders, preventiveMaintenance] = await Promise.all([
        reportsApi.summary(query),
        reportsApi.trends(query),
        reportsApi.workOrders(query),
        reportsApi.preventiveMaintenance(query),
      ])
      return { summary, trends, workOrders, preventiveMaintenance }
    },
    ...queryTiming.report,
    enabled: true,
    placeholderData: keepPreviousData,
    retry: false,
  })

  return {
    summary: report.data?.summary ?? null,
    trends: report.data?.trends ?? [],
    workOrders: report.data?.workOrders ?? null,
    preventiveMaintenance: report.data?.preventiveMaintenance ?? null,
    loading: report.isLoading,
    error: report.error instanceof Error ? report.error.message : report.error ? 'Unable to load reports' : null,
  }
}

export function useSlaComplianceReport(query: ReportQuery) {
  return useQuery<SlaComplianceReport>({ queryKey: ['reports', 'sla-compliance', query], queryFn: () => reportsApi.slaCompliance(query), ...queryTiming.report, enabled: !isDemoMode, retry: false })
}

export function useVendorPerformanceReport(query: ReportQuery) {
  return useQuery<VendorPerformanceReport>({ queryKey: ['reports', 'vendor-performance', query], queryFn: () => reportsApi.vendorPerformance(query), ...queryTiming.report, enabled: !isDemoMode, retry: false })
}
