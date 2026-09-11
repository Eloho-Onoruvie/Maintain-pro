import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { locationsApi } from '../api/locations.api';
import type { CreateLocationPayload, UpdateLocationPayload } from '../types/location.types';
import { queryTiming } from '@/lib/query-options';
import { isDemoMode } from '@/config/runtime';
import { useMockDataStore } from '@/services/mockDataStore';
import type { Location } from '../types/location.types';

const demoLocation = (location: import('@/types/common.types').Location): Location => ({
  id: location.id,
  organizationId: location.organizationId ?? 'demo-organization',
  facilityId: location.facilityId ?? 'demo-facility',
  name: location.name,
  type: location.type.toUpperCase() as Location['type'],
  parentId: location.parentId ?? undefined,
  floor: location.description,
  description: location.description,
  status: location.status ?? 'active',
  assetCount: location.assetCount,
  openWorkOrderCount: location.openWorkOrders,
  createdAt: location.createdAt?.toISOString() ?? new Date(0).toISOString(),
  updatedAt: location.updatedAt?.toISOString() ?? new Date(0).toISOString(),
});
export const locationKeys = { all: ['locations'] as const, facility: (id: string) => ['locations', 'facility', id] as const, detail: (id: string) => ['locations', id] as const };
export function useLocationsApi() { const demoLocations = useMockDataStore((state) => state.locations); return useQuery<Location[]>({ queryKey: locationKeys.all, queryFn: () => isDemoMode ? Promise.resolve(demoLocations.map(demoLocation)) : locationsApi.list(), ...queryTiming.reference, retry: false }); }
export function useFacilityLocations(facilityId: string) { const demoLocations = useMockDataStore((state) => state.locations); return useQuery({ queryKey: locationKeys.facility(facilityId), queryFn: () => isDemoMode ? Promise.resolve(demoLocations.filter((location) => location.facilityId === facilityId).map(demoLocation)) : locationsApi.listByFacility(facilityId), enabled: Boolean(facilityId), ...queryTiming.reference, retry: false }); }
export function useLocationApi(id: string) { const demoLocations = useMockDataStore((state) => state.locations); return useQuery({ queryKey: locationKeys.detail(id), queryFn: () => { if (!isDemoMode) return locationsApi.get(id); const source = demoLocations.find((location) => location.id === id); if (!source) throw new Error('Location not found'); return Promise.resolve(demoLocation(source)); }, enabled: Boolean(id), ...queryTiming.reference, retry: false }); }
export function useLocationChildren(id: string) { const demoLocations = useMockDataStore((state) => state.locations); return useQuery({ queryKey: [...locationKeys.detail(id), 'children'], queryFn: () => isDemoMode ? Promise.resolve(demoLocations.filter((location) => location.parentId === id).map(demoLocation)) : locationsApi.children(id), enabled: Boolean(id), ...queryTiming.reference, retry: false }); }
export function useLocationMutations() { const client = useQueryClient(); const demoLocations = useMockDataStore((state) => state.locations); const addLocation = useMockDataStore((state) => state.addLocation); const updateLocation = useMockDataStore((state) => state.updateLocation); const refresh = () => client.invalidateQueries({ queryKey: locationKeys.all }); return { create: useMutation({ mutationFn: (payload: CreateLocationPayload) => isDemoMode ? Promise.resolve(demoLocation({ ...payload, id: `demo-location-${Date.now()}`, type: payload.type.toLowerCase() as import('@/types/common.types').Location['type'], parentId: payload.parentId ?? undefined, organizationId: 'demo-organization', createdAt: new Date(), updatedAt: new Date() })) : locationsApi.create(payload), onSuccess: (location: Location) => { if (isDemoMode) addLocation(location as never); refresh(); } }), update: useMutation({ mutationFn: (v: { id: string; payload: UpdateLocationPayload }) => isDemoMode ? Promise.resolve(demoLocation({ ...(demoLocations.find((location) => location.id === v.id)!), ...v.payload, parentId: v.payload.parentId ?? undefined, updatedAt: new Date() } as never)) : locationsApi.update(v.id, v.payload), onSuccess: (location: Location) => { if (isDemoMode) updateLocation(location.id, location as never); refresh(); } }), archive: useMutation({ mutationFn: (id: string) => isDemoMode ? Promise.resolve() : locationsApi.archive(id), onSuccess: refresh }) }; }
