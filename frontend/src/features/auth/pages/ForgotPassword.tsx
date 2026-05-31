import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, ArrowLeft, CheckCircle2, Mail, Copy } from 'lucide-react'

import { BrandLogo } from '@/components/brand/BrandLogo'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { authService } from '@/features/auth/services/auth.service'
import { getMockResetUrl } from '@/features/auth/utils/mockInvite'
import { toast } from 'sonner'

export function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState('')
  const [resetUrl, setResetUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await authService.forgotPassword(email)
      setIsSubmitted(true)
    } catch (err: unknown) {
      if (import.meta.env.DEV) {
        setResetUrl(getMockResetUrl(email))
        setIsSubmitted(true)
        return
      }
      setError((err as { message?: string })?.message ?? 'Unable to send reset email. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const devResetUrl = import.meta.env.DEV ? resetUrl ?? (isSubmitted ? getMockResetUrl(email) : null) : null

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
          {!isSubmitted ? (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Reset your password</CardTitle>
                <CardDescription>
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-secondary"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </form>

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
            </>
          ) : (
            <>
              <CardHeader className="space-y-1 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-status-completed/10 p-4">
                    <Mail className="h-8 w-8 text-status-completed" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Check your email</CardTitle>
                <CardDescription className="text-pretty">
                  We&apos;ve sent a password reset link to{' '}
                  <span className="font-medium text-foreground">{email}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {devResetUrl ? (
                  <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-3 text-left">
                    <p className="text-xs text-muted-foreground">
                      Email is not configured in demo mode. Use this reset link instead:
                    </p>
                    <Input readOnly value={devResetUrl} className="text-xs font-mono" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                      onClick={async () => {
                        await navigator.clipboard.writeText(devResetUrl)
                        toast.success('Reset link copied')
                      }}
                    >
                      <Copy className="h-4 w-4" />
                      Copy reset link
                    </Button>
                    <Button asChild className="w-full" size="sm">
                      <Link to={devResetUrl.replace(window.location.origin, '')}>Open reset page</Link>
                    </Button>
                  </div>
                ) : null}
                <p className="text-center text-sm text-muted-foreground">
                  Didn&apos;t receive the email? Check your spam folder or
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsSubmitted(false)
                    setEmail('')
                    setResetUrl(null)
                  }}
                >
                  Try another email
                </Button>
                <div className="pt-2">
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to sign in
                  </Link>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
