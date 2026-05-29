import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, QrCode, Edit, FileText, History, Wrench,
  MapPin, Calendar, DollarSign, AlertTriangle, CheckCircle2, Package, Upload
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockAssets } from '../services/assets.service'
import { formatDate } from '@/utils/formatDate'
import { cn } from '@/utils/helpers'
import type { AssetStatus } from '@/types/common.types'

const statusConfig: Record<AssetStatus, { label: string; color: string }> = {
  active:       { label: 'Operational',       color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  needs_maintenance: { label: 'Needs Maintenance', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  under_repair:      { label: 'Under Repair',      color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  decommissioned:    { label: 'Decommissioned',    color: 'text-muted-foreground bg-muted border-border' },
  down:              { label: 'Down',              color: 'text-red-400 bg-red-400/10 border-red-400/20' }, // Added
}

const mockHistory = [
  { id: '1', date: new Date('2024-11-15'), type: 'Preventive', description: 'Quarterly HVAC service — filters replaced, coils cleaned', cost: 320, technician: 'Mike Rodriguez' },
  { id: '2', date: new Date('2024-08-03'), type: 'Reactive',   description: 'Compressor replacement after failure', cost: 2100, technician: 'External — CoolTech HVAC' },
  { id: '3', date: new Date('2024-05-20'), type: 'Inspection', description: 'Annual compliance inspection — passed', cost: 150, technician: 'Mike Rodriguez' },
]

const mockDocs = [
  { id: '1', name: 'User Manual.pdf',       type: 'Manual',   uploadedAt: new Date('2023-01-15'), size: '4.2 MB' },
  { id: '2', name: 'Warranty Certificate.pdf', type: 'Warranty', uploadedAt: new Date('2023-01-15'), size: '1.1 MB' },
  { id: '3', name: 'Installation Report.pdf',  type: 'Report',   uploadedAt: new Date('2023-01-20'), size: '2.8 MB' },
]

export function AssetDetails() {
  const { id } = useParams()
  const asset = mockAssets.find(a => a.id === id) || mockAssets[0]
  const s = statusConfig[asset.status]
  const [showQR, setShowQR] = useState(false)

  const totalCost = mockHistory.reduce((sum, h) => sum + h.cost, 0)

  return (
    <div className="flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild aria-label="Back to assets list">
            <Link to="/assets"><ArrowLeft className="h-4 w-4" aria-hidden /></Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-foreground">{asset.name}</h1>
              <Badge variant="outline" className={cn('text-xs', s.color)}>{s.label}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" />{asset.locationName}
              {asset.serialNumber && <><span>·</span><span className="font-mono">{asset.serialNumber}</span></>}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowQR(true)}>
              <QrCode className="h-4 w-4" /> QR Code
            </Button>
            <Button size="sm" className="gap-2"><Edit className="h-4 w-4" /> Edit</Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left col — details + KPIs */}
          <div className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Asset Details</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Category',     value: asset.category },
                  { label: 'Manufacturer', value: asset.manufacturer || '—' },
                  { label: 'Model',        value: asset.model || '—' },
                  { label: 'Serial No.',   value: asset.serialNumber || '—', mono: true },
                  { label: 'Install Date', value: asset.installDate ? formatDate(asset.installDate) : '—' },
                  { label: 'Warranty',     value: asset.warrantyExpiry ? formatDate(asset.warrantyExpiry) : '—' },
                  { label: 'Purchase Cost', value: asset.purchaseCost ? `$${asset.purchaseCost.toLocaleString()}` : '—' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-start">
                    <span className="text-xs text-muted-foreground">{row.label}</span>
                    <span className={cn('text-xs text-right font-medium', row.mono && 'font-mono')}>{row.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* KPI cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Maintenance Cost', value: `$${totalCost.toLocaleString()}`, icon: DollarSign, color: 'text-amber-400' },
                { label: 'Service Records', value: mockHistory.length, icon: History, color: 'text-blue-400' },
                { label: 'Last Serviced', value: mockHistory[0] ? formatDate(mockHistory[0].date) : '—', icon: Wrench, color: 'text-emerald-400' },
                { label: 'Next Due', value: asset.nextMaintenanceDate ? formatDate(asset.nextMaintenanceDate) : '—', icon: Calendar, color: asset.nextMaintenanceDate && new Date(asset.nextMaintenanceDate) < new Date() ? 'text-red-400' : 'text-foreground' },
              ].map(k => (
                <Card key={k.label} className="bg-card border-border">
                  <CardContent className="p-3">
                    <k.icon className={cn('h-4 w-4 mb-2', k.color)} />
                    <p className="text-lg font-semibold text-foreground">{k.value}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{k.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Warranty status */}
            {asset.warrantyExpiry && (
              <Card className={cn('border', new Date(asset.warrantyExpiry) > new Date() ? 'border-emerald-400/20 bg-emerald-400/5' : 'border-red-400/20 bg-red-400/5')}>
                <CardContent className="p-3 flex items-center gap-2">
                  {new Date(asset.warrantyExpiry) > new Date()
                    ? <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    : <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />}
                  <div>
                    <p className="text-xs font-medium">Warranty {new Date(asset.warrantyExpiry) > new Date() ? 'Active' : 'Expired'}</p>
                    <p className="text-[11px] text-muted-foreground">Until {formatDate(asset.warrantyExpiry)}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right col — tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="history">
              <TabsList className="bg-muted border border-border">
                <TabsTrigger value="history" className="gap-2"><History className="h-3.5 w-3.5" />Maintenance History</TabsTrigger>
                <TabsTrigger value="documents" className="gap-2"><FileText className="h-3.5 w-3.5" />Documents</TabsTrigger>
                <TabsTrigger value="workorders" className="gap-2"><Package className="h-3.5 w-3.5" />Work Orders</TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="mt-4 space-y-3">
                {mockHistory.map(h => (
                  <Card key={h.id} className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">{h.type}</Badge>
                            <span className="text-xs text-muted-foreground">{formatDate(h.date)}</span>
                          </div>
                          <p className="text-sm text-foreground">{h.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">Technician: {h.technician}</p>
                        </div>
                        <span className="text-sm font-semibold text-amber-400 whitespace-nowrap">${h.cost.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="documents" className="mt-4 space-y-3">
                <div className="flex justify-end">
                  <Button size="sm" variant="outline" className="gap-2"><Upload className="h-4 w-4" />Upload Document</Button>
                </div>
                {mockDocs.map(doc => (
                  <Card key={doc.id} className="bg-card border-border">
                    <CardContent className="p-4 flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.type} · {doc.size} · Uploaded {formatDate(doc.uploadedAt)}</p>
                      </div>
                      <Button size="sm" variant="ghost">Download</Button>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="workorders" className="mt-4">
                <Card className="bg-card border-border">
                  <CardContent className="p-6 text-center text-muted-foreground">
                    <Wrench className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No open work orders for this asset</p>
                    <Button size="sm" className="mt-3 gap-2" asChild>
                      <Link to={`/work-orders/new?assetId=${asset.id}`}><Plus className="h-4 w-4" />Create Work Order</Link>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={() => setShowQR(false)}>
          <Card className="bg-card border-border p-6 text-center space-y-3" onClick={e => e.stopPropagation()}>
            <p className="font-medium">{asset.name}</p>
            <div className="w-48 h-48 bg-white mx-auto rounded-lg flex items-center justify-center">
              <QrCode className="h-32 w-32 text-black" />
            </div>
            <p className="text-xs text-muted-foreground font-mono">{asset.id}</p>
            <Button onClick={() => setShowQR(false)} variant="outline">Close</Button>
          </Card>
        </div>
      )}
    </div>
  )
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 5v14M5 12h14"/></svg>
}
