import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLocationApi } from '@/features/locations/hooks/useLocationsApi'
import { PageLoader } from '@/components/feedback/PageLoader'
import { PageError } from '@/components/feedback/PageError'
import { Button } from '@/components/ui/button'
import { usePortalPath } from '@/hooks/usePortal'
import { AppHeader } from '@/components/navigation/Navbar'
import { locationsApi } from '../api/locations.api'

export function LocationDetails() {
  const { id } = useParams()
  const { data: locationData, isLoading, isError, refetch } = useLocationApi(id ?? '')
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'work-orders' | 'service-requests' | 'pm' | 'history'>('overview')
  const [relationships, setRelationships] = useState<{ assets: unknown[]; workOrders: unknown[]; serviceRequests: unknown[]; preventiveMaintenance: unknown[] }>({ assets: [], workOrders: [], serviceRequests: [], preventiveMaintenance: [] })
  const [relationshipError, setRelationshipError] = useState<string | null>(null)
  useEffect(() => { if (!id) return; void locationsApi.relationships(id).then(setRelationships).catch((error) => setRelationshipError(error instanceof Error ? error.message : 'Unable to load location relationships')) }, [id])
  const navigate = useNavigate()

  const assetsPath = usePortalPath('assets')
  const workOrdersPath = usePortalPath('work-orders')

  if (isLoading) return <PageLoader label="Loading location details..." />
  if (isError) return <PageError title="Location unavailable" message="Unable to fetch location details. Please try again." onRetry={() => void refetch()} />

  const locationName = locationData?.name || 'Server Room B'
  const parentFacility = locationData?.facilityId || 'Not configured'
  const floorZoneStr = locationData?.description || 'Not configured'
  const floor = (locationData as (typeof locationData & { floor?: string }) | undefined)?.floor || 'Not configured'

  return (
    <div className="min-h-full bg-muted/30 text-foreground">
      <AppHeader title={locationName} subtitle="Location Detail" hideQuickCreate />
      {/* ── Main Content Container ── */}
      <div className="p-8 space-y-6">
        <div className="flex justify-end">
          <Button
            variant="outline"
            className="h-9 rounded-lg border-border bg-card text-[13px] font-medium text-foreground hover:bg-muted/30"
          >
            Edit Location
          </Button>
        </div>
        {relationshipError && <p className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning">Some related location records are unavailable. Refresh to try again.</p>}
        {/* ── 2 Column Spec Panels ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location Context */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-[15px] font-bold text-foreground">Location Context</h2>
            <div className="mt-4 space-y-3 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Facility</span>
                <span className="font-semibold text-foreground">{parentFacility}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Floor</span>
                <span className="font-semibold text-foreground">{floor}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Zone</span>
                <span className="font-semibold text-foreground">{floorZoneStr}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Room Type</span>
                <span className="font-semibold text-foreground">Server/Data Room</span>
              </div>
            </div>
          </div>

          {/* Security & Access Control */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-[15px] font-bold text-foreground">Security & Access Control</h2>
            <div className="mt-4 space-y-3 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Access Protocol</span>
                <span className="font-semibold text-foreground">Fob Sign-in & Biometrics</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Fire Suppression</span>
                <span className="font-semibold text-foreground">FM200 Gas System</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Max Load Target</span>
                <span className="font-semibold text-foreground">45 kW Rack Density</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Temperature Ideal</span>
                <span className="font-semibold text-foreground">68°F - 72°F</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sub-navigation Tabs ── */}
        <div className="border-b border-border flex items-center gap-6">
          {(['overview', 'assets', 'work-orders', 'service-requests', 'pm', 'history'] as const).map((tab) => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-[13px] font-semibold capitalize transition-colors border-b-2 ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            )
          })}
        </div>

        {/* ── Overview Tab Content ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Allocated Assets */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="text-[15px] font-bold text-foreground">Allocated Assets ({relationships.assets.length})</h3>
                <button
                  onClick={() => navigate(`${assetsPath}?location=${locationData?.id || ''}`)}
                  className="text-[12px] font-semibold text-primary hover:underline"
                >
                  Manage Assets
                </button>
              </div>

              <div className="mt-4 divide-y divide-border">
                {relationships.assets.map((asset: any) => (
                  <div key={asset.id} className="flex items-center justify-between py-3.5">
                    <div>
                      <p className="text-[13px] font-bold text-foreground">{asset.name}</p>
                      <p className="text-[11px] font-mono text-muted-foreground">{asset.id}</p>
                    </div>
                    <span
                      className="rounded px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                      style={{ backgroundColor: asset.bg, color: asset.text }}
                    >
                      {asset.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Maintenance Activity */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="text-[15px] font-bold text-foreground">Recent Maintenance activity</h3>
                <button
                  onClick={() => navigate(workOrdersPath)}
                  className="text-[12px] font-semibold text-primary hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="mt-4 divide-y divide-border">
                {relationships.workOrders.map((act: any) => (
                  <div key={act.id} className="flex items-center justify-between py-3.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-foreground">{act.id}:</span>
                        <span className="text-[13px] font-semibold text-foreground">{act.title}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{act.by}</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Related records */}
        {activeTab !== 'overview' && (
          <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
            {(() => { const records: Record<string, unknown[]> = { assets: relationships.assets, 'work-orders': relationships.workOrders, 'service-requests': relationships.serviceRequests, pm: relationships.preventiveMaintenance, history: relationships.workOrders }; const items = records[activeTab] ?? []; return <><p className="text-[14px] font-medium">{items.length} {activeTab.replace('-', ' ')} records for {locationName}.</p><div className="mx-auto mt-5 max-w-xl space-y-2 text-left">{items.slice(0, 5).map((item: any, index) => <div key={item.id ?? item._id ?? index} className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm"><span className="font-semibold text-foreground">{item.name ?? item.title ?? item.id ?? 'Related record'}</span><span className="ml-2 text-muted-foreground">{item.status ?? item.category ?? ''}</span></div>)}</div></> })()}
            <Button
              onClick={() => {
                if (activeTab === 'assets') navigate(`${assetsPath}?location=${locationData?.id || ''}`)
                if (activeTab === 'work-orders') navigate(workOrdersPath)
              }}
              className="mt-4 bg-primary text-primary-foreground text-[13px] hover:bg-primary/90"
            >
              Open Full {activeTab.replace('-', ' ')} Directory
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
