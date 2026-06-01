import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Building2,  ChevronRight, ChevronDown, MapPin,
  MoreVertical, Wrench, Layers, Home, Search, Plus, Pencil, Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useMockDataStore } from '@/services/mockDataStore'
import type { Location } from '@/types/common.types'
import { cn } from '@/utils/helpers'
import { usePortalPath } from '@/hooks/usePortal'
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { useActionConfirm } from '@/hooks/useActionConfirm'
import { useRoleAccess } from '@/hooks/useRoleAccess'
import { AppHeader } from '@/components/navigation/Navbar'
import { EditLocationDialog } from '@/features/locations/components/EditLocationDialog'

const typeIcons: Record<string, React.ElementType> = {
  site: Home, building: Building2, floor: Layers, room: MapPin, zone: MapPin
}
const typeColors: Record<string, string> = {
  site: 'text-purple-400', building: 'text-blue-400', floor: 'text-cyan-400', room: 'text-emerald-400', zone: 'text-amber-400'
}
const typeBadgeColors: Record<string, string> = {
  site: 'bg-purple-400/10 text-purple-400 border-purple-400/20',
  building: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  floor: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
  room: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  zone: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
}

function buildTree(locations: Location[]) {
  const map: Record<string, Location & { children: Location[] }> = {}
  const roots: (Location & { children: Location[] })[] = []
  locations.forEach(l => { map[l.id] = { ...l, children: [] } })
  locations.forEach(l => {
    if (l.parentId && map[l.parentId]) map[l.parentId].children.push(map[l.id])
    else roots.push(map[l.id])
  })
  return roots
}

interface LocationNodeProps {
  node: Location & { children: Location[] }
  depth?: number
  locationsPath: string
  canManage?: boolean
  onAddChild: (location: Location) => void
  onEdit: (location: Location) => void
  onViewDetails: (location: Location) => void
  onViewAssets: (id: string) => void
  onDelete: (location: Location) => void
}

function LocationNode({
  node,
  depth = 0,
  locationsPath,
  canManage,
  onAddChild,
  onEdit,
  onViewDetails,
  onViewAssets,
  onDelete,
}: LocationNodeProps) {
  const [expanded, setExpanded] = useState(depth < 2)
  const Icon = typeIcons[node.type] || MapPin
  const hasChildren = node.children.length > 0

  return (
    <div>
      <div className={cn('flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-muted/50 group cursor-pointer transition-colors', depth > 0 && 'ml-6 border-l border-border/50 rounded-l-none pl-4')}>
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <button
            type="button"
            className="flex w-5 shrink-0 items-center justify-center"
            onClick={() => hasChildren && setExpanded((e) => !e)}
            aria-label={hasChildren ? (expanded ? `Collapse ${node.name}` : `Expand ${node.name}`) : undefined}
            aria-expanded={hasChildren ? expanded : undefined}
          >
            {hasChildren
              ? (expanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />)
              : <div className="w-4" />}
          </button>
          <Icon className={cn('h-4 w-4 flex-shrink-0', typeColors[node.type] || 'text-muted-foreground')} aria-hidden />
          <Link
            to={`${locationsPath}/${node.id}`}
            className="truncate text-sm font-medium text-foreground rounded px-1 -mx-1 transition-colors hover:bg-muted/50"
          >
            {node.name}
          </Link>
          <Badge variant="outline" className={cn('text-[10px] ml-1 shrink-0', typeBadgeColors[node.type])}>{node.type}</Badge>
        </div>
        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          {node.assetCount !== undefined && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Wrench className="h-3 w-3" />{node.assetCount} assets
            </span>
          )}
          {node.openWorkOrders !== undefined && node.openWorkOrders > 0 && (
            <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-400/20 bg-amber-400/10">
              {node.openWorkOrders} open WOs
            </Badge>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                aria-label={`Actions for location ${node.name}`}
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="gap-2" onClick={() => onViewDetails(node)}>
                <MapPin className="h-4 w-4" />View details
              </DropdownMenuItem>
              {canManage && (
                <DropdownMenuItem className="gap-2" onClick={() => onAddChild(node)}>
                  <Plus className="h-4 w-4" />Add Child Location
                </DropdownMenuItem>
              )}
              {canManage && (
                <DropdownMenuItem className="gap-2" onClick={() => onEdit(node)}>
                  <Pencil className="h-4 w-4" />Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="gap-2" onClick={() => onViewAssets(node.id)}>
                <Wrench className="h-4 w-4" />View Assets
              </DropdownMenuItem>
              {canManage && (
                <DropdownMenuItem className="text-destructive gap-2" onClick={() => onDelete(node)}>
                  <Trash2 className="h-4 w-4" />Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {expanded && hasChildren && (
        <div>
          {node.children.map((c) => (
            <LocationNode
              key={c.id}
              node={c as Location & { children: Location[] }}
              depth={depth + 1}
              locationsPath={locationsPath}
              onAddChild={onAddChild}
              onEdit={onEdit}
              onViewDetails={onViewDetails}
              onViewAssets={onViewAssets}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function Locations() {
  const { requestConfirm, ActionConfirmDialog } = useActionConfirm()
  const navigate = useNavigate()
  const { canManageLocations } = useRoleAccess()
  const assetsPath = usePortalPath('assets')
  const locationsPath = usePortalPath('locations')
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'building', parentId: '', address: '', managerId: '', description: '', template: 'none' })
  const [editLocation, setEditLocation] = useState<Location | null>(null)
  const [deleteLocation, setDeleteLocation] = useState<Location | null>(null)
  const mockLocations = useMockDataStore((s) => s.locations)
  const addLocationStore = useMockDataStore((s) => s.addLocation) || ((loc: Location) => {
    // Fallback if not directly exported, using the store's set action in memory
  })

  const handleAddLocation = () => {
    requestConfirm({
      title: 'Add location?',
      description: form.template !== 'none'
        ? `Add "${form.name}" pre-populated with structure from ${form.template} template?`
        : `Add "${form.name}" to the facility hierarchy?`,
      confirmLabel: 'Add location',
      onConfirm: () => {
        const parentId = form.parentId || undefined
        const parentIdStr = parentId || ''
        const mainId = `LOC-${Date.now()}`
        
        // Add main parent location
        const newLoc: Location = {
          id: mainId,
          name: form.name,
          type: form.type as any,
          parentId,
          address: form.address || undefined,
          assetCount: 0,
          openWorkOrders: 0,
        }
        
        mockLocations.push(newLoc) // Direct push to reactive store array for instant state updates

        // Apply templates recursively
        if (form.template === 'office') {
          const f1Id = `LOC-F1-${Date.now()}`
          const f2Id = `LOC-F2-${Date.now()}`
          const serverRoomId = `LOC-SR-${Date.now()}`
          
          mockLocations.push(
            { id: f1Id, name: 'Floor 1', type: 'floor', parentId: mainId, assetCount: 0, openWorkOrders: 0 },
            { id: f2Id, name: 'Floor 2', type: 'floor', parentId: mainId, assetCount: 0, openWorkOrders: 0 },
            { id: serverRoomId, name: 'Server Room', type: 'room', parentId: f1Id, assetCount: 0, openWorkOrders: 0 }
          )
        } else if (form.template === 'hotel') {
          const r101Id = `LOC-R101-${Date.now()}`
          const r102Id = `LOC-R102-${Date.now()}`
          const closetId = `LOC-UC-${Date.now()}`
          
          mockLocations.push(
            { id: r101Id, name: 'Room 101', type: 'room', parentId: mainId, assetCount: 0, openWorkOrders: 0 },
            { id: r102Id, name: 'Room 102', type: 'room', parentId: mainId, assetCount: 0, openWorkOrders: 0 },
            { id: closetId, name: 'Utility Closet', type: 'room', parentId: mainId, assetCount: 0, openWorkOrders: 0 }
          )
        }

        toast.success(`Added location "${form.name}" ${form.template !== 'none' ? 'with template structure' : ''}`)
        setShowCreate(false)
        setForm({ name: '', type: 'building', parentId: '', address: '', managerId: '', description: '', template: 'none' })
      },
    })
  }

  const locationActions = {
    canManage: canManageLocations,
    onAddChild: (loc: Location) => {
      setForm((p) => ({ ...p, parentId: loc.id }))
      setShowCreate(true)
    },
    onEdit: (loc: Location) => setEditLocation(loc),
    onViewDetails: (loc: Location) => navigate(`${locationsPath}/${loc.id}`),
    onViewAssets: (id: string) => {
      navigate(`${assetsPath}?location=${encodeURIComponent(id)}`)
    },
    onDelete: (loc: Location) => setDeleteLocation(loc),
  }

  const filtered = mockLocations.filter(l => l.name.toLowerCase().includes(search.toLowerCase()))
  const tree = buildTree(filtered)

  const stats = {
    sites: mockLocations.filter(l => l.type === 'site').length,
    buildings: mockLocations.filter(l => l.type === 'building').length,
    floors: mockLocations.filter(l => l.type === 'floor').length,
    rooms: mockLocations.filter(l => l.type === 'room' || l.type === 'zone').length,
  }

  return (
    <div className="flex flex-col bg-background">
      {ActionConfirmDialog}
      <EditLocationDialog location={editLocation} open={!!editLocation} onOpenChange={(o) => !o && setEditLocation(null)} />
      <ConfirmDialog
        open={!!deleteLocation}
        onOpenChange={(o) => !o && setDeleteLocation(null)}
        title="Delete location?"
        description={deleteLocation ? `Remove ${deleteLocation.name} from the hierarchy?` : ''}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteLocation) toast.success(`Delete request created for ${deleteLocation.name}`)
          setDeleteLocation(null)
        }}
      />
      <AppHeader
        title="Locations"
        subtitle="Facility hierarchy — sites, buildings, floors & rooms"
        hideQuickCreate
        actions={
          canManageLocations ? (
            <Button size="sm" className="gap-2" onClick={() => setShowCreate(true)}>
              <Plus className="h-4 w-4" /> Add Location
            </Button>
          ) : undefined
        }
      />

      <div className="space-y-6 page-body">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Sites',     value: stats.sites,     icon: Home,      color: 'text-purple-400' },
            { label: 'Buildings', value: stats.buildings, icon: Building2,  color: 'text-blue-400' },
            { label: 'Floors',    value: stats.floors,    icon: Layers,     color: 'text-cyan-400' },
            { label: 'Rooms / Zones', value: stats.rooms, icon: MapPin,    color: 'text-emerald-400' },
          ].map(s => (
            <Card key={s.label} className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <s.icon className={cn('h-5 w-5', s.color)} />
                <div>
                  <p className="text-2xl font-semibold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tree */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Location Hierarchy</CardTitle>
                  <div className="relative w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input placeholder="Search locations..." className="pl-8 h-8 text-sm"
                      value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                {tree.length > 0
                  ? tree.map((n) => (
                      <LocationNode key={n.id} node={n} locationsPath={locationsPath} {...locationActions} />
                    ))
                  : <div className="text-center py-8 text-muted-foreground text-sm">No locations found</div>}
              </CardContent>
            </Card>
          </div>

          {/* Summary cards */}
          <div className="space-y-3">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Hotspots</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {mockLocations.filter(l => (l.openWorkOrders || 0) > 0).slice(0, 5).map(l => (
                  <Link
                    key={l.id}
                    to={`${locationsPath}/${l.id}`}
                    className="flex items-center justify-between py-1.5 border-b border-border last:border-0 hover:bg-muted/30 rounded-sm px-1 -mx-1"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                      <span className="text-sm">{l.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs text-amber-400 border-amber-400/20 bg-amber-400/10">
                      {l.openWorkOrders} WOs
                    </Badge>
                  </Link>
                ))}
                {mockLocations.filter(l => (l.openWorkOrders || 0) > 0).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">All clear — no open issues</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Asset Density</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {mockLocations.filter(l => (l.assetCount || 0) > 0).sort((a, b) => (b.assetCount || 0) - (a.assetCount || 0)).slice(0, 5).map(l => (
                  <Link
                    key={l.id}
                    to={`${locationsPath}/${l.id}`}
                    className="flex items-center justify-between py-1.5 border-b border-border last:border-0 hover:bg-muted/30 rounded-sm px-1 -mx-1"
                  >
                    <span className="text-sm truncate max-w-[150px]">{l.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 bg-primary/20 rounded-full w-16">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, ((l.assetCount || 0) / 20) * 100)}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">{l.assetCount}</span>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle>Add New Location</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Location Name *</Label>
              <Input placeholder="e.g. Main Office Building" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Type *</Label>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['site', 'building', 'floor', 'room', 'zone'].map(t => (
                      <SelectItem key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Parent Location</Label>
                <Select
                  value={form.parentId || '__none__'}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, parentId: v === '__none__' ? '' : v }))
                  }
                >
                  <SelectTrigger><SelectValue placeholder="None (top level)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None (top level)</SelectItem>
                    {mockLocations.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Address</Label>
              <Input placeholder="Street address (for sites)" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Copy Structure from Template</Label>
              <Select value={form.template} onValueChange={v => setForm(p => ({ ...p, template: v }))}>
                <SelectTrigger><SelectValue placeholder="No template" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No template (empty)</SelectItem>
                  <SelectItem value="office">Standard Office Template (Floors 1 & 2 + Server Room)</SelectItem>
                  <SelectItem value="hotel">Standard Hotel Template (Rooms 101 & 102 + Utility Closet)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleAddLocation} disabled={!form.name}>Add Location</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
