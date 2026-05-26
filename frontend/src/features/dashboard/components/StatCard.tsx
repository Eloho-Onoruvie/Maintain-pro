

import { cn } from '@/utils/helpers'
import { Card, CardContent } from '@/components/ui/card'
import { 
  TrendingUp, 
  TrendingDown,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Wrench,
  Users,
  Target
} from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: 'work-orders' | 'clock' | 'completed' | 'overdue' | 'cost' | 'assets' | 'vendors' | 'compliance'
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

const iconMap = {
  'work-orders': ClipboardList,
  'clock': Clock,
  'completed': CheckCircle2,
  'overdue': AlertTriangle,
  'cost': DollarSign,
  'assets': Wrench,
  'vendors': Users,
  'compliance': Target,
}

const variantStyles = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-status-completed/10 text-status-completed',
  warning: 'bg-status-high/10 text-status-high',
  danger: 'bg-status-critical/10 text-status-critical',
}

export function KPICard({ title, value, change, changeLabel, icon, variant = 'default' }: KPICardProps) {
  const Icon = iconMap[icon]
  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold text-foreground">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1 text-xs">
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 text-status-completed" />
                ) : isNegative ? (
                  <TrendingDown className="h-3 w-3 text-status-critical" />
                ) : null}
                <span className={cn(
                  isPositive && 'text-status-completed',
                  isNegative && 'text-status-critical',
                  !isPositive && !isNegative && 'text-muted-foreground'
                )}>
                  {isPositive && '+'}{change}%
                </span>
                {changeLabel && (
                  <span className="text-muted-foreground">{changeLabel}</span>
                )}
              </div>
            )}
          </div>
          <div className={cn('rounded-lg p-2.5', variantStyles[variant])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
