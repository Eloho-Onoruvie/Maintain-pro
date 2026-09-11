import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsApi, type UserSettings, type OrganizationSettings, type VendorSettings } from "@/api/settings.api";
import { isDemoMode } from "@/config/runtime";

export const settingsKeys = {
  user: ["settings", "user"] as const,
  organization: ["settings", "organization"] as const,
  vendor: ["settings", "vendor"] as const,
};

const demoUserSettings: UserSettings = {
  language: "en",
  timezone: "UTC",
  dateFormat: "YYYY-MM-DD",
  timeFormat: "24h",
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    screenReaderAnnouncements: false,
  },
};

const demoOrgSettings: OrganizationSettings = {
  timezone: "UTC",
  locale: "en-US",
  currency: "USD",
  defaultWorkOrderPriority: "medium",
  defaultServiceRequestPriority: "medium",
  notificationPolicies: {
    emailNotifications: true,
    inAppAlerts: true,
    smsAlerts: false,
  },
};

const demoVendorSettings: VendorSettings = {
  timezone: "UTC",
  locale: "en-US",
  marketplaceAvailable: true,
  profileVisible: true,
  autoApply: false,
  minimumAnnualContractValue: 5000,
  maximumDistanceKm: 50,
  contractTypes: { pm: true, emergency: true, modernization: true, audits: true },
};

export function useUserSettings() {
  const client = useQueryClient();
  const query = useQuery<UserSettings>({
    queryKey: settingsKeys.user,
    queryFn: () => (isDemoMode ? Promise.resolve(demoUserSettings) : settingsApi.user.get()),
    retry: false,
  });
  const update = useMutation({
    mutationFn: (payload: Partial<UserSettings>) => {
      if (isDemoMode) {
        const current = client.getQueryData<UserSettings>(settingsKeys.user) ?? demoUserSettings;
        const next = { ...current, ...payload };
        return Promise.resolve(next);
      }
      return settingsApi.user.update(payload);
    },
    onSuccess: (data: UserSettings) => client.setQueryData(settingsKeys.user, data),
  });
  return { ...query, update };
}

export function useOrganizationSettings(enabled = true) {
  const client = useQueryClient();
  const query = useQuery<OrganizationSettings>({
    queryKey: settingsKeys.organization,
    queryFn: () => (isDemoMode ? Promise.resolve(demoOrgSettings) : settingsApi.organization.get()),
    enabled,
    retry: false,
  });
  const update = useMutation({
    mutationFn: (payload: Partial<OrganizationSettings>) => {
      if (isDemoMode) {
        const current = client.getQueryData<OrganizationSettings>(settingsKeys.organization) ?? demoOrgSettings;
        const next = { ...current, ...payload };
        return Promise.resolve(next);
      }
      return settingsApi.organization.update(payload);
    },
    onSuccess: (data: OrganizationSettings) => client.setQueryData(settingsKeys.organization, data),
  });
  return { ...query, update };
}

export function useVendorSettings(enabled = true) {
  const client = useQueryClient();
  const query = useQuery<VendorSettings>({
    queryKey: settingsKeys.vendor,
    queryFn: () => (isDemoMode ? Promise.resolve(demoVendorSettings) : settingsApi.vendor.get()),
    enabled,
    retry: false,
  });
  const update = useMutation({
    mutationFn: (payload: Partial<VendorSettings>) => {
      if (isDemoMode) {
        const current = client.getQueryData<VendorSettings>(settingsKeys.vendor) ?? demoVendorSettings;
        const next = { ...current, ...payload };
        return Promise.resolve(next);
      }
      return settingsApi.vendor.update(payload);
    },
    onSuccess: (data: VendorSettings) => client.setQueryData(settingsKeys.vendor, data),
  });
  return { ...query, update };
}
