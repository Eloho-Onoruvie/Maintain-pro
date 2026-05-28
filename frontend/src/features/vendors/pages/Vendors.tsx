import { useState, useMemo } from 'react'
import {
   Search, Star, Building, Phone, Mail, FileText,
  AlertTriangle, CheckCircle2, MoreVertical, TrendingUp, Shield, Clock, DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { EditVendorDialog } from '@/features/vendors/components/EditVendorDialog'
import { ViewVendorDialog } from '@/features/vendors/components/ViewVendorDialog'
import { mockVendors } from '@/features/dashboard/services/dashboard.service'
import type { Vendor } from '@/types/common.types'
import { formatDate, getDaysUntil } from '@/utils/formatDate'
import { cn } from '@/utils/helpers'
import type { VendorStatus } from '@/types/common.types'
import { toast } from 'sonner'

const SERVICE_CATEGORIES = ['Electrical','Plumbing','HVAC','Cleaning','Pest Control','Fire Safety','Elevator','Security','Gas','Sewage','General']

const statusColors: Record<VendorStatus, string> = {
  active:      'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  inactive:    'bg-muted text-muted-foreground border-border',
  blacklisted: 'bg-red-400/10 text-red-400 border-red-400/20',
}

function RatingStars({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} className={cn('h-3.5 w-3.5', i < Math.floor(value) ? 'text-amber-400 fill-amber-400' : i < value ? 'text-amber-400 fill-amber-400/40' : 'text-muted-foreground')} />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{value.toFixed(1)}</span>
    </div>
  )
}

export function Vendors() {
  const [showCreate, setShowCreate] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('grid')
  const [viewVendor, setViewVendor] = useState<Vendor | null>(null)
  const [editVendor, setEditVendor] = useState<Vendor | null>(null)
  const [renewVendor, setRenewVendor] = useState<Vendor | null>(null)
  const [deactivateVendor, setDeactivateVendor] = useState<Vendor | null>(null)

  const [form, setForm] = useState({
    name: '', category: '', serviceCategories: [] as string[], email: '', phone: '',
    address: '', contactPerson: '', contractStart: '', contractEnd: '', contractValue: '',
    slaResponseTime: '', slaResolutionTime: '', taxId: '', notes: ''
  })

  const vendors = useMemo(() => mockVendors.filter(v => {
    if (statusFilter !== 'all' && v.status !== statusFilter) return false
    if (categoryFilter !== 'all' && !v.serviceCategories?.includes(categoryFilter)) return false
    if (search && !v.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [search, categoryFilter, statusFilter])

  const stats = {
    total: mockVendors.length,
    active: mockVendors.filter(v => v.status === 'active').length,
    expiringSoon: mockVendors.filter(v => v.contractEnd && getDaysUntil(v.contractEnd) <= 30 && getDaysUntil(v.contractEnd) >= 0).length,
    avgRating: (mockVendors.reduce((s, v) => s + v.rating, 0) / mockVendors.length).toFixed(1),
    totalSpend: mockVendors.reduce((s, v) => s + (v.totalSpend || 0), 0),
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ViewVendorDialog
        vendor={viewVendor}
        open={!!viewVendor}
        onOpenChange={(o) => !o && setViewVendor(null)}
        onEdit={() => {
          if (viewVendor) {
            setEditVendor(viewVendor)
            setViewVendor(null)
          }
        }}
      />
      <EditVendorDialog vendor={editVendor} open={!!editVendor} onOpenChange={(o) => !o && setEditVendor(null)} />
      <ConfirmDialog
        open={!!renewVendor}
        onOpenChange={(o) => !o && setRenewVendor(null)}
        title="Renew contract?"
        description={renewVendor ? `Start renewal workflow for ${renewVendor.name}?` : ''}
        confirmLabel="Start renewal"
        onConfirm={() => {
          if (renewVendor) toast.success(`Renewal workflow started for ${renewVendor.name}`)
          setRenewVendor(null)
        }}
      />
      <ConfirmDialog
        open={!!deactivateVendor}
        onOpenChange={(o) => !o && setDeactivateVendor(null)}
        title="Deactivate vendor?"
        description={deactivateVendor ? `${deactivateVendor.name} will be marked inactive.` : ''}
        confirmLabel="Deactivate"
        destructive
        onConfirm={() => {
          if (deactivateVendor) toast.success(`${deactivateVendor.name} deactivation requested`)
          setDeactivateVendor(null)
        }}
      />
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Vendors</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage service providers, contracts & performance</p>
          </div>
          <Button size="sm" className="gap-2" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> Add Vendor
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Total Vendors',  value: stats.total,                             icon: Building,       color: 'text-foreground' },
            { label: 'Active',         value: stats.active,                            icon: CheckCircle2,   color: 'text-emerald-400' },
            { label: 'Contracts Expiring', value: stats.expiringSoon,                  icon: AlertTriangle,  color: 'text-amber-400' },
            { label: 'Avg Rating',     value: `${stats.avgRating}/5`,                  icon: Star,           color: 'text-amber-400' },
            { label: 'Total Spend',    value: `$${(stats.totalSpend/1000).toFixed(0)}k`, icon: DollarSign,   color: 'text-blue-400' },
          ].map(s => (
            <Card key={s.label} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className={cn('text-2xl font-semibold mt-1', s.color)}>{s.value}</p>
                  </div>
                  <s.icon className={cn('h-5 w-5', s.color)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search vendors..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {SERVICE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="blacklisted">Blacklisted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted border border-border mb-4">
            <TabsTrigger value="grid">Cards</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="performance" className="gap-2"><TrendingUp className="h-3.5 w-3.5"/>Performance</TabsTrigger>
          </TabsList>

          {/* Grid */}
          <TabsContent value="grid" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {vendors.map(v => {
                const contractDays = v.contractEnd ? getDaysUntil(v.contractEnd) : null
                const contractExpiring = contractDays !== null && contractDays <= 30 && contractDays >= 0
                const contractExpired = contractDays !== null && contractDays < 0
                return (
                  <Card key={v.id} className={cn('bg-card border-border hover:border-primary/30 transition-colors', contractExpiring && 'border-amber-400/30')}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-foreground">{v.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{v.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn('text-xs capitalize', statusColors[v.status as VendorStatus])}>{v.status}</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                aria-label={`Actions for vendor ${v.name}`}
                              >
                                <MoreVertical className="h-3.5 w-3.5" aria-hidden />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setViewVendor(v)}>View Details</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setEditVendor(v)}>Edit</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.info(`Invoices for ${v.name} — coming soon`)}>View Invoices</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setRenewVendor(v)}>Renew Contract</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => setDeactivateVendor(v)}>Deactivate</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <RatingStars value={v.rating} />

                      <div className="space-y-1.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2"><Mail className="h-3 w-3" />{v.email}</div>
                        <div className="flex items-center gap-2"><Phone className="h-3 w-3" />{v.phone}</div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {v.serviceCategories?.slice(0, 3).map(c => (
                          <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
                        ))}
                        {(v.serviceCategories?.length || 0) > 3 && (
                          <Badge variant="outline" className="text-[10px]">+{v.serviceCategories!.length - 3}</Badge>
                        )}
                      </div>

                      {v.contractEnd && (
                        <div className={cn('flex items-center gap-2 p-2 rounded-md text-xs', contractExpired ? 'bg-red-400/10 text-red-400' : contractExpiring ? 'bg-amber-400/10 text-amber-400' : 'bg-muted text-muted-foreground')}>
                          {contractExpired || contractExpiring ? <AlertTriangle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                          Contract {contractExpired ? 'expired' : contractExpiring ? `expires in ${contractDays}d` : `until ${formatDate(v.contractEnd)}`}
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border text-center">
                        {[
                          { label: 'Jobs', value: v.completedJobs || 0 },
                          { label: 'Pending', value: v.pendingJobs || 0 },
                          { label: 'Spend', value: `$${((v.totalSpend || 0)/1000).toFixed(0)}k` },
                        ].map(m => (
                          <div key={m.label}>
                            <p className="text-sm font-semibold text-foreground">{m.value}</p>
                            <p className="text-[10px] text-muted-foreground">{m.label}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              {vendors.length === 0 && (
                <div className="col-span-3 text-center py-16 text-muted-foreground">
                  <Building className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No vendors found</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Table */}
          <TabsContent value="table" className="mt-0">
            <Card className="bg-card border-border">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    {['Vendor','Category','Rating','Contract Status','Jobs','Spend','Status','Actions'].map(h => (
                      <TableHead key={h} className="text-muted-foreground text-xs">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map(v => {
                    const contractDays = v.contractEnd ? getDaysUntil(v.contractEnd) : null
                    return (
                      <TableRow key={v.id} className="border-border">
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{v.name}</p>
                            <p className="text-xs text-muted-foreground">{v.contactPerson || v.email}</p>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{v.category}</Badge></TableCell>
                        <TableCell><RatingStars value={v.rating} /></TableCell>
                        <TableCell>
                          {v.contractEnd ? (
                            <span className={cn('text-xs', contractDays !== null && contractDays < 0 ? 'text-red-400' : contractDays !== null && contractDays <= 30 ? 'text-amber-400' : 'text-muted-foreground')}>
                              {contractDays !== null && contractDays < 0 ? 'Expired' : contractDays !== null && contractDays <= 30 ? `${contractDays}d left` : formatDate(v.contractEnd)}
                            </span>
                          ) : <span className="text-xs text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell><span className="text-sm">{v.completedJobs || 0}</span></TableCell>
                        <TableCell><span className="text-sm">${((v.totalSpend || 0)/1000).toFixed(0)}k</span></TableCell>
                        <TableCell><Badge variant="outline" className={cn('text-xs capitalize', statusColors[v.status as VendorStatus])}>{v.status}</Badge></TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                aria-label={`Actions for vendor ${v.name}`}
                              >
                                <MoreVertical className="h-4 w-4" aria-hidden />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setViewVendor(v)}>View Details</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setEditVendor(v)}>Edit</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setRenewVendor(v)}>Renew Contract</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => setDeactivateVendor(v)}>Deactivate</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Performance */}
          <TabsContent value="performance" className="mt-0 space-y-4">
            {vendors.filter(v => v.status === 'active').map(v => (
              <Card key={v.id} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{v.name}</h3>
                      <p className="text-xs text-muted-foreground">{v.category}</p>
                    </div>
                    <RatingStars value={v.rating} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Completion Rate', value: Math.min(100, 85 + Math.random() * 15), suffix: '%' },
                      { label: 'On-Time Rate',     value: Math.min(100, 75 + Math.random() * 20), suffix: '%' },
                      { label: 'Avg Response',     value: Math.floor(2 + Math.random() * 6), suffix: 'h' },
                      { label: 'Quality Score',    value: Math.floor(3.5 + Math.random() * 1.5), suffix: '/5' },
                    ].map(m => {
                      const pct = m.suffix === '%' ? m.value : (m.value / (m.suffix === 'h' ? 24 : 5)) * 100
                      return (
                        <div key={m.label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{m.label}</span>
                            <span className="font-medium">{m.value.toFixed(0)}{m.suffix}</span>
                          </div>
                          <Progress value={Math.min(100, pct)} className="h-1.5" />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add New Vendor</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            {[
              { label: 'Company Name *', key: 'name', placeholder: 'e.g. CoolTech HVAC Services' },
              { label: 'Contact Person', key: 'contactPerson', placeholder: 'e.g. John Smith' },
              { label: 'Email *', key: 'email', placeholder: 'vendor@example.com', type: 'email' },
              { label: 'Phone *', key: 'phone', placeholder: '+1 (555) 000-0000' },
              { label: 'Tax ID / Registration', key: 'taxId', placeholder: 'e.g. 12-3456789' },
              { label: 'Contract Value ($)', key: 'contractValue', placeholder: '0.00', type: 'number' },
              { label: 'Contract Start', key: 'contractStart', type: 'date' },
              { label: 'Contract End', key: 'contractEnd', type: 'date' },
              { label: 'SLA Response Time (hours)', key: 'slaResponseTime', placeholder: '4', type: 'number' },
              { label: 'SLA Resolution Time (hours)', key: 'slaResolutionTime', placeholder: '24', type: 'number' },
            ].map(f => (
              <div key={f.key} className="space-y-1.5">
                <Label className="text-xs">{f.label}</Label>
                <Input type={f.type || 'text'} placeholder={f.placeholder}
                  value={(form as Record<string, string | string[]>)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label className="text-xs">Primary Category *</Label>
              <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{SERVICE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">Address</Label>
              <Input placeholder="Street address" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">Notes</Label>
              <Textarea placeholder="Any special terms, notes or requirements..." rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button
              onClick={() => {
                setShowCreate(false)
                toast.success('Vendor added')
              }}
              disabled={!form.name || !form.email || !form.phone}
            >
              Add Vendor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 5v14M5 12h14"/></svg>
}
