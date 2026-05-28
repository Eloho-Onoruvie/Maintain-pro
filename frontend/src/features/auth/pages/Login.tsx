import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AuthSplitLayout } from '@/features/auth/components/AuthBrandingPanel'
import { PasswordField } from '@/features/auth/components/PasswordField'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useAuthRedirect } from '@/hooks/useAuthRedirect'

export function Login() {
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  useAuthRedirect(isAuthenticated)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    await login({ email, password, rememberMe })
  }

  const handleSsoClick = (provider: string) => {
    toast.info(`${provider} sign-in will be available soon`, {
      description: 'Use email and password for now.',
    })
  }

  return (
    <AuthSplitLayout brandingVariant="login">
      <Card className="border-border bg-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
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
                onChange={(e) => {
                  clearError()
                  setEmail(e.target.value)
                }}
                required
                autoComplete="email"
                className="bg-secondary"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <PasswordField
                id="password"
                label=""
                value={password}
                onChange={setPassword}
                placeholder="Enter your password"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                Remember me for 30 days
              </label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="outline" type="button" className="w-full" onClick={() => handleSsoClick('Google')}>
                Google
              </Button>
              <Button variant="outline" type="button" className="w-full" onClick={() => handleSsoClick('Apple')}>
                Apple
              </Button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>

          {import.meta.env.DEV && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Dev tip: use emails containing admin, tech, vendor, or manager to mock different portals.
            </p>
          )}
        </CardContent>
      </Card>
    </AuthSplitLayout>
  )
}
