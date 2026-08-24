import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { queryTiming } from '@/lib/query-options'
import { reportsApi, type ReportQuery } from '../api/reports.api'

export function useReports(query: ReportQuery) {
  const report = useQuery({
    queryKey: ['reports', query],
    queryFn: async () => {
      const [summary, trends, workOrders, preventiveMaintenance] = await Promise.all([
        reportsApi.summary(query),
        reportsApi.trends(query),
        reportsApi.workOrders(query),
        reportsApi.preventiveMaintenance(query),
      ])
      return { summary, trends, workOrders, preventiveMaintenance }
    },
    ...queryTiming.report,
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
  return useQuery({ queryKey: ['reports', 'sla-compliance', query], queryFn: () => reportsApi.slaCompliance(query), ...queryTiming.report, retry: false })
}

export function useVendorPerformanceReport(query: ReportQuery) {
  return useQuery({ queryKey: ['reports', 'vendor-performance', query], queryFn: () => reportsApi.vendorPerformance(query), ...queryTiming.report, retry: false })
}
