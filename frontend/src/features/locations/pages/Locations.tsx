import { useState } from 'react'
import {
  Building2,  ChevronRight, ChevronDown, MapPin,
  MoreVertical, Users, Wrench, Layers, Home, Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { mockLocations } from '@/features/dashboard/services/dashboard.service'
import type { Location } from '@/types/common.types'
import { cn } from '@/utils/helpers'

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

function LocationNode({ node, depth = 0 }: { node: Location & { children: Location[] }; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2)
  const Icon = typeIcons[node.type] || MapPin
  const hasChildren = node.children.length > 0

  return (
    <div>
      <div className={cn('flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-muted/50 group cursor-pointer transition-colors', depth > 0 && 'ml-6 border-l border-border/50 rounded-l-none pl-4')}>
        <button className="flex items-center gap-2 flex-1" onClick={() => hasChildren && setExpanded(e => !e)}>
          <div className="w-5 flex-shrink-0">
            {hasChildren
              ? (expanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />)
              : <div className="w-4" />}
          </div>
          <Icon className={cn('h-4 w-4 flex-shrink-0', typeColors[node.type] || 'text-muted-foreground')} />
          <span className="text-sm font-medium text-foreground">{node.name}</span>
          <Badge variant="outline" className={cn('text-[10px] ml-1', typeBadgeColors[node.type])}>{node.type}</Badge>
        </button>
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
              <Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="h-3.5 w-3.5" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="gap-2"><Plus className="h-4 w-4" />Add Child Location</DropdownMenuItem>
              <DropdownMenuItem className="gap-2"><Edit className="h-4 w-4" />Edit</DropdownMenuItem>
              <DropdownMenuItem className="gap-2"><Wrench className="h-4 w-4" />View Assets</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive gap-2"><Trash2 className="h-4 w-4" />Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {expanded && hasChildren && (
        <div>{node.children.map(c => <LocationNode key={c.id} node={c as Location & { children: Location[] }} depth={depth + 1} />)}</div>
      )}
    </div>
  )
}

export function Locations() {
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'building', parentId: '', address: '', managerId: '', description: '' })

  const filtered = mockLocations.filter(l => l.name.toLowerCase().includes(search.toLowerCase()))
  const tree = buildTree(filtered)

  const stats = {
    sites: mockLocations.filter(l => l.type === 'site').length,
    buildings: mockLocations.filter(l => l.type === 'building').length,
    floors: mockLocations.filter(l => l.type === 'floor').length,
    rooms: mockLocations.filter(l => l.type === 'room' || l.type === 'zone').length,
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Locations</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Facility hierarchy — sites, buildings, floors & rooms</p>
          </div>
          <Button size="sm" className="gap-2" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> Add Location
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
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
                  ? tree.map(n => <LocationNode key={n.id} node={n} />)
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
                  <div key={l.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">{l.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs text-amber-400 border-amber-400/20 bg-amber-400/10">
                      {l.openWorkOrders} WOs
                    </Badge>
                  </div>
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
                  <div key={l.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                    <span className="text-sm truncate max-w-[150px]">{l.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 bg-primary/20 rounded-full w-16">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, ((l.assetCount || 0) / 20) * 100)}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">{l.assetCount}</span>
                    </div>
                  </div>
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
                <Select value={form.parentId} onValueChange={v => setForm(p => ({ ...p, parentId: v }))}>
                  <SelectTrigger><SelectValue placeholder="None (top level)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (top level)</SelectItem>
                    {mockLocations.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Address</Label>
              <Input placeholder="Street address (for sites)" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={() => setShowCreate(false)} disabled={!form.name}>Add Location</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 5v14M5 12h14"/></svg>
}
function Edit(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
}
function Trash2(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
}
