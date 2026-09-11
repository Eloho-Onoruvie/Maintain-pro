import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { facilitiesApi } from '../api/facilities.api';
import type { Facility, FacilityPayload, FacilitiesResponse } from '../types/facility.types';
import { queryTiming } from '@/lib/query-options';
import { isDemoMode } from '@/config/runtime';
import { useMockDataStore } from '@/services/mockDataStore';
import type { Location as DemoLocation } from '@/types/common.types';

function demoFacilities(locations: DemoLocation[], assets: unknown[], workOrders: Array<{ status?: string }>): Facility[] {
  // Keep the list KPIs aligned with the canonical facility demo story. Related
  // tables intentionally show a smaller preview set, so deriving these values
  // from preview rows made the list contradict the facility detail page.
  const locationCount = 12
  const assetCount = 47
  const openWorkOrderCount = 8
  const ids = [...new Set(locations.map((location) => location.facilityId).filter(Boolean))];
  if (ids.length === 0) return [{ id: 'demo-facility', organizationId: 'demo-organization', name: 'MaintainPro Demo Facility', address: { street: '100 Main Street', city: 'New York', state: 'NY', country: 'US' }, coordinates: { type: 'Point', coordinates: [0, 0] }, status: 'active', description: 'Primary facility for the MaintainPro demonstration workspace.', createdAt: new Date(0).toISOString(), updatedAt: new Date(0).toISOString(), locationCount, assetCount, openWorkOrderCount }];
  return ids.map((id, index) => ({
    id: id as string,
    organizationId: 'demo-organization',
    name: `Demo Facility ${index + 1}`,
    address: { street: '', city: '', state: '', country: '' },
    coordinates: { type: 'Point', coordinates: [0, 0] },
    status: 'active',
    description: 'Demo facility from fixture locations',
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
    locationCount,
    assetCount,
    openWorkOrderCount,
  }));
}
export const facilityKeys = { all: ['facilities'] as const, detail: (id: string) => ['facilities', id] as const };
export function useFacilities() { const locations = useMockDataStore((state) => state.locations); const assets = useMockDataStore((state) => state.assets); const workOrders = useMockDataStore((state) => state.workOrders); return useQuery<FacilitiesResponse>({ queryKey: facilityKeys.all, queryFn: () => isDemoMode ? Promise.resolve({ data: demoFacilities(locations, assets, workOrders), pagination: { page: 1, limit: 100, total: demoFacilities(locations, assets, workOrders).length, pages: 1 } }) : facilitiesApi.list(), ...queryTiming.reference, retry: false }); }
export function useFacility(id: string) { const locations = useMockDataStore((state) => state.locations); const assets = useMockDataStore((state) => state.assets); const workOrders = useMockDataStore((state) => state.workOrders); return useQuery({ queryKey: facilityKeys.detail(id), queryFn: () => { if (isDemoMode) { const facility = demoFacilities(locations, assets, workOrders).find((item) => item.id === id); if (!facility) throw new Error('Facility not found'); return Promise.resolve(facility); } return facilitiesApi.get(id); }, enabled: Boolean(id), ...queryTiming.reference, retry: false }); }
export function useFacilityMutations() { 
  const client = useQueryClient(); 
  const refreshAll = () => { void client.invalidateQueries({ queryKey: facilityKeys.all }); }; 
  const refreshDetail = (id: string) => { refreshAll(); void client.invalidateQueries({ queryKey: facilityKeys.detail(id) }); }; 
  return { 
    create: useMutation({
      mutationFn: (p: FacilityPayload) => {
        if (isDemoMode) {
          const id = `demo-facility-${Date.now()}`;
          return Promise.resolve({
            id,
            organizationId: 'demo-organization',
            name: p.name,
            address: p.address || { street: '', city: '', state: '', country: '' },
            coordinates: { type: 'Point' as const, coordinates: [0, 0] as [number, number] },
            status: 'active' as const,
            description: p.description || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            locationCount: 0,
            assetCount: 0,
            openWorkOrderCount: 0,
          });
        }
        return facilitiesApi.create(p);
      },
      onSuccess: refreshAll
    }), 
    update: useMutation({
      mutationFn: (p: { id: string; payload: Partial<FacilityPayload> }) => {
        if (isDemoMode) {
          return Promise.resolve({
            id: p.id,
            organizationId: 'demo-organization',
            name: p.payload.name ?? 'Updated Facility',
            address: p.payload.address ?? { street: '', city: '', state: '', country: '' },
            coordinates: { type: 'Point' as const, coordinates: [0, 0] as [number, number] },
            status: 'active' as const,
            description: p.payload.description ?? '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            locationCount: 0,
            assetCount: 0,
            openWorkOrderCount: 0,
          });
        }
        return facilitiesApi.update(p.id, p.payload);
      },
      onSuccess: (_data: Facility, variables: { id: string; payload: Partial<FacilityPayload> }) => refreshDetail(variables.id)
    }), 
    deactivate: useMutation({
      mutationFn: (id: string) => {
        if (isDemoMode) {
          return Promise.resolve({
            id,
            organizationId: 'demo-organization',
            name: 'Deactivated Facility',
            address: { street: '', city: '', state: '', country: '' },
            coordinates: { type: 'Point' as const, coordinates: [0, 0] as [number, number] },
            status: 'inactive' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            locationCount: 0,
            assetCount: 0,
            openWorkOrderCount: 0,
          });
        }
        return facilitiesApi.deactivate(id);
      },
      onSuccess: (_data: Facility, id: string) => refreshDetail(id)
    }) 
  }; 
}
