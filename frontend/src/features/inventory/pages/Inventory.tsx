import { useState, useMemo } from 'react'
import {
  Package, Search, AlertTriangle, TrendingDown, ShoppingCart,
  ArrowDownToLine, MoreVertical, Filter, Upload, Download, CheckCircle2,
} from 'lucide-react'
import { AppHeader } from '@/components/navigation/Navbar'
import { useActionConfirm } from '@/hooks/useActionConfirm'
import { useDownloadConfirm } from '@/hooks/useDownloadConfirm'
import { useRoleAccess } from '@/hooks/useRoleAccess'
import { downloadJson } from '@/utils/downloadFile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { EditInventoryItemDialog } from '@/features/inventory/components/EditInventoryItemDialog'
import { useMockDataStore } from '@/services/mockDataStore'
import type { InventoryItem } from '@/types/common.types'
import { formatDate } from '@/utils/formatDate'
import { cn } from '@/utils/helpers'
import { toast } from 'sonner'

const CATEGORIES = ['HVAC','Electrical','Plumbing','Fire Safety','Elevator','General','Cleaning','Security']

const mockPurchaseRequests = [
  { id: 'PR-001', itemId: 'i1', itemName: 'HVAC Air Filters', quantity: 20, estimatedCost: 180, requestedBy: 'Mike Rodriguez', requestedAt: new Date(Date.now() - 2 * 3600000), status: 'pending' as const },
  { id: 'PR-002', itemId: 'i3', itemName: 'Circuit Breakers', quantity: 5, estimatedCost: 425, requestedBy: 'Sarah Chen', requestedAt: new Date(Date.now() - 5 * 3600000), status: 'approved' as const },
  { id: 'PR-003', itemId: 'i5', itemName: 'Fire Extinguishers', quantity: 3, estimatedCost: 210, requestedBy: 'James Park', requestedAt: new Date(Date.now() - 1 * 86400000), status: 'ordered' as const },
]

export function Inventory() {
  const { requestDownload, DownloadConfirmDialog } = useDownloadConfirm()
  const { requestConfirm, ActionConfirmDialog } = useActionConfirm()
  const { canManageInventory } = useRoleAccess()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showCreate, setShowCreate] = useState(false)
  const [showReceive, setShowReceive] = useState<string | null>(null)
  const [showPR, setShowPR] = useState(false)
  const [form, setForm] = useState({ name: '', sku: '', category: '', description: '', quantity: '', minStock: '', maxStock: '', unitPrice: '', unit: '', locationId: '', supplier: '' })
  const [receiveForm, setReceiveForm] = useState({ quantity: '', unitPrice: '', supplier: '', invoiceNumber: '' })
  const [prForm, setPRForm] = useState({ itemId: '', quantity: '', notes: '' })
  const [editItem, setEditItem] = useState<InventoryItem | null>(null)
  const [deleteItem, setDeleteItem] = useState<InventoryItem | null>(null)

  const mockInventory = useMockDataStore((s) => s.inventory)
  const items = useMemo(() => mockInventory.filter(i => {
    if (categoryFilter !== 'all' && i.category !== categoryFilter) return false
    if (search && !i.name.toLowerCase().includes(search.toLowerCase()) && !i.sku.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [search, categoryFilter])

  const stats = {
    total: mockInventory.length,
    lowStock: mockInventory.filter(i => i.quantity <= i.minStock).length,
    outOfStock: mockInventory.filter(i => i.quantity === 0).length,
    totalValue: mockInventory.reduce((s, i) => s + i.quantity * i.unitPrice, 0),
    pendingPRs: mockPurchaseRequests.filter(r => r.status === 'pending').length,
  }

  const getStockStatus = (item: typeof mockInventory[0]) => {
    if (item.quantity === 0) return { label: 'Out of Stock', color: 'text-red-400 bg-red-400/10 border-red-400/20' }
    if (item.quantity <= item.minStock) return { label: 'Low Stock', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' }
    return { label: 'In Stock', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' }
  }

  const getStockPct = (item: typeof mockInventory[0]) => {
    const max = item.maxStock || item.minStock * 3
    return Math.min(100, (item.quantity / max) * 100)
  }

  return (
    <div className="flex flex-col bg-background">
      {DownloadConfirmDialog}
      {ActionConfirmDialog}
      <EditInventoryItemDialog item={editItem} open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)} />
      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(o) => !o && setDeleteItem(null)}
        title="Delete inventory item?"
        description={deleteItem ? `Remove ${deleteItem.name} (${deleteItem.sku}) from inventory?` : ''}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteItem) toast.success(`Delete request created for ${deleteItem.name}`)
          setDeleteItem(null)
        }}
      />
      <AppHeader
        title="Inventory"
        subtitle="Spare parts, supplies & stock management"
        hideQuickCreate
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() =>
                requestConfirm({
                  title: 'Import inventory?',
                  description: 'Upload a CSV or Excel file to bulk-import inventory items.',
                  confirmLabel: 'Continue',
                  singleAction: true,
                  onConfirm: () => toast.info('Import flow will connect to your inventory API'),
                })
              }
            >
              <Upload className="h-4 w-4" />Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() =>
                requestDownload({
                  title: 'Export inventory?',
                  description: `Download ${items.length} inventory item${items.length === 1 ? '' : 's'} as a JSON file to your device.`,
                  confirmLabel: 'Download export',
                  onDownload: () => {
                    downloadJson('inventory-export.json', items)
                    toast.success('Inventory exported')
                  },
                })
              }
            >
              <Download className="h-4 w-4" />Export
            </Button>
            {canManageInventory && (
              <Button size="sm" className="gap-2" onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4" />Add Item
              </Button>
            )}
          </>
        }
      />

      <div className="space-y-6 page-body">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Total Items',   value: stats.total,                               color: 'text-foreground',    icon: Package },
            { label: 'Low Stock',     value: stats.lowStock,                            color: 'text-amber-400',     icon: TrendingDown },
            { label: 'Out of Stock',  value: stats.outOfStock,                          color: 'text-red-400',       icon: AlertTriangle },
            { label: 'Stock Value',   value: `$${(stats.totalValue/1000).toFixed(0)}k`, color: 'text-blue-400',      icon: Package },
            { label: 'Pending PRs',   value: stats.pendingPRs,                          color: 'text-purple-400',    icon: ShoppingCart },
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

        {/* Low stock alert strip */}
        {stats.lowStock > 0 && (
          <Card className="border-amber-400/30 bg-amber-400/5">
            <CardContent className="p-3 flex items-center gap-3">
              <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0" />
              <p className="text-sm text-amber-400">
                <span className="font-semibold">{stats.lowStock} items</span> are at or below minimum stock level.
                {' '}<button className="underline" onClick={() => setShowPR(true)}>Create purchase requests</button>
              </p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="catalog">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-muted border border-border">
              <TabsTrigger value="catalog">Parts Catalog</TabsTrigger>
              <TabsTrigger value="purchase_requests" className="gap-2">
                Purchase Requests
                {stats.pendingPRs > 0 && (
                  <Badge className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary">{stats.pendingPRs}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search parts..." className="pl-8 w-48 h-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Catalog */}
          <TabsContent value="catalog" className="mt-0">
            <Card className="bg-card border-border">
              <div className="data-table-wrap">
          <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    {['Item','SKU','Category','Location','Stock Level','Unit Price','Value','Actions'].map(h => (
                      <TableHead key={h} className="text-muted-foreground text-xs">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map(item => {
                    const status = getStockStatus(item)
                    const pct = getStockPct(item)
                    return (
                      <TableRow key={item.id} className="border-border">
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            {item.description && <p className="text-xs text-muted-foreground truncate max-w-[160px]">{item.description}</p>}
                          </div>
                        </TableCell>
                        <TableCell><span className="text-xs font-mono text-muted-foreground">{item.sku}</span></TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{item.category}</Badge></TableCell>
                        <TableCell><span className="text-xs text-muted-foreground">{item.locationName}</span></TableCell>
                        <TableCell>
                          <div className="space-y-1.5 min-w-[120px]">
                            <div className="flex items-center justify-between text-xs">
                              <Badge variant="outline" className={cn('text-[10px]', status.color)}>{status.label}</Badge>
                              <span className="text-muted-foreground">{item.quantity}/{item.minStock} min</span>
                            </div>
                            <Progress value={pct} className={cn('h-1.5', item.quantity <= item.minStock && 'bg-amber-400/20')} />
                          </div>
                        </TableCell>
                        <TableCell><span className="text-sm">${item.unitPrice.toFixed(2)}</span></TableCell>
                        <TableCell><span className="text-sm font-medium">${(item.quantity * item.unitPrice).toFixed(0)}</span></TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                aria-label={`Actions for inventory item ${item.name}`}
                              >
                                <MoreVertical className="h-4 w-4" aria-hidden />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2" onClick={() => setShowReceive(item.id)}>
                                <ArrowDownToLine className="h-4 w-4" />Receive Stock
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2" onClick={() => { setPRForm(p => ({ ...p, itemId: item.id })); setShowPR(true) }}>
                                <ShoppingCart className="h-4 w-4" />Create Purchase Request
                              </DropdownMenuItem>
                              {canManageInventory && (
                                <DropdownMenuItem onClick={() => setEditItem(item)}>Edit Item</DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-destructive" onClick={() => setDeleteItem(item)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              </div>
              {items.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No items found</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Purchase Requests */}
          <TabsContent value="purchase_requests" className="mt-0 space-y-3">
            <div className="flex justify-end">
              <Button size="sm" className="gap-2" onClick={() => setShowPR(true)}>
                <Plus className="h-4 w-4" />New Purchase Request
              </Button>
            </div>
            {mockPurchaseRequests.map(pr => (
              <Card key={pr.id} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{pr.itemName}</span>
                        <Badge variant="outline" className={cn('text-xs', {
                          pending:  'text-amber-400 border-amber-400/20 bg-amber-400/10',
                          approved: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10',
                          rejected: 'text-red-400 border-red-400/20 bg-red-400/10',
                          ordered:  'text-blue-400 border-blue-400/20 bg-blue-400/10',
                        }[pr.status])}>
                          {pr.status.charAt(0).toUpperCase()+pr.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className="font-mono">{pr.id}</span>
                        <span>Qty: {pr.quantity}</span>
                        <span>Est. Cost: ${pr.estimatedCost}</span>
                        <span>By: {pr.requestedBy}</span>
                        <span>{formatDate(pr.requestedAt)}</span>
                      </div>
                    </div>
                    {pr.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="gap-1.5 h-8 bg-emerald-600 hover:bg-emerald-700"
                          onClick={() =>
                            requestConfirm({
                              title: 'Approve purchase request?',
                              description: `Approve ${pr.id} for ${pr.itemName} (${pr.quantity} units)?`,
                              confirmLabel: 'Approve',
                              onConfirm: () => toast.success(`${pr.id} approved`),
                            })
                          }
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 h-8 text-destructive border-destructive/30"
                          onClick={() =>
                            requestConfirm({
                              title: 'Reject purchase request?',
                              description: `Reject ${pr.id} for ${pr.itemName}?`,
                              confirmLabel: 'Reject',
                              destructive: true,
                              onConfirm: () => toast.success(`${pr.id} rejected`),
                            })
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-xl bg-card border-border">
          <DialogHeader><DialogTitle>Add Inventory Item</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            {[
              { label: 'Item Name *', key: 'name', placeholder: 'e.g. HVAC Air Filter 16x20x1' },
              { label: 'SKU *', key: 'sku', placeholder: 'e.g. AF-16X20-001' },
              { label: 'Unit Price ($) *', key: 'unitPrice', placeholder: '0.00', type: 'number' },
              { label: 'Unit', key: 'unit', placeholder: 'e.g. piece, box, litre' },
              { label: 'Current Quantity *', key: 'quantity', placeholder: '0', type: 'number' },
              { label: 'Min Stock Level *', key: 'minStock', placeholder: '5', type: 'number' },
              { label: 'Max Stock Level', key: 'maxStock', placeholder: '50', type: 'number' },
              { label: 'Supplier', key: 'supplier', placeholder: 'e.g. Grainger' },
            ].map(f => (
              <div key={f.key} className="space-y-1.5">
                <Label className="text-xs">{f.label}</Label>
                <Input type={f.type || 'text'} placeholder={f.placeholder}
                  value={(form as Record<string,string>)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label className="text-xs">Category *</Label>
              <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button
              onClick={() =>
                requestConfirm({
                  title: 'Add inventory item?',
                  description: `Add "${form.name}" (${form.sku}) to inventory?`,
                  confirmLabel: 'Add item',
                  onConfirm: () => {
                    setShowCreate(false)
                    toast.success('Inventory item added')
                  },
                })
              }
              disabled={!form.name || !form.sku || !form.category}
            >
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receive Stock Dialog */}
      <Dialog open={!!showReceive} onOpenChange={() => setShowReceive(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Receive Stock</DialogTitle>
            <p className="text-sm text-muted-foreground">{mockInventory.find(i => i.id === showReceive)?.name}</p>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {[
              { label: 'Quantity Received *', key: 'quantity', type: 'number', placeholder: '0' },
              { label: 'Unit Price ($)', key: 'unitPrice', type: 'number', placeholder: '0.00' },
              { label: 'Supplier', key: 'supplier', placeholder: 'Supplier name' },
              { label: 'Invoice Number', key: 'invoiceNumber', placeholder: 'e.g. INV-2024-001' },
            ].map(f => (
              <div key={f.key} className="space-y-1.5">
                <Label className="text-xs">{f.label}</Label>
                <Input type={f.type || 'text'} placeholder={f.placeholder}
                  value={(receiveForm as Record<string,string>)[f.key]}
                  onChange={e => setReceiveForm(p => ({ ...p, [f.key]: e.target.value }))} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReceive(null)}>Cancel</Button>
            <Button
              onClick={() =>
                requestConfirm({
                  title: 'Record stock receipt?',
                  description: `Record receipt of ${receiveForm.quantity} units?`,
                  confirmLabel: 'Confirm receipt',
                  onConfirm: () => {
                    setShowReceive(null)
                    toast.success('Stock receipt recorded')
                  },
                })
              }
              disabled={!receiveForm.quantity}
            >
              Confirm Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Purchase Request Dialog */}
      <Dialog open={showPR} onOpenChange={setShowPR}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle>Create Purchase Request</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Item *</Label>
              <Select value={prForm.itemId} onValueChange={v => setPRForm(p => ({ ...p, itemId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger>
                <SelectContent>
                  {mockInventory.map(i => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.name} (in stock: {i.quantity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Quantity *</Label>
              <Input type="number" placeholder="0" value={prForm.quantity} onChange={e => setPRForm(p => ({ ...p, quantity: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Notes</Label>
              <Input placeholder="Reason for request, urgency, etc." value={prForm.notes} onChange={e => setPRForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPR(false)}>Cancel</Button>
            <Button
              onClick={() =>
                requestConfirm({
                  title: 'Submit purchase request?',
                  description: 'Send this purchase request for approval?',
                  confirmLabel: 'Submit',
                  onConfirm: () => {
                    setShowPR(false)
                    toast.success('Purchase request submitted')
                  },
                })
              }
              disabled={!prForm.itemId || !prForm.quantity}
            >
              Submit Request
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
