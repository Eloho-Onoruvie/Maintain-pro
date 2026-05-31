import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthSplitLayout } from '@/features/auth/components/AuthBrandingPanel'
import { PasswordField } from '@/features/auth/components/PasswordField'
import { validateMockInviteToken, acceptMockInvite } from '@/features/auth/utils/mockInvite'
import { useAuthStore } from '@/app/store'
import { getDefaultPathForRole } from '@/app/portal.config'
import type { InviteTokenInfo } from '@/features/auth/types/auth.types'
import { cn } from '@/utils/helpers'

// ── Role display helpers ──────────────────────────────────────────────────────

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrator',
  facility_manager: 'Facility Manager',
  technician: 'Technician',
  staff: 'Staff',
  finance: 'Finance',
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-400/10 text-red-400 border-red-400/20',
  facility_manager: 'bg-purple-400/10 text-purple-400 border-purple-400/20',
  technician: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  staff: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  finance: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
}

// ── Page states ───────────────────────────────────────────────────────────────

type PageState = 'loading' | 'valid' | 'invalid' | 'expired' | 'success'

// ── Component ─────────────────────────────────────────────────────────────────

export function AcceptInvite() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.login)

  const token = searchParams.get('token') ?? ''

  const [pageState, setPageState] = useState<PageState>('loading')
  const [tokenInfo, setTokenInfo] = useState<InviteTokenInfo | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [form, setForm] = useState({ firstName: '', lastName: '', password: '' })

  const update = (patch: Partial<typeof form>) => {
    setSubmitError(null)
    setForm((prev) => ({ ...prev, ...patch }))
  }

  // Validate token on mount — simulates an async API call
  useEffect(() => {
    if (!token) {
      setPageState('invalid')
      return
    }
    const timer = setTimeout(() => {
      const info = validateMockInviteToken(token)
      if (!info) {
        setPageState('invalid')
        return
      }
      if (info.expiresAt < Date.now()) {
        setPageState('expired')
        return
      }
      setTokenInfo(info)
      setPageState('valid')
    }, 600)
    return () => clearTimeout(timer)
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tokenInfo) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 700))
      const result = acceptMockInvite(
        { token, firstName: form.firstName, lastName: form.lastName, password: form.password },
        tokenInfo,
      )
      setSession(result.user, result.token)
      setPageState('success')
      setTimeout(() => navigate(getDefaultPathForRole(result.user.role), { replace: true }), 1400)
    } catch {
      setSubmitError('Something went wrong. Please try again or contact your administrator.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (pageState === 'loading') {
    return (
      <AuthSplitLayout brandingVariant="organization">
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Validating your invitation…</p>
          </CardContent>
        </Card>
      </AuthSplitLayout>
    )
  }

  // ── Invalid ────────────────────────────────────────────────────────────────
  if (pageState === 'invalid') {
    return (
      <AuthSplitLayout brandingVariant="organization">
        <Card className="border-border bg-card">
          <CardHeader className="text-center space-y-3">
            <div className="flex justify-center">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle className="text-xl">Invalid invitation link</CardTitle>
            <CardDescription>
              This link is not valid or has already been used. Ask your administrator to send a new invite.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/login">Back to login</Link>
            </Button>
          </CardContent>
        </Card>
      </AuthSplitLayout>
    )
  }

  // ── Expired ────────────────────────────────────────────────────────────────
  if (pageState === 'expired') {
    return (
      <AuthSplitLayout brandingVariant="organization">
        <Card className="border-border bg-card">
          <CardHeader className="text-center space-y-3">
            <div className="flex justify-center">
              <AlertTriangle className="h-10 w-10 text-amber-400" />
            </div>
            <CardTitle className="text-xl">Invitation expired</CardTitle>
            <CardDescription>
              Invitation links expire after 48 hours. Ask your administrator to resend the invite
              from <strong>Settings → Users</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/login">Back to login</Link>
            </Button>
          </CardContent>
        </Card>
      </AuthSplitLayout>
    )
  }

  // ── Success ────────────────────────────────────────────────────────────────
  if (pageState === 'success') {
    return (
      <AuthSplitLayout brandingVariant="organization">
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-400" />
            <div className="text-center space-y-1">
              <p className="font-semibold text-lg">Account created!</p>
              <p className="text-sm text-muted-foreground">Taking you to your dashboard…</p>
            </div>
          </CardContent>
        </Card>
      </AuthSplitLayout>
    )
  }

  // ── Valid — account setup form ─────────────────────────────────────────────
  return (
    <AuthSplitLayout brandingVariant="organization">
      <Card className="border-border bg-card">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <CardTitle className="text-2xl">Accept invitation</CardTitle>
              <CardDescription>
                Set up your account for{' '}
                <span className="font-medium text-foreground">{tokenInfo!.organizationName}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Invite summary card */}
          <div className="rounded-lg border border-border bg-muted/40 divide-y divide-border text-sm">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-muted-foreground">Invited by</span>
              <span className="font-medium">{tokenInfo!.inviterName}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{tokenInfo!.email}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-muted-foreground">Role</span>
              <Badge
                variant="outline"
                className={cn('text-xs', ROLE_COLORS[tokenInfo!.role] ?? '')}
              >
                {ROLE_LABELS[tokenInfo!.role] ?? tokenInfo!.role}
              </Badge>
            </div>
          </div>

          {submitError && (
            <Alert variant="destructive">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name *</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) => update({ firstName: e.target.value })}
                  required
                  autoFocus
                  className="bg-secondary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name *</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => update({ lastName: e.target.value })}
                  required
                  className="bg-secondary"
                />
              </div>
            </div>

            {/* Locked email field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={tokenInfo!.email}
                disabled
                className="bg-secondary opacity-60 cursor-not-allowed"
              />
            </div>

            <PasswordField
              id="password"
              value={form.password}
              onChange={(password) => update({ password })}
              placeholder="Create a strong password"
              hint="At least 8 characters with a number and symbol"
              showStrength
            />

            <div className="flex items-start gap-2 rounded-md border border-border bg-muted/40 px-3 py-2">
              <ShieldCheck className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                By accepting, you agree to the{' '}
                <Link to="/terms-of-service" className="underline hover:text-foreground">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy-policy" className="underline hover:text-foreground">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                isSubmitting ||
                !form.firstName.trim() ||
                !form.lastName.trim() ||
                form.password.length < 6
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                'Create account & join'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthSplitLayout>
  )
}
