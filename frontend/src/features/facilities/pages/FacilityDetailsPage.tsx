import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFacility } from '../hooks/useFacilities'
import { facilitiesApi } from '../api/facilities.api'
import { PageLoader } from '@/components/feedback/PageLoader'
import { PageError } from '@/components/feedback/PageError'
import { Button } from '@/components/ui/button'
import { usePortalPath } from '@/hooks/usePortal'
import { AppHeader } from '@/components/navigation/Navbar'

export function FacilityDetailsPage() {
  const { facilityId = '' } = useParams()
  const navigate = useNavigate()
  const { data: facility, isLoading, isError, refetch } = useFacility(facilityId)
  const [activeTab, setActiveTab] = useState<'overview' | 'locations' | 'assets' | 'work-orders' | 'pm' | 'vendors'>('overview')
  const [relationships, setRelationships] = useState<{ locations: unknown[]; assets: unknown[]; workOrders: unknown[]; vendors: unknown[] }>({ locations: [], assets: [], workOrders: [], vendors: [] })
  const [relationshipError, setRelationshipError] = useState<string | null>(null)
  useEffect(() => { if (!facilityId) return; void facilitiesApi.relationships(facilityId).then(setRelationships).catch((error) => setRelationshipError(error instanceof Error ? error.message : 'Unable to load facility relationships')) }, [facilityId])

  const locationsPath = usePortalPath('locations')
  const assetsPath = usePortalPath('assets')
  const workOrdersPath = usePortalPath('work-orders')

  if (isLoading) return <PageLoader label="Loading facility overview..." />
  if (isError) return <PageError title="Facility unavailable" message="Unable to fetch facility details. Please try again." onRetry={() => void refetch()} />

  const facilityName = facility?.name || 'Facility'
  const addressStr = facility ? Object.values(facility.address).filter(Boolean).join(', ') : 'Address unavailable'
  const managerName = 'Not configured'
  const primaryPhone = 'Not configured'
  const emergencyPhone = 'Not configured'
  const liveUnavailable = '—'
  const subLocationCount = relationships.locations.length
  const assetCount = relationships.assets.length
  const openWorkOrderCount = relationships.workOrders.filter((item: any) => !['completed', 'cancelled'].includes(item.status)).length

  return (
    <div className="min-h-full bg-muted/30 text-foreground">
      <AppHeader title={facilityName} subtitle="Facility Detail" hideQuickCreate />
      {/* ── Page Content ── */}
      <div className="p-8 space-y-6">
        <div className="flex justify-end">
          <Button
            variant="outline"
            className="h-9 rounded-lg border-border bg-card text-[13px] font-medium text-foreground hover:bg-muted/30"
          >
            Edit Facility
          </Button>
        </div>
        {relationshipError && <p className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning">Some related facility records are unavailable. Refresh to try again.</p>}
        {/* ── Top Context Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Information */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-[15px] font-bold text-foreground">General Information</h2>
            <div className="mt-4 space-y-3 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Address</span>
                <span className="font-semibold text-foreground text-right">{addressStr}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Facility Manager</span>
                <span className="font-semibold text-foreground">{managerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Primary Phone</span>
                <span className="font-semibold text-foreground">{primaryPhone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Emergency Contact</span>
                <span className="font-semibold text-foreground">{emergencyPhone}</span>
              </div>
            </div>
          </div>

          {/* Operational Scope */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-[15px] font-bold text-foreground">Operational Scope</h2>
            <div className="mt-4 space-y-3 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Property Type</span>
                <span className="font-semibold text-foreground">Commercial Office</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Year Built</span>
                <span className="font-semibold text-foreground">2018</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Gross Area</span>
                <span className="font-semibold text-foreground">124,000 sq ft</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sub-locations</span>
                <span className="font-semibold text-foreground">12 Floors / Zones</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sub-navigation Tabs ── */}
        <div className="border-b border-border flex items-center gap-6">
          {(['overview', 'locations', 'assets', 'work-orders', 'pm', 'vendors'] as const).map((tab) => {
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
          <div className="space-y-6">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-[12px] font-medium text-muted-foreground">Sub-Locations</p>
                <p className="mt-2 text-3xl font-extrabold text-foreground">{subLocationCount || liveUnavailable}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">Loaded from related records</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-[12px] font-medium text-muted-foreground">Tracked Assets</p>
                <p className="mt-2 text-3xl font-extrabold text-foreground">{assetCount || liveUnavailable}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">Loaded from related records</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-[12px] font-medium text-muted-foreground">Open Work Orders</p>
                <p className="mt-2 text-3xl font-extrabold text-foreground">{openWorkOrderCount || liveUnavailable}</p>
                <p className="mt-1 text-[11px] text-destructive font-medium">Loaded from related records</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-[12px] font-medium text-muted-foreground">PM Compliance</p>
                <p className="mt-2 text-3xl font-extrabold text-foreground">{liveUnavailable}</p>
                <p className="mt-1 text-[11px] text-success font-medium">Not provided by live endpoint</p>
              </div>
            </div>

            {/* Bottom 2 Panel Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Locations Health */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <h3 className="text-[15px] font-bold text-foreground">Locations Health</h3>
                  <button
                    onClick={() => navigate(locationsPath)}
                    className="text-[12px] font-semibold text-primary hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="mt-4 divide-y divide-border">
                  {relationships.locations.map((loc: any) => (
                    <div key={loc.name} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-[13px] font-bold text-foreground">{loc.name}</p>
                        <p className="text-[12px] text-muted-foreground">{loc.floor}</p>
                      </div>
                      <span
                        className="rounded px-2 py-0.5 text-[11px] font-bold uppercase"
                        style={{ backgroundColor: loc.bg, color: loc.text }}
                      >
                        {loc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Work Orders */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <h3 className="text-[15px] font-bold text-foreground">Recent Work Orders</h3>
                  <button
                    onClick={() => navigate(workOrdersPath)}
                    className="text-[12px] font-semibold text-primary hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="mt-4 divide-y divide-border">
                  {relationships.workOrders.map((wo: any) => (
                    <div key={wo.id} className="flex items-center justify-between py-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold text-foreground">{wo.id}</span>
                          <span className="text-[13px] text-muted-foreground">{wo.title}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{wo.time}</p>
                      </div>
                      <span
                        className="rounded px-2 py-0.5 text-[11px] font-bold uppercase"
                        style={{ backgroundColor: wo.bg, color: wo.text }}
                      >
                        {wo.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Related records */}
        {activeTab !== 'overview' && (
          <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
            <p className="text-[14px] font-medium">{({ locations: relationships.locations, assets: relationships.assets, 'work-orders': relationships.workOrders, pm: [], vendors: relationships.vendors } as Record<string, unknown[]>)[activeTab]?.length ?? 0} {activeTab.replace('-', ' ')} records for {facilityName}.</p>
            <div className="mx-auto mt-5 max-w-xl space-y-2 text-left">
              {(({ locations: relationships.locations, assets: relationships.assets, 'work-orders': relationships.workOrders, pm: [], vendors: relationships.vendors } as Record<string, unknown[]>)[activeTab] ?? []).slice(0, 5).map((item: any, index) => <div key={item.id ?? item._id ?? index} className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm"><span className="font-semibold text-foreground">{item.name ?? item.title ?? item.assetTag ?? item.id ?? 'Related record'}</span><span className="ml-2 text-muted-foreground">{item.status ?? item.category ?? item.locationName ?? ''}</span></div>)}
            </div>
            <Button
              onClick={() => {
                if (activeTab === 'locations') navigate(locationsPath)
                if (activeTab === 'assets') navigate(assetsPath)
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
