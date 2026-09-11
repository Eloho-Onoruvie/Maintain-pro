import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { getDefaultPathForRole } from "@/app/portal.config";
import { useAuthStore } from "@/app/store";
import { authService } from "@/services/auth.service";
import { authKeys } from "../constants/queryKeys";
import type {
  AcceptInvitationRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterOrganizationRequest,
  RegisterVendorRequest,
  ResendVerificationRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  VerifyEmailLinkRequest,
  RegenerateVerificationRequest,
} from "../types/auth.types";

import { useVerificationModalStore } from "../store/useVerificationModalStore";
import { organizationApi } from "@/features/organization/api/organization.api";
import { vendorsApi } from "@/features/vendors/api/vendors.api";
import { isDemoMode } from "@/config/runtime";
import { USER_ROLES, type User, type UserRole } from "@/types/user.types";

function resolveRoleFromEmail(email: string): UserRole {
  const lower = email.toLowerCase();
  if (lower.includes("vendor_technician") || lower.includes("vendor-technician") || lower.includes("vendor.technician")) {
    return USER_ROLES.VENDOR_TECHNICIAN;
  }
  if (lower.includes("vendor_manager") || lower.includes("vendor-manager") || lower.includes("vendor.manager")) {
    return USER_ROLES.VENDOR_MANAGER;
  }
  if (lower.includes("vendor_lead") || lower.includes("vendor-lead") || lower.includes("vendor.lead")) {
    return USER_ROLES.VENDOR_LEAD;
  }
  if (lower.includes("vendor")) {
    return USER_ROLES.VENDOR_LEAD;
  }
  if (lower.includes("facility_manager") || lower.includes("facility-manager") || lower.includes("facility.manager") || lower.includes("facility")) {
    return USER_ROLES.FACILITY_MANAGER;
  }
  if (lower.includes("technician")) {
    return USER_ROLES.TECHNICIAN;
  }
  if (lower.includes("finance")) {
    return USER_ROLES.FINANCE;
  }
  if (lower.includes("staff")) {
    return USER_ROLES.STAFF;
  }
  return USER_ROLES.ADMIN;
}

function demoUser(email: string): User {
  const role = resolveRoleFromEmail(email || "");
  const [first = "Demo", last = "Admin"] = (email || "demo@maintainpro.local").split("@")[0].split(/[._-]/).map((part) => part ? part.charAt(0).toUpperCase() + part.slice(1) : part);
  return {
    id: "demo-user",
    role,
    ...(role.startsWith("vendor")
      ? { vendorId: "demo-vendor", vendorSlug: "current" }
      : { organizationId: "demo-organization", organizationSlug: "current" }),
    firstName: first,
    lastName: last,
    email: email || "demo@maintainpro.local",
    provider: "local",
    isVerified: true,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function useApplyAuthenticatedSession() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const setOrganization = useAuthStore((state) => state.setOrganization);
  const updateUser = useAuthStore((state) => state.updateUser);
  const openVerificationModal = useVerificationModalStore(
    (state) => state.open,
  );

  return async (
    user: NonNullable<Awaited<ReturnType<typeof authService.me>>>,
    targetPath?: string,
  ) => {
    // The user object from login/register is the source of truth.
    setUser(user);
    if (isDemoMode) {
      if (user.role.startsWith("vendor")) {
        localStorage.setItem("maintainpro_vendor_slug", "current");
        updateUser({ vendorSlug: "current" });
      } else {
        localStorage.setItem("maintainpro_organization_slug", "current");
        updateUser({ organizationSlug: "current" });
      }
    } else {
      // In live mode, we can trust the slugs returned from the backend user object
      if (user.organizationSlug) {
        localStorage.setItem("maintainpro_organization_slug", user.organizationSlug);
      }
      if (user.vendorSlug) {
        localStorage.setItem("maintainpro_vendor_slug", user.vendorSlug);
      }

      // Also call the endpoints to fetch profile / update store organization/vendor as needed
      if (user.organizationId) {
        await organizationApi.getCurrent().then((profile) => {
          setOrganization(profile);
          const slug = (profile as typeof profile & { slug?: string }).slug;
          if (slug) {
            localStorage.setItem("maintainpro_organization_slug", slug);
            updateUser({ organizationSlug: slug });
          }
        }).catch(() => undefined);
      } else if (user.vendorId) {
        await vendorsApi.getCurrent().then((profile) => {
          const slug = (profile as typeof profile & { slug?: string }).slug;
          if (slug) {
            localStorage.setItem("maintainpro_vendor_slug", slug);
            updateUser({ vendorSlug: slug });
          }
        }).catch(() => undefined);
      }
    }
    queryClient.setQueryData(authKeys.me, user);

    if (user.isVerified === false) {
      openVerificationModal("combined", 15);
      return;
    }

    navigate(targetPath || getDefaultPathForRole(user.role), { replace: true });
  };
}

export function useLogin() {
  const applyAuthenticatedSession = useApplyAuthenticatedSession();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => isDemoMode ? Promise.resolve({ user: demoUser(credentials.email) }) : authService.login(credentials),
    onSuccess: (data: { user: User }) => applyAuthenticatedSession(data.user),
  });
}

export function useRegisterOrganization() {
  const applyAuthenticatedSession = useApplyAuthenticatedSession();

  return useMutation({
    mutationFn: (
      input:
        | RegisterOrganizationRequest
        | { payload: RegisterOrganizationRequest; targetPath?: string },
    ) => {
      const payload = "payload" in input ? input.payload : input;
      const targetPath = "targetPath" in input ? input.targetPath : undefined;
      if (isDemoMode) {
        return Promise.resolve({ data: { user: demoUser(payload.email) }, targetPath });
      }
      return authService
        .registerOrganization(payload)
        .then((data) => ({ data, targetPath }));
    },
    onSuccess: ({ data, targetPath }: { data: { user: User }; targetPath?: string }) =>
      applyAuthenticatedSession(data.user, targetPath),
  });
}

export function useRegisterVendor() {
  const applyAuthenticatedSession = useApplyAuthenticatedSession();

  return useMutation({
    mutationFn: (
      input:
        | RegisterVendorRequest
        | { payload: RegisterVendorRequest; targetPath?: string },
    ) => {
      const payload = "payload" in input ? input.payload : input;
      const targetPath = "targetPath" in input ? input.targetPath : undefined;
      if (isDemoMode) {
        return Promise.resolve({ data: { user: demoUser(payload.email) }, targetPath });
      }
      return authService
        .registerVendor(payload)
        .then((data) => ({ data, targetPath }));
    },
    onSuccess: ({ data, targetPath }: { data: { user: User }; targetPath?: string }) =>
      applyAuthenticatedSession(data.user, targetPath),
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((state) => state.clearUser);

  const finishLogout = () => {
    clearUser();
    queryClient.clear();
    navigate("/login", { replace: true });
  };

  return useMutation({
    mutationFn: () => isDemoMode ? Promise.resolve() : authService.logout(),
    onSuccess: finishLogout,
    onError: finishLogout,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequest) =>
      isDemoMode ? Promise.resolve() : authService.forgotPassword(payload),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) =>
      isDemoMode ? Promise.resolve() : authService.resetPassword(payload),
  });
}

export function useAcceptInvitation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: AcceptInvitationRequest) =>
      isDemoMode ? Promise.resolve() : authService.acceptInvitation(payload),
    onSuccess: () => {
      navigate("/login", { replace: true });
    },
  });
}

export function useVerifyEmail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (payload: VerifyEmailRequest) =>
      isDemoMode ? Promise.resolve() : authService.verifyEmail(payload),
    onSuccess: () => {
      // Optimistically update the user state
      const currentUser = queryClient.getQueryData<any>(authKeys.me);
      if (currentUser) {
        const updatedUser = { ...currentUser, isVerified: true };
        setUser(updatedUser);
        queryClient.setQueryData(authKeys.me, updatedUser);
        navigate(getDefaultPathForRole(updatedUser.role), { replace: true });
      }
    },
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (payload: ResendVerificationRequest) =>
      isDemoMode ? Promise.resolve() : authService.resendVerification(payload),
  });
}

export function useVerifyEmailLink() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (payload: VerifyEmailLinkRequest) =>
      isDemoMode ? Promise.resolve() : authService.verifyEmailLink(payload),
    onSuccess: () => {
      // Optimistically update the user state
      const currentUser = queryClient.getQueryData<any>(authKeys.me);
      if (currentUser) {
        const updatedUser = { ...currentUser, isVerified: true };
        setUser(updatedUser);
        queryClient.setQueryData(authKeys.me, updatedUser);
        navigate(getDefaultPathForRole(updatedUser.role), { replace: true });
      }
    },
  });
}

export function useRegenerateVerificationLink() {
  return useMutation({
    mutationFn: (payload: RegenerateVerificationRequest) =>
      isDemoMode
        ? Promise.resolve({ expiresInSeconds: 900, verificationUrl: "https://maintainpro.local/auth/verify?token=demo" })
        : authService.regenerateVerificationLink(payload),
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: () => isDemoMode ? Promise.resolve(demoUser('demo@maintainpro.local')) : authService.me(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
