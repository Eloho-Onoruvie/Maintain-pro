import { Calendar, Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DASHBOARD_RANGE_LABELS,
  type DashboardDateRange,
} from '@/features/dashboard/utils/dashboardDateRange'

interface DashboardDateRangeControlsProps {
  range: DashboardDateRange
  onRangeChange: (range: DashboardDateRange) => void
  onExport?: () => void
  exportLabel?: string
  layout?: 'desktop' | 'mobile' | 'both'
}

export function DashboardDateRangeControls({
  range,
  onRangeChange,
  onExport,
  exportLabel = 'Export dashboard',
  layout = 'both',
}: DashboardDateRangeControlsProps) {
  const desktop = (
    <div className="hidden items-center gap-2 sm:flex">
        {(['7d', '30d', '90d'] as const).map((key) => (
          <Button
            key={key}
            variant={range === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => onRangeChange(key)}
            aria-label={`Filter dashboard to ${DASHBOARD_RANGE_LABELS[key]}`}
            aria-pressed={range === key}
          >
            {key === '30d' ? (
              <>
                <Calendar className="mr-2 h-4 w-4" aria-hidden />
                {DASHBOARD_RANGE_LABELS[key]}
              </>
            ) : (
              key.toUpperCase()
            )}
          </Button>
        ))}
        {onExport ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            aria-label={exportLabel}
          >
            <Download className="h-4 w-4" aria-hidden />
            <span className="sr-only">{exportLabel}</span>
          </Button>
        ) : null}
    </div>
  )

  const mobile = (
    <div className="page-body flex flex-wrap gap-2 pb-0 sm:hidden">
        {(['7d', '30d', '90d'] as const).map((key) => (
          <Button
            key={key}
            variant={range === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => onRangeChange(key)}
            aria-pressed={range === key}
          >
            {DASHBOARD_RANGE_LABELS[key]}
          </Button>
        ))}
        {onExport ? (
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" aria-hidden />
            Export
          </Button>
        ) : null}
    </div>
  )

  if (layout === 'desktop') return desktop
  if (layout === 'mobile') return mobile
  return (
    <>
      {desktop}
      {mobile}
    </>
  )
}
