

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { workOrderTrendData, categoryBreakdownData, costByMonthData } from '../services/dashboard.service'

interface ChartCardProps {
  title: string
  children: React.ReactNode
}

function ChartCard({ title, children }: ChartCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function WorkOrderTrendChart() {
  return (
    <ChartCard title="Work Order Trends">
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={workOrderTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="var(--muted-foreground)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="var(--muted-foreground)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--foreground)',
              }}
            />
            <Area
              type="monotone"
              dataKey="created"
              name="Created"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCreated)"
            />
            <Area
              type="monotone"
              dataKey="completed"
              name="Completed"
              stroke="var(--chart-2)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCompleted)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export function CategoryBreakdownChart() {
  return (
    <ChartCard title="Work Orders by Category">
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryBreakdownData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {categoryBreakdownData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              cursor={{ fill: 'var(--accent)', opacity: 0.16 }}
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--foreground)',
              }}
              formatter={(value: number) => [`${value}%`, 'Share']}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span style={{ color: 'var(--foreground)', fontSize: '12px' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export function CostTrendChart() {
  return (
    <ChartCard title="Monthly Maintenance Cost">
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={costByMonthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="var(--muted-foreground)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="var(--muted-foreground)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              cursor={{ fill: 'var(--accent)', opacity: 0.16 }}
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--foreground)',
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Cost']}
            />
            <Bar 
              dataKey="cost" 
              fill="var(--chart-1)" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
