import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/utils/helpers'
import { usePortalPath } from '@/hooks/usePortal'
import type { WorkOrder, WorkOrderPriority } from '@/types/common.types'

const priorityStyles: Record<WorkOrderPriority, string> = {
  critical: 'bg-status-critical/10 text-status-critical border-status-critical/20',
  high: 'bg-status-high/10 text-status-high border-status-high/20',
  medium: 'bg-status-active/10 text-status-active border-status-active/20',
  low: 'bg-muted text-muted-foreground border-border',
}

interface Props { order: WorkOrder }

export function WorkOrderCard({ order }: Props) {
  const workOrdersPath = usePortalPath('work-orders')

  return (
    <Link
      to={`${workOrdersPath}/${order.id}`}
      className="block rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent/50"
    >
      <div className="flex items-start justify-between gap-2">
        <Badge variant="outline" className={cn('capitalize text-xs', priorityStyles[order.priority])}>
          {order.priority}
        </Badge>
        <span className="text-xs text-muted-foreground font-mono">{order.id}</span>
      </div>
      <p className="mt-2 text-sm font-medium line-clamp-2">{order.title}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="line-clamp-1 max-w-[100px]">{order.locationName}</span>
        </div>
        {order.assigneeName && (
          <Avatar className="h-5 w-5">
            <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
              {order.assigneeName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </Link>
  )
}
