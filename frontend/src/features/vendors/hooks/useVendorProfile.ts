import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { vendorsApi } from "../api/vendors.api";
import type { UpdateVendorProfilePayload } from "../types/vendor.types";
import { isDemoMode } from "@/config/runtime";
import type { VendorProfile } from "../types/vendor.types";
export const vendorKeys = { current: ["vendors", "me"] as const };
const demoVendor: VendorProfile = {
  id: "demo-vendor",
  name: "Demo Vendor Services",
  email: "vendor@example.com",
  phone: "+1 555 0100",
  serviceCategories: ["HVAC", "Electrical"],
  coverageRadiusKm: 25,
  plan: "Professional",
  subscriptionStatus: "active",
  applicationLimit: 25,
  averageRating: 4.8,
  completedJobs: 42,
  isVerified: true,
  verificationBadge: "verified",
  status: "active",
};
export function useVendorProfile(enabled = true) {
  return useQuery<VendorProfile>({
    queryKey: vendorKeys.current,
    queryFn: () =>
      isDemoMode ? Promise.resolve(demoVendor) : vendorsApi.getCurrent(),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
export function useVendorProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateVendorProfilePayload) =>
      isDemoMode
        ? Promise.resolve({
            ...demoVendor,
            ...payload,
            name: payload.vendorName ?? demoVendor.name,
          })
        : vendorsApi.updateCurrent(payload),
    onSuccess: (profile: VendorProfile) => {
      queryClient.setQueryData(vendorKeys.current, profile);
    },
  });
}
