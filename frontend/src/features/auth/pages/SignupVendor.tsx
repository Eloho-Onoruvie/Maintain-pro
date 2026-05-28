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

export function SignupVendor() {
  const { register, isLoading, error, clearError } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    businessName: '',
    serviceCategory: '',
    taxId: '',
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
      signupType: 'vendor',
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      businessName: formData.businessName,
      serviceCategories: formData.serviceCategory ? [formData.serviceCategory] : [],
      taxId: formData.taxId || undefined,
    })
  }

  return (
    <AuthSplitLayout brandingVariant="vendor">
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
                {step === 1 ? 'Vendor account' : 'Business details'}
              </CardTitle>
              <CardDescription>
                {step === 1 ? 'Create your vendor credentials' : 'Tell us about your service business'}
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
                  <Label htmlFor="email">Business email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => update({ email: e.target.value })} required className="bg-secondary" />
                </div>
                <PasswordField id="password" value={formData.password} onChange={(password) => update({ password })} placeholder="Create a strong password" showStrength />
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business name</Label>
                  <Input id="businessName" value={formData.businessName} onChange={(e) => update({ businessName: e.target.value })} required className="bg-secondary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceCategory">Primary service category</Label>
                  <Select value={formData.serviceCategory} onValueChange={(serviceCategory) => update({ serviceCategory })}>
                    <SelectTrigger className="bg-secondary">
                      <SelectValue placeholder="Select service category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hvac">HVAC Services</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="cleaning">Cleaning & Janitorial</SelectItem>
                      <SelectItem value="landscaping">Landscaping</SelectItem>
                      <SelectItem value="general">General Contracting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID / EIN (optional)</Label>
                  <Input id="taxId" value={formData.taxId} onChange={(e) => update({ taxId: e.target.value })} placeholder="XX-XXXXXXX" className="bg-secondary" />
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
                'Create Vendor Account'
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
