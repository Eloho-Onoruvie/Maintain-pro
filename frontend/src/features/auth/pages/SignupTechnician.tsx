import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AuthSplitLayout } from '@/features/auth/components/AuthBrandingPanel'
import { PasswordField } from '@/features/auth/components/PasswordField'
import { useAuth } from '@/features/auth/hooks/useAuth'

export function SignupTechnician() {
  const { register, isLoading, error, clearError } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    trade: '',
    yearsExperience: '',
    inviteCode: '',
    agreeTerms: false,
  })

  const update = (patch: Partial<typeof formData>) => {
    clearError()
    setFormData((prev) => ({ ...prev, ...patch }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
      return
    }

    await register({
      signupType: 'technician',
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      trade: formData.trade,
      yearsExperience: formData.yearsExperience,
      inviteCode: formData.inviteCode || undefined,
    })
  }

  return (
    <AuthSplitLayout brandingVariant="technician">
      <Card className="border-border bg-card">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            {step === 2 ? (
              <button type="button" onClick={() => setStep(1)} className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : (
              <Link to="/signup" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            )}
            <div>
              <CardTitle className="text-2xl">
                {step === 1 ? 'Technician account' : 'Professional details'}
              </CardTitle>
              <CardDescription>
                {step === 1 ? 'Create your technician credentials' : 'Tell us about your trade and experience'}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-secondary'}`} />
            <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-secondary'}`} />
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" value={formData.firstName} onChange={(e) => update({ firstName: e.target.value })} required className="bg-secondary" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" value={formData.lastName} onChange={(e) => update({ lastName: e.target.value })} required className="bg-secondary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => update({ email: e.target.value })} required className="bg-secondary" />
                </div>
                <PasswordField id="password" value={formData.password} onChange={(password) => update({ password })} placeholder="Create a strong password" showStrength />
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="trade">Primary trade</Label>
                  <Select value={formData.trade} onValueChange={(trade) => update({ trade })}>
                    <SelectTrigger className="bg-secondary">
                      <SelectValue placeholder="Select your trade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="general">General Maintenance</SelectItem>
                      <SelectItem value="mechanical">Mechanical</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsExperience">Years of experience</Label>
                  <Select value={formData.yearsExperience} onValueChange={(yearsExperience) => update({ yearsExperience })}>
                    <SelectTrigger className="bg-secondary">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0–2 years</SelectItem>
                      <SelectItem value="3-5">3–5 years</SelectItem>
                      <SelectItem value="6-10">6–10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Organization invite code (optional)</Label>
                  <Input
                    id="inviteCode"
                    value={formData.inviteCode}
                    onChange={(e) => update({ inviteCode: e.target.value })}
                    placeholder="Enter code from your employer"
                    className="bg-secondary"
                  />
                </div>
                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox id="terms" checked={formData.agreeTerms} onCheckedChange={(checked) => update({ agreeTerms: checked === true })} />
                  <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-tight">
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || (step === 2 && !formData.agreeTerms)}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : step === 1 ? (
                'Continue'
              ) : (
                'Create Technician Account'
              )}
            </Button>
          </form>

          {step === 1 && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </AuthSplitLayout>
  )
}
