

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AppHeader as Navbar } from '@/components/navigation/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Plus, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  LayoutGrid, 
  List,
  MoreVertical,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react'
import { mockWorkOrders } from '../services/workOrders.service'
import { WorkOrder, WorkOrderPriority, WorkOrderStatus } from '@/types/common.types'
import { cn } from '@/utils/helpers'

const priorityStyles: Record<WorkOrderPriority, string> = {
  critical: 'bg-status-critical/10 text-status-critical border-status-critical/20',
  high: 'bg-status-high/10 text-status-high border-status-high/20',
  medium: 'bg-status-active/10 text-status-active border-status-active/20',
  low: 'bg-muted text-muted-foreground border-border',
}

const statusStyles: Record<WorkOrderStatus, string> = {
  open: 'bg-status-active/10 text-status-active',
  assigned: 'bg-status-active/10 text-status-active',
  verified: 'bg-status-completed/10 text-status-completed',
  in_progress: 'bg-status-pending/10 text-status-pending',
  // Removed 'pending' as it's not a valid WorkOrderStatus
  closed: 'bg-muted text-muted-foreground',
  completed: 'bg-status-completed/10 text-status-completed',
  cancelled: 'bg-muted text-muted-foreground',
}

const statusLabels: Record<WorkOrderStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  assigned: "Assigned",
  verified: "Verified",
  closed: "Closed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function WorkOrders() {
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOrders = mockWorkOrders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter
    const matchesSearch = order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesPriority && matchesSearch
  })

  const stats = {
    total: mockWorkOrders.length,
    open: mockWorkOrders.filter(o => o.status === 'open').length,
    inProgress: mockWorkOrders.filter(o => o.status === 'in_progress').length,
    completed: mockWorkOrders.filter(o => o.status === 'completed').length,
  }

  return (
    <>
      <Navbar 
        title="Work Orders" 
        subtitle={`${stats.total} total work orders`}
        actions={
          <Button asChild>
            <Link to="/work-orders/new">
              <Plus className="mr-2 h-4 w-4" />
              New Work Order
            </Link>
          </Button>
        }
      />
      
      <div className="p-4 lg:p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-semibold">{stats.total}</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <List className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open</p>
                  <p className="text-2xl font-semibold">{stats.open}</p>
                </div>
                <div className="rounded-lg bg-status-active/10 p-2.5">
                  <AlertCircle className="h-5 w-5 text-status-active" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-semibold">{stats.inProgress}</p>
                </div>
                <div className="rounded-lg bg-status-pending/10 p-2.5">
                  <Clock className="h-5 w-5 text-status-pending" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-semibold">{stats.completed}</p>
                </div>
                <div className="rounded-lg bg-status-completed/10 p-2.5">
                  <CheckCircle2 className="h-5 w-5 text-status-completed" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search work orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-secondary"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-secondary">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px] bg-secondary">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'table' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('table')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('kanban')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'table' ? (
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
                  <TableHead className="text-muted-foreground w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="border-border">
                    <TableCell>
                      <Link to={`/work-orders/${order.id}`} className="block group">
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {order.title}
                        </p>
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
                      ) : (
                        <span className="text-sm text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.dueDate ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{new Date(order.dueDate).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">No due date</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/work-orders/${order.id}`}>View Details</Link>
                          </DropdownMenuItem>
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
        ) : (
          <KanbanView orders={filteredOrders} />
        )}
      </div>
    </>
  )
}

function KanbanView({ orders }: { orders: WorkOrder[] }) {
  const columns: { status: WorkOrderStatus; label: string }[] = [
    { status: 'open', label: 'Open' },
    { status: 'assigned', label: 'Assigned' },
    { status: 'completed', label: 'Completed' },
    { status: 'verified', label: 'Verified' },
    { status: 'closed', label: 'Closed' },
  ]

  return (
    <div className="grid gap-4 lg:grid-cols-6">
      {columns.map((column) => {
        const columnOrders = orders.filter(o => o.status === column.status)
        return (
          <div key={column.status} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-foreground">{column.label}</h3>
                <Badge variant="secondary" className="h-5 min-w-5 justify-center">
                  {columnOrders.length}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              {columnOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/work-orders/${order.id}`}
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
              ))}
              {columnOrders.length === 0 && (
                <div className="rounded-lg border border-dashed border-border p-4 text-center">
                  <p className="text-sm text-muted-foreground">No work orders</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
