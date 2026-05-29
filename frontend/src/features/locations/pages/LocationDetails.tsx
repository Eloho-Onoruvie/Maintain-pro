import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  Layers,
  MapPin,
  Home,
  Wrench,
  Pencil,
  Plus,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  mockLocations,
  mockWorkOrders,
  mockAssets,
} from '@/features/dashboard/services/dashboard.service'
import { EditLocationDialog } from '@/features/locations/components/EditLocationDialog'
import { usePortalPath } from '@/hooks/usePortal'
import { cn } from '@/utils/helpers'
import type { Location } from '@/types/common.types'

const typeIcons: Record<string, React.ElementType> = {
  site: Home,
  building: Building2,
  floor: Layers,
  room: MapPin,
  zone: MapPin,
}

const typeBadgeColors: Record<string, string> = {
  site: 'bg-purple-400/10 text-purple-400 border-purple-400/20',
  building: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  floor: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
  room: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  zone: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
}

export function LocationDetails() {
  const { id } = useParams()
  const locationsPath = usePortalPath('locations')
  const assetsPath = usePortalPath('assets')
  const workOrdersPath = usePortalPath('work-orders')
  const [editOpen, setEditOpen] = useState(false)

  const location = mockLocations.find((l) => l.id === id) ?? mockLocations[0]
  const parent = location.parentId
    ? mockLocations.find((l) => l.id === location.parentId)
    : undefined
  const children = mockLocations.filter((l) => l.parentId === location.id)
  const assets = mockAssets.filter((a) => a.locationId === location.id)
  const workOrders = mockWorkOrders.filter((wo) => wo.locationId === location.id)

  const breadcrumb = useMemo(() => {
    const chain: Location[] = []
    let current: Location | undefined = location
    while (current) {
      chain.unshift(current)
      current = current.parentId
        ? mockLocations.find((l) => l.id === current!.parentId)
        : undefined
    }
    return chain
  }, [location])

  const Icon = typeIcons[location.type] || MapPin

  return (
    <div className="flex flex-col bg-background">
      <EditLocationDialog
        location={location}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild aria-label="Back to locations list">
            <Link to={locationsPath}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Icon className="h-5 w-5 shrink-0 text-primary" />
              <h1 className="truncate text-xl font-semibold text-foreground">{location.name}</h1>
              <Badge
                variant="outline"
                className={cn('capitalize', typeBadgeColors[location.type])}
              >
                {location.type}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {breadcrumb.map((b, i) => (
                <span key={b.id}>
                  {i > 0 && ' / '}
                  {b.id === location.id ? (
                    b.name
                  ) : (
                    <Link
                      to={`${locationsPath}/${b.id}`}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {b.name}
                    </Link>
                  )}
                </span>
              ))}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setEditOpen(true)}
              aria-label={`Edit location ${location.name}`}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button
              size="sm"
              className="gap-2"
              asChild
              aria-label={`View all assets at ${location.name}`}
            >
              <Link to={`${assetsPath}?location=${location.id}`}>
                <Wrench className="h-4 w-4" />
                View assets
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Assets', value: assets.length },
            { label: 'Open work orders', value: workOrders.filter((wo) => wo.status !== 'completed').length },
            { label: 'Child locations', value: children.length },
            { label: 'Parent', value: parent?.name ?? 'Top level' },
          ].map((s) => (
            <Card key={s.label} className="border-border bg-card">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-2xl font-semibold">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Location details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Address', value: location.address || '—' },
                { label: 'City', value: location.city || '—' },
                { label: 'Manager', value: location.managerName || '—' },
                { label: 'Description', value: location.description || '—' },
              ].map((row) => (
                <div key={row.label} className="flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="text-right font-medium">{row.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">Child locations</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => toast.info('Add child location from the locations list')}
                aria-label={`Add a child location under ${location.name}`}
              >
                <Plus className="h-3.5 w-3.5" />
                Add child
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {children.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">No child locations</p>
              ) : (
                children.map((child) => (
                  <Link
                    key={child.id}
                    to={`${locationsPath}/${child.id}`}
                    className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-accent/50"
                  >
                    <span>{child.name}</span>
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {child.type}
                    </Badge>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Work orders at this location</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border p-0">
            {workOrders.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">No work orders</p>
            ) : (
              workOrders.map((wo) => (
                <Link
                  key={wo.id}
                  to={`${workOrdersPath}/${wo.id}`}
                  className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-accent/50"
                >
                  <div>
                    <p className="text-sm font-medium">{wo.title}</p>
                    <p className="text-xs text-muted-foreground font-mono">{wo.id}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {wo.status.replace(/_/g, ' ')}
                  </Badge>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
