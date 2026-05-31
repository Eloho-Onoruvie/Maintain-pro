import type { AcceptInvitePayload, InvitePayload, InviteTokenInfo } from '../types/auth.types'
import type { User } from '@/types/user.types'
import { USER_ROLES } from '@/types/user.types'

const INVITES_KEY = 'maintainpro_pending_invites'

interface StoredInvite extends InviteTokenInfo {
  firstName?: string
  lastName?: string
}

function readInvites(): Record<string, StoredInvite> {
  try {
    const raw = localStorage.getItem(INVITES_KEY)
    return raw ? (JSON.parse(raw) as Record<string, StoredInvite>) : {}
  } catch {
    return {}
  }
}

function writeInvites(invites: Record<string, StoredInvite>): void {
  localStorage.setItem(INVITES_KEY, JSON.stringify(invites))
}

export function createMockInvite(payload: InvitePayload): { acceptUrl: string; token: string } {
  const token = `inv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000
  const invite: StoredInvite = {
    token,
    email: payload.email,
    role: payload.role,
    organizationName: 'MaintainPro Demo Org',
    inviterName: 'Sarah Chen',
    expiresAt,
    firstName: payload.firstName,
    lastName: payload.lastName,
  }
  const invites = readInvites()
  invites[token] = invite
  writeInvites(invites)

  const acceptUrl = `${window.location.origin}/accept-invite?token=${encodeURIComponent(token)}`
  return { acceptUrl, token }
}

export function validateMockInviteToken(token: string): InviteTokenInfo | null {
  const invite = readInvites()[token]
  if (!invite) return null
  return {
    token: invite.token,
    email: invite.email,
    role: invite.role,
    organizationName: invite.organizationName,
    inviterName: invite.inviterName,
    expiresAt: invite.expiresAt,
  }
}

export function acceptMockInvite(
  payload: AcceptInvitePayload,
  tokenInfo: InviteTokenInfo,
): { user: User; token: string } {
  const role = Object.values(USER_ROLES).includes(tokenInfo.role as User['role'])
    ? (tokenInfo.role as User['role'])
    : USER_ROLES.STAFF

  const now = new Date().toISOString()
  const user: User = {
    id: `user-${Date.now()}`,
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: tokenInfo.email,
    role,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }

  const invites = readInvites()
  delete invites[payload.token]
  writeInvites(invites)

  return { user, token: 'mock-jwt-token' }
}

/** Dev helper when email is not configured */
export function getMockResetUrl(email: string): string {
  const token = btoa(email)
  return `${window.location.origin}/reset-password?token=${encodeURIComponent(token)}`
}

export function validateMockResetToken(token: string): string | null {
  try {
    return atob(decodeURIComponent(token))
  } catch {
    return null
  }
}

export function resetMockPassword(_email: string, _password: string): void {
  // Mock — no-op; session unchanged until login
}
