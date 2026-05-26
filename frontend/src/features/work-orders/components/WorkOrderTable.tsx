import { Link } from 'react-router-dom'
import { MoreVertical, MapPin, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/utils/helpers'
import type { WorkOrder, WorkOrderPriority, WorkOrderStatus } from '@/types/common.types'

const priorityStyles: Record<WorkOrderPriority, string> = {
  critical: 'bg-status-critical/10 text-status-critical border-status-critical/20',
  high: 'bg-status-high/10 text-status-high border-status-high/20',
  medium: 'bg-status-active/10 text-status-active border-status-active/20',
  low: 'bg-muted text-muted-foreground border-border',
}
const statusStyles: Record<WorkOrderStatus, string> = {
  open: 'bg-status-active/10 text-status-active',
  assigned: 'bg-status-active/10 text-status-active',
  in_progress: 'bg-status-pending/10 text-status-pending',
  pending: 'bg-status-high/10 text-status-high',
  completed: 'bg-status-completed/10 text-status-completed',
  verified: 'bg-status-completed/10 text-status-completed',
  closed: 'bg-muted text-muted-foreground',
  cancelled: 'bg-muted text-muted-foreground',
}
const statusLabels: Record<WorkOrderStatus, string> = {
  open: 'Open', assigned: 'Assigned', in_progress: 'In Progress', pending: 'Pending',
  completed: 'Completed', verified: 'Verified', closed: 'Closed', cancelled: 'Cancelled',
}

interface Props { orders: WorkOrder[] }

export function WorkOrderTable({ orders }: Props) {
  return (
    <Card className="bg-card border-border">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground">Work Order</TableHead>
            <TableHead className="text-muted-foreground">Location</TableHead>
            <TableHead className="text-muted-foreground">Priority</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground">Assignee</TableHead>
            <TableHead className="text-muted-foreground">Due Date</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="border-border">
              <TableCell>
                <Link to={`/work-orders/${order.id}`} className="block group">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">{order.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="font-mono">{order.id}</span>
                    <span>•</span>
                    <span>{order.category}</span>
                  </div>
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="line-clamp-1">{order.locationName}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={cn('capitalize', priorityStyles[order.priority])}>
                  {order.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={cn('text-xs', statusStyles[order.status])}>
                  {statusLabels[order.status]}
                </Badge>
              </TableCell>
              <TableCell>
                {order.assigneeName ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {order.assigneeName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{order.assigneeName}</span>
                  </div>
                ) : <span className="text-sm text-muted-foreground">Unassigned</span>}
              </TableCell>
              <TableCell>
                {order.dueDate ? (
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{new Date(order.dueDate).toLocaleDateString()}</span>
                  </div>
                ) : <span className="text-sm text-muted-foreground">No due date</span>}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild><Link to={`/work-orders/${order.id}`}>View Details</Link></DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Assign</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
