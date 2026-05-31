import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'

import { BrandLogo } from '@/components/brand/BrandLogo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PasswordField } from '@/features/auth/components/PasswordField'
import { resetMockPassword, validateMockResetToken } from '@/features/auth/utils/mockInvite'
import { authService } from '@/features/auth/services/auth.service'

export function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') ?? ''
  const email = validateMockResetToken(token)

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  if (!token || !email) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-sm border-border bg-card">
          <CardHeader>
            <CardTitle>Invalid reset link</CardTitle>
            <CardDescription>
              This password reset link is missing or expired. Request a new one from the sign-in page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/forgot-password">Request new link</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await authService.resetPassword({ token, password })
    } catch {
      if (import.meta.env.DEV) {
        resetMockPassword(email, password)
      } else {
        setError('Unable to reset password. Try again.')
        setIsLoading(false)
        return
      }
    }

    setDone(true)
    setIsLoading(false)
    setTimeout(() => navigate('/login', { replace: true }), 2000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <BrandLogo
          asLink={false}
          boxedIcon
          textClassName="text-xl font-semibold text-foreground"
          className="mb-8 justify-center"
        />

        <Card className="border-border bg-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Set a new password</CardTitle>
            <CardDescription>
              {done
                ? 'Password updated. Redirecting to sign in…'
                : `Choose a new password for ${email}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!done && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <PasswordField
                  id="password"
                  label="New password"
                  value={password}
                  onChange={setPassword}
                />
                <PasswordField
                  id="confirm"
                  label="Confirm password"
                  value={confirm}
                  onChange={setConfirm}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating…
                    </>
                  ) : (
                    'Update password'
                  )}
                </Button>
              </form>
            )}

            <div className="mt-6">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
