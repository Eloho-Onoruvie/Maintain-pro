import { useState, useMemo, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useRoleAccess } from '@/hooks/useRoleAccess'
import { AppHeader } from '@/components/navigation/Navbar'
import { toast } from 'sonner'
import { inventoryService } from '../services/inventory.service'
import { isDemoMode } from '@/config/runtime'

// ── Mock Data for Items View ──────────────────────────────────────────────────
const MOCK_INVENTORY_ITEMS = [
  { name: 'Chiller Filter Cartridges', sku: 'CHL-FIL-092', category: 'HVAC Filters', stockLocation: 'HQ Basement Zone A', availQty: 2, resQty: 1, minLvl: 10, unitCost: '$145.00', status: 'CRITICAL LOW' },
  { name: 'Fluorescent Bulbs 4ft', sku: 'LGT-FL4-012', category: 'Electrical', stockLocation: 'West Annex Supply Room', availQty: 15, resQty: 5, minLvl: 40, unitCost: '$4.50', status: 'LOW STOCK' },
  { name: 'HVAC V-Belts (Size 12)', sku: 'BEL-V12-401', category: 'HVAC Belts', stockLocation: 'HQ Roof Main Cage', availQty: 4, resQty: 0, minLvl: 12, unitCost: '$24.99', status: 'LOW STOCK' },
  { name: 'Brass Ball Valve 1/2"', sku: 'PLB-VAL-102', category: 'Plumbing', stockLocation: 'West Annex Closet B', availQty: 1, resQty: 2, minLvl: 8, unitCost: '$18.75', status: 'CRITICAL LOW' },
  { name: 'Air Purifier Filter HEPA', sku: 'CHL-HEPA-33', category: 'HVAC Filters', stockLocation: 'Silicon Lab Cleanroom', availQty: 12, resQty: 0, minLvl: 5, unitCost: '$89.00', status: 'IN STOCK' },
  { name: '10W-30 Motor Oil', sku: 'LUB-010-30', category: 'Lubricants', stockLocation: 'Central Depot Room 4', availQty: 32, resQty: 8, minLvl: 20, unitCost: '$12.00', status: 'IN STOCK' },
  { name: 'LED Spotlights 12W', sku: 'LGT-LED-SPOT', category: 'Electrical', stockLocation: 'HQ Basement Zone B', availQty: 65, resQty: 4, minLvl: 20, unitCost: '$8.90', status: 'IN STOCK' },
  { name: 'Copper Coupling 2"', sku: 'PLB-COP-CPL', category: 'Plumbing', stockLocation: 'Central Depot Room 1', availQty: 18, resQty: 12, minLvl: 15, unitCost: '$3.15', status: 'IN STOCK' },
  { name: 'Teflon Thread Tape 1/2"', sku: 'PLB-TAP-TEF', category: 'Plumbing', stockLocation: 'Central Depot Shelf C', availQty: 94, resQty: 0, minLvl: 30, unitCost: '$0.95', status: 'IN STOCK' },
  { name: 'Heavy Duty Cable Ties', sku: 'HDW-CBL-TIE', category: 'Hardware', stockLocation: 'HQ Basement Utility Desk', availQty: 240, resQty: 10, minLvl: 50, unitCost: '$0.12', status: 'IN STOCK' },
]

export function Inventory() {
  const { canManageInventory } = useRoleAccess()
  const [viewMode, setViewMode] = useState<'items' | 'overview'>('items')
  const [inventoryItems, setInventoryItems] = useState(() => isDemoMode ? MOCK_INVENTORY_ITEMS : [])
  useEffect(() => { if (!isDemoMode) void inventoryService.listItems().then((result) => setInventoryItems((result ?? []).map((item) => ({ name: item.name, sku: item.sku, category: item.categoryId ?? 'General', stockLocation: '—', availQty: 0, resQty: 0, minLvl: item.minimumStockLevel, unitCost: '—', status: item.status } as typeof MOCK_INVENTORY_ITEMS[number])))).catch(() => toast.error('Unable to load inventory')) }, [])

  // Filters state
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [stockLevelFilter, setStockLevelFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  const [form, setForm] = useState({ name: '', sku: '', category: 'HVAC Filters', location: 'HQ Basement Zone A', qty: '10', minQty: '5', cost: '15.00' })

  const filteredItems = useMemo(() => {
    return inventoryItems.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase())
      const matchCat = categoryFilter === 'all' || item.category === categoryFilter
      const matchLoc = locationFilter === 'all' || item.stockLocation.includes(locationFilter)
      const matchLevel = stockLevelFilter === 'all' || item.status.toLowerCase().replace(' ', '_') === stockLevelFilter
      return matchSearch && matchCat && matchLoc && matchLevel
    })
  }, [inventoryItems, search, categoryFilter, locationFilter, stockLevelFilter])

  function getStatusStyle(status: string) {
    if (status === 'CRITICAL LOW') return { bg: '#fee2e2', text: '#ef4444' }
    if (status === 'LOW STOCK') return { bg: '#fef3c7', text: '#d97706' }
    if (status === 'IN STOCK') return { bg: '#dcfce7', text: '#16a34a' }
    return { bg: '#f1f5f9', text: '#64748b' }
  }

  return (
    <div className="min-h-full bg-background text-foreground">
      <AppHeader title={viewMode === 'overview' ? 'Inventory Overview' : 'All Items'} hideQuickCreate />
      {/* Top Header / Breadcrumb */}
      <div className="border-b border-border bg-card px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {viewMode === 'overview' ? 'Inventory Overview' : 'Inventory Items'}
            </h1>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              {viewMode === 'overview'
                ? 'Monitor stock levels, critical restock thresholds, and parts distributions.'
                : 'Comprehensive catalog lookup, available quantity monitoring, and physical tracking tags.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab Toggle */}
            <div className="flex items-center rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-1 text-[12px] font-semibold">
              <button
                onClick={() => setViewMode('items')}
                className={`rounded-md px-3 py-1.5 transition-colors ${viewMode === 'items' ? 'bg-white text-[#0f172a] shadow-sm' : 'text-[#64748b] hover:text-[#0f172a]'}`}
              >
                All Items
              </button>
              <button
                onClick={() => setViewMode('overview')}
                className={`rounded-md px-3 py-1.5 transition-colors ${viewMode === 'overview' ? 'bg-white text-[#0f172a] shadow-sm' : 'text-[#64748b] hover:text-[#0f172a]'}`}
              >
                Dashboard
              </button>
            </div>

            {canManageInventory && viewMode === 'items' && (
              <Button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 rounded-lg bg-[#4f46e5] px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[#4338ca] transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            )}
          </div>
        </div>

        {/* Filter Bar (Only in Items View) */}
        {viewMode === 'items' && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
              <Input
                placeholder="Search: Filter cartridges..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-9 rounded-lg border-[#e2e8f0] bg-[#f8fafc] pl-9 text-[13px] focus:bg-white"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-9 w-44 rounded-lg border-[#e2e8f0] bg-white text-[13px]">
                <SelectValue placeholder="Category: HVAC Filters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Category: All</SelectItem>
                <SelectItem value="HVAC Filters">HVAC Filters</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="HVAC Belts">HVAC Belts</SelectItem>
                <SelectItem value="Plumbing">Plumbing</SelectItem>
                <SelectItem value="Lubricants">Lubricants</SelectItem>
                <SelectItem value="Hardware">Hardware</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="h-9 w-48 rounded-lg border-[#e2e8f0] bg-white text-[13px]">
                <SelectValue placeholder="Stock Location: Central HQ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Stock Location: All</SelectItem>
                <SelectItem value="HQ">Central HQ</SelectItem>
                <SelectItem value="West Annex">West Annex</SelectItem>
                <SelectItem value="Silicon Lab">Silicon Lab</SelectItem>
                <SelectItem value="Central Depot">Central Depot</SelectItem>
              </SelectContent>
            </Select>

            <Select value={stockLevelFilter} onValueChange={setStockLevelFilter}>
              <SelectTrigger className="h-9 w-44 rounded-lg border-[#e2e8f0] bg-white text-[13px]">
                <SelectValue placeholder="Stock Level: Low Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Stock Level: All</SelectItem>
                <SelectItem value="critical_low">Critical Low</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-8">
        {viewMode === 'items' ? (
          /* All Items Data Table */
          <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                <tr>
                  <th className="px-6 py-3.5">Item Name</th>
                  <th className="px-6 py-3.5">SKU</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Stock Location</th>
                  <th className="px-6 py-3.5 text-center">Avail Qty</th>
                  <th className="px-6 py-3.5 text-center">Res Qty</th>
                  <th className="px-6 py-3.5 text-center">Min Lvl</th>
                  <th className="px-6 py-3.5">Unit Cost</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filteredItems.map((item, idx) => {
                  const s = getStatusStyle(item.status)
                  return (
                    <tr key={idx} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="px-6 py-4 font-bold text-[#0f172a]">{item.name}</td>
                      <td className="px-6 py-4 font-mono text-[12px] text-[#64748b]">{item.sku}</td>
                      <td className="px-6 py-4 text-[#475569]">{item.category}</td>
                      <td className="px-6 py-4 text-[#475569]">{item.stockLocation}</td>
                      <td className="px-6 py-4 text-center font-bold text-[#0f172a]">{item.availQty}</td>
                      <td className="px-6 py-4 text-center text-[#64748b]">{item.resQty}</td>
                      <td className="px-6 py-4 text-center text-[#64748b]">{item.minLvl}</td>
                      <td className="px-6 py-4 font-semibold text-[#0f172a]">{item.unitCost}</td>
                      <td className="px-6 py-4">
                        <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase" style={{ backgroundColor: s.bg, color: s.text }}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info(`Editing ${item.name}`)}
                          className="h-7 rounded-md bg-[#f1f5f9] px-3 text-[12px] font-semibold text-[#0f172a] hover:bg-[#e2e8f0]"
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Table Footer */}
            <div className="flex items-center justify-between border-t border-[#e2e8f0] bg-white px-6 py-4 text-[13px] text-[#64748b]">
              <div>
                Showing <span className="font-semibold text-[#0f172a]">1-10</span> of{' '}
                <span className="font-semibold text-[#0f172a]">342</span> items
              </div>
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="sm" className="h-8 rounded-md border-[#e2e8f0] px-3 text-[12px]">Previous</Button>
                <Button size="sm" className="h-8 rounded-md bg-[#4f46e5] px-3 text-[12px] font-semibold text-white">1</Button>
                <Button variant="outline" size="sm" className="h-8 rounded-md border-[#e2e8f0] px-3 text-[12px]">2</Button>
                <Button variant="outline" size="sm" className="h-8 rounded-md border-[#e2e8f0] px-3 text-[12px]">3</Button>
                <Button variant="outline" size="sm" className="h-8 rounded-md border-[#e2e8f0] px-3 text-[12px]">Next</Button>
              </div>
            </div>
          </div>
        ) : (
          /* Inventory Overview Dashboard View */
          <InventoryDashboard />
        )}
      </div>

      {/* Add Item Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-white border-[#e2e8f0] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#0f172a]">Add Inventory Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-[13px]">
            <div className="space-y-1">
              <Label className="text-[12px] font-semibold text-[#0f172a]">Item Name *</Label>
              <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Chiller Filter Cartridge" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[12px] font-semibold text-[#0f172a]">SKU</Label>
                <Input value={form.sku} onChange={e => setForm(p => ({ ...p, sku: e.target.value }))} placeholder="CHL-001" />
              </div>
              <div className="space-y-1">
                <Label className="text-[12px] font-semibold text-[#0f172a]">Unit Cost ($)</Label>
                <Input value={form.cost} onChange={e => setForm(p => ({ ...p, cost: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={() => { toast.success('Item added'); setShowAddModal(false) }} className="bg-[#4f46e5] text-white">
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function InventoryDashboard() {
  return (
    <div className="space-y-6">
      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Items', val: '342', sub: 'In catalog' },
          { label: 'Low Stock Items', val: '8', sub: '• Below safety stock', isWarning: true },
          { label: 'Reserved Items', val: '23', sub: 'Allocated to WOs' },
          { label: 'Pending Transfers', val: '4', sub: 'Across locations' },
          { label: 'Categories', val: '15', sub: 'Parts grouping' },
        ].map((kpi, idx) => (
          <div key={idx} className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm space-y-1">
            <p className="text-[12px] font-medium text-[#64748b]">{kpi.label}</p>
            <p className="text-3xl font-extrabold text-[#0f172a]">{kpi.val}</p>
            <p className={`text-[11px] font-medium ${kpi.isWarning ? 'text-[#d97706]' : 'text-[#94a3b8]'}`}>
              {kpi.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Grid: Low Stock Alerts + Stock by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Low Stock Alerts Table (2 cols) */}
        <div className="lg:col-span-2 rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-[15px] font-bold text-[#0f172a]">Low Stock Alerts</h2>
            <p className="text-[12px] text-[#64748b]">Items currently resting below safety levels requiring replenishment orders</p>
          </div>

          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[10px] font-bold uppercase text-[#64748b]">
              <tr>
                <th className="py-2.5">ITEM NAME</th>
                <th className="py-2.5">CATEGORY</th>
                <th className="py-2.5 text-center">ON HAND</th>
                <th className="py-2.5 text-center">MIN LEVEL</th>
                <th className="py-2.5">LOCATION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {[
                { name: 'Chiller Filter Cartridges', cat: 'HVAC Filters', onHand: 2, min: 10, loc: 'HQ Basement' },
                { name: 'Fluorescent Bulbs 4ft', cat: 'Electrical', onHand: 15, min: 40, loc: 'West Annex' },
                { name: 'HVAC V-Belts (Size 12)', cat: 'HVAC Belts', onHand: 4, min: 12, loc: 'HQ Roof Suite' },
                { name: 'Industrial Pipe Sealant', cat: 'Plumbing', onHand: 3, min: 15, loc: 'North Supply' },
                { name: 'Brass Ball Valve 1/2"', cat: 'Plumbing', onHand: 1, min: 8, loc: 'West Annex' },
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-bold text-[#0f172a]">{row.name}</td>
                  <td className="py-3 text-[#64748b]">{row.cat}</td>
                  <td className="py-3 text-center font-bold text-[#ef4444]">{row.onHand}</td>
                  <td className="py-3 text-center text-[#64748b]">{row.min}</td>
                  <td className="py-3 text-[#475569]">{row.loc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Stock by Category bars (1 col) */}
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-[15px] font-bold text-[#0f172a]">Stock by Category</h2>
            <p className="text-[12px] text-[#64748b]">Overall asset classification volume distribution</p>
          </div>

          <div className="space-y-4 text-[13px]">
            {[
              { cat: 'Electrical Parts', count: '120 items', pct: '80%', color: '#4f46e5' },
              { cat: 'HVAC & Filtering', count: '85 items', pct: '60%', color: '#0284c7' },
              { cat: 'Plumbing Supplies', count: '64 items', pct: '45%', color: '#16a34a' },
              { cat: 'Hardware & Fasteners', count: '48 items', pct: '35%', color: '#d97706' },
              { cat: 'Janitorial & Chemicals', count: '25 items', pct: '20%', color: '#ef4444' },
            ].map((c, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#0f172a]">{c.cat}</span>
                  <span className="text-[#64748b]">{c.count}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#f1f5f9]">
                  <div className="h-2 rounded-full" style={{ width: c.pct, backgroundColor: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Recent Transactions + Stock Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Audit Trail (2 cols) */}
        <div className="lg:col-span-2 rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-[15px] font-bold text-[#0f172a]">Recent Transactions</h2>
            <p className="text-[12px] text-[#64748b]">Real-time ledger audit trail of item receipts, assignments, and transfers</p>
          </div>

          <div className="space-y-3 text-[13px]">
            {[
              { type: 'ISSUE', name: 'HVAC V-Belt (Size 12)', qty: '-2', loc: 'HQ Roof Suite', time: '10m ago', user: 'John D.', typeColor: { bg: '#fee2e2', text: '#ef4444' } },
              { type: 'RECEIVE', name: 'LED Spotlights 12W', qty: '+50', loc: 'North Supply', time: '1h ago', user: 'Sarah J.', typeColor: { bg: '#dcfce7', text: '#16a34a' } },
              { type: 'TRANSFER', name: 'Brass Connector 1/2"', qty: '10', loc: 'West Annex', time: '2h ago', user: 'Dave M.', typeColor: { bg: '#fef3c7', text: '#d97706' } },
              { type: 'RETURN', name: 'Fluorescent Bulbs 4ft', qty: '+3', loc: 'HQ Basement', time: '4h ago', user: 'John D.', typeColor: { bg: '#f1f5f9', text: '#64748b' } },
              { type: 'ISSUE', name: '10W-30 Motor Oil', qty: '-4L', loc: 'East Annex', time: '1d ago', user: 'Mark K.', typeColor: { bg: '#fee2e2', text: '#ef4444' } },
            ].map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-[#f1f5f9] pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase" style={{ backgroundColor: tx.typeColor.bg, color: tx.typeColor.text }}>
                    {tx.type}
                  </span>
                  <span className="font-bold text-[#0f172a]">{tx.name}</span>
                  <span className={`font-bold ${tx.qty.startsWith('-') ? 'text-[#ef4444]' : 'text-[#16a34a]'}`}>{tx.qty}</span>
                </div>
                <div className="flex items-center gap-4 text-[12px] text-[#64748b]">
                  <span>{tx.loc}</span>
                  <span>{tx.time}</span>
                  <span className="font-medium text-[#0f172a]">{tx.user}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Locations Cards (1 col) */}
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-[15px] font-bold text-[#0f172a]">Stock Locations</h2>
            <p className="text-[12px] text-[#64748b]">Distribution of items across warehouse zones</p>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Central HQ Basement', code: 'WH-A • Primary Zone', count: '184' },
              { name: 'North Logistics Hub', code: 'WH-B • Bulk Storage', count: '96' },
              { name: 'West Campus Annex', code: 'WH-C • Regional Depot', count: '48' },
              { name: 'Silicon Valley Lab', code: 'WH-D • Cleanroom Safe', count: '14' },
            ].map((loc, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-3.5">
                <div>
                  <p className="text-[13px] font-bold text-[#0f172a]">{loc.name}</p>
                  <p className="text-[11px] text-[#64748b]">{loc.code}</p>
                </div>
                <span className="rounded-md bg-[#e0f2fe] px-2.5 py-1 text-[12px] font-extrabold text-[#0284c7]">
                  {loc.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
