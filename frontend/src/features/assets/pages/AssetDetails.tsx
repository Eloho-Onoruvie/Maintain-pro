import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageLoader } from '@/components/feedback/PageLoader'
import { PageError } from '@/components/feedback/PageError'
import { usePortalPath } from '@/hooks/usePortal'
import { AppHeader } from '@/components/navigation/Navbar'
import { assetsApi } from '@/features/assets/api/assets.api'
import type { BackendAsset } from '@/features/assets/api/assets.contract'
import type { AssetHistoryEntry } from '@/features/assets/api/assets.api'
import { StatusBadge } from '@/components/ui/badge'
import { isDemoMode } from '@/config/runtime'
import { useMockDataStore } from '@/services/mockDataStore'


export function AssetDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const assetsPath = usePortalPath('assets')
  const workOrdersPath = usePortalPath('work-orders')

  const [asset, setAsset] = useState<BackendAsset | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [history, setHistory] = useState<AssetHistoryEntry[]>([])
  const demoAssets = useMockDataStore((state) => state.assets)

  const loadAsset = async () => {
    if (!id) return
    setIsLoading(true)
    setLoadError(null)
    try {
      const data = isDemoMode ? (() => { const item = demoAssets.find((asset) => asset.id === id || asset.assetTag === id); if (!item) throw new Error('Asset not found'); return { ...item, assetTag: item.assetTag ?? item.id, category: item.category as BackendAsset['category'], status: item.status as BackendAsset['status'], condition: 'good', ownership: 'owned', qrCode: '' } as BackendAsset })() : await assetsApi.get(id)
      setAsset(data)
      if (isDemoMode) {
        setHistory([
          { id: `demo-history-${data.assetTag}-1`, organizationId: 'demo-organization', assetId: data.assetTag, event: 'maintenance_completed', description: 'Routine preventive maintenance completed and asset returned to service.', actorId: 'demo-tech-1', sourceType: 'work_order', sourceId: 'WO-PM-001', occurredAt: new Date(Date.now() - 14 * 86400000).toISOString() },
          { id: `demo-history-${data.assetTag}-2`, organizationId: 'demo-organization', assetId: data.assetTag, event: 'asset_registered', description: 'Asset registered in the organization asset catalog.', actorId: 'demo-user', occurredAt: new Date(Date.now() - 180 * 86400000).toISOString() },
        ])
      } else { const result = await assetsApi.history(data.assetTag); setHistory(Array.isArray(result) ? result : result.data ?? []) }
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to load asset details')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { void loadAsset() }, [id, demoAssets])

  if (isLoading) return <PageLoader label="Loading asset details..." />
  if (loadError) return <main className="p-8"><PageError title="Asset unavailable" message={loadError} onRetry={() => void loadAsset()} /></main>

  if (!asset) return <div className="p-8"><p className="font-semibold">Asset not found</p><Button className="mt-4" onClick={() => navigate(assetsPath)}>Back to assets</Button></div>
  const assetName = asset.name
  const assetId = asset.assetTag
  const category = asset.category ?? '—'
  const manufacturer = asset.manufacturer ?? '—'
  const model = asset.modelNumber ?? '—'
  const serialNumber = asset.serialNumber ?? '—'
  const installDate = (asset.installationDate ?? asset.installDate)
    ? new Date(asset.installationDate ?? asset.installDate!).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '—'
  const location = asset.locationId ?? '—'
  const warrantyExpiry = asset.warrantyExpiry
    ? new Date(asset.warrantyExpiry).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '—'
  const qrValue = asset.qrCode || `maintainpro://assets/${encodeURIComponent(assetId)}`

  return (
    <div className="min-h-full bg-muted/30 text-foreground">
      <AppHeader title={assetName} subtitle="Asset Detail" hideQuickCreate />
      {/* ── Main Content ── */}
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-end gap-3">
          <StatusBadge status={String(asset.status ?? 'unknown')} />
          <Button
            variant="outline"
            className="h-9 rounded-lg border-border bg-card text-[13px] font-medium text-foreground hover:bg-muted/30"
          >
            Edit Asset Specs
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Technical Specifications + KPI mini-cards */}
          <div className="space-y-5">
            {/* Technical Specifications Card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-[15px] font-bold text-foreground mb-5">Technical Specifications</h2>
              <div className="space-y-3 text-[13px]">
                {[
                  { label: 'Asset ID', value: assetId },
                  { label: 'Category', value: category },
                  { label: 'Manufacturer', value: manufacturer },
                  { label: 'Model Number', value: model },
                  { label: 'Serial Number', value: serialNumber, mono: true },
                  { label: 'Install Date', value: installDate },
                  { label: 'Physical Location', value: location },
                  { label: 'Warranty Expiry', value: warrantyExpiry },
                ].map(row => (
                  <div key={row.label} className="flex items-start justify-between border-b border-border pb-2.5 last:border-0 last:pb-0">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className={`font-semibold text-foreground text-right ${row.mono ? 'font-mono' : ''}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* KPI Mini Cards Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-[12px] font-medium text-muted-foreground">MTTR (Avg Repair)</p>
                <p className="mt-2 text-3xl font-extrabold text-foreground">—</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-[12px] font-medium text-muted-foreground">Total Maintenance Costs</p>
                <p className="mt-2 text-3xl font-extrabold text-foreground">—</p>
              </div>
            </div>
          </div>

          {/* Right: Asset Life History */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-[15px] font-bold text-foreground">Asset Life History</h2>
              <span className="text-[12px] font-semibold text-muted-foreground">No entries</span>
            </div>

            <div className="mt-4 space-y-0">
              {history.length === 0 ? <p className="py-6 text-sm text-muted-foreground">No maintenance history recorded.</p> : history.map((entry, idx) => (
                <div key={entry.id} className="relative flex gap-4 pb-4">
                  {/* Connector line */}
                  {idx < history.length - 1 && (
                    <div className="absolute left-[6px] top-[18px] bottom-0 w-px bg-border" />
                  )}

                  {/* Dot */}
                  <div
                    className="relative z-10 mt-1 h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: idx === 0 ? 'var(--primary)' : 'var(--muted-foreground)' }}
                  />

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[13px] font-bold text-foreground">
                          <span className="text-primary">{entry.event}</span>
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{entry.description || 'Asset activity recorded'}</p>
                      </div>
                      <span className="flex-shrink-0 text-[11px] text-muted-foreground">{new Date(entry.occurredAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quick Action Buttons ── */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate(workOrdersPath)}
            className="text-[13px] font-semibold"
          >
            Create Work Order
          </Button>
          <Button variant="outline" className="text-[13px]">
            Schedule PM
          </Button>
          <Button variant="outline" className="text-[13px]">
            View Documents
          </Button>
          <Button variant="outline" className="text-[13px]" onClick={() => void assetsApi.downloadQr(assetId)}>
            <Download className="mr-2 h-4 w-4" /> Download QR
          </Button>
          <Button variant="outline" className="text-[13px]" onClick={() => void assetsApi.downloadPdf(assetId)}>
            <FileText className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
