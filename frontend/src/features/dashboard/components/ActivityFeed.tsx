

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ArrowRight, Clock, MapPin } from 'lucide-react'
import { WorkOrder, WorkOrderPriority, WorkOrderStatus } from '@/types/common.types'
import { cn } from '@/utils/helpers'
import { Link } from 'react-router-dom'
import { usePortalPath } from '@/hooks/usePortal'

interface WorkOrderListProps {
  workOrders: WorkOrder[]
  title?: string
  showViewAll?: boolean
  maxItems?: number
}

const priorityStyles: Record<WorkOrderPriority, string> = {
  critical: 'bg-status-critical/10 text-status-critical border-status-critical/20',
  high: 'bg-status-high/10 text-status-high border-status-high/20',
  medium: 'bg-status-active/10 text-status-active border-status-active/20',
  low: 'bg-muted text-muted-foreground border-border',
}

const statusStyles: Record<WorkOrderStatus, string> = {
  open: 'bg-status-active/10 text-status-active',
  in_progress: 'bg-status-pending/10 text-status-pending',
  assigned: 'bg-status-active/10 text-status-active',
  verified: 'bg-status-completed/10 text-status-completed',
  pending: 'bg-status-high/10 text-status-high',
  closed: 'bg-muted text-muted-foreground',
  completed: 'bg-status-completed/10 text-status-completed',
  cancelled: 'bg-muted text-muted-foreground',
}

const statusLabels: Record<WorkOrderStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  assigned: "Assigned",
  verified: "Verified",
  pending: "Pending",
  closed: "Closed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function WorkOrderList({ workOrders, title = 'Recent Work Orders', showViewAll = true, maxItems = 5 }: WorkOrderListProps) {
  const workOrdersPath = usePortalPath('work-orders')
  const displayOrders = workOrders.slice(0, maxItems)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {showViewAll && (
          <Button variant="ghost" size="sm" asChild>
            <Link
              to={workOrdersPath}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {displayOrders.map((order) => (
            <Link
              key={order.id}
              to={`${workOrdersPath}/${order.id}`}
              className="flex items-start gap-4 p-4 transition-colors hover:bg-accent/50"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      {order.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono">{order.id}</span>
                      <span>•</span>
                      <span>{order.category}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn('shrink-0', priorityStyles[order.priority])}>
                    {order.priority}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 pt-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="line-clamp-1">{order.locationName}</span>
                  </div>
                  {order.dueDate && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Due {new Date(order.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={cn('text-xs', statusStyles[order.status])}>
                  {statusLabels[order.status]}
                </Badge>
                {order.assigneeName && (
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {order.assigneeName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
