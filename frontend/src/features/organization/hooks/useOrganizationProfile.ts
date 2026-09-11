import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { organizationApi, type UpdateOrganizationProfilePayload } from '../api/organization.api';
import { useAuthStore } from '@/app/store';
import { isDemoMode } from '@/config/runtime';
import type { OrganizationProfile } from '../types/organization.types';

export const organizationProfileKey = ['organization', 'current'] as const;

export function useOrganizationProfile(enabled = true) {
  const client = useQueryClient();
  const setOrganization = useAuthStore((state) => state.setOrganization);
  const query = useQuery<OrganizationProfile>({ queryKey: organizationProfileKey, queryFn: organizationApi.getCurrent, enabled: enabled && !isDemoMode, retry: false });
  const update = useMutation({
    mutationFn: (payload: UpdateOrganizationProfilePayload) => { if (isDemoMode) { const current = useAuthStore.getState().organization; return Promise.resolve({ ...(current ?? { id: 'demo-organization', name: 'Demo Organization', industry: 'Facilities', email: 'demo@example.com', phone: '', address: {}, status: 'active' as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }), ...payload, updatedAt: new Date().toISOString() }); } return organizationApi.updateCurrent(payload) },
    onSuccess: (profile: OrganizationProfile) => {
      client.setQueryData(organizationProfileKey, profile);
      setOrganization(profile);
    },
  });
  return { ...query, update };
}
