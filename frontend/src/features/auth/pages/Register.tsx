

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Wrench, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'

export function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    company: '',
    role: '',
    industry: '',
    agreeTerms: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
      return
    }
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    navigate('/dashboard')
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/20">
            <Wrench className="h-5 w-5" />
          </div>
          <span className="text-xl font-semibold">MaintainPro</span>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-balance">
            Start managing your facilities smarter
          </h1>
          <p className="text-lg text-primary-foreground/80 text-pretty">
            Join thousands of operations teams who have transformed their maintenance workflows with MaintainPro.
          </p>
          
          <div className="space-y-4 pt-8">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/20 text-sm">
                1
              </div>
              <div>
                <p className="font-medium">Create your account</p>
                <p className="text-sm text-primary-foreground/70">Set up your profile and organization</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/20 text-sm">
                2
              </div>
              <div>
                <p className="font-medium">Add your facilities</p>
                <p className="text-sm text-primary-foreground/70">Import or create your locations and assets</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/20 text-sm">
                3
              </div>
              <div>
                <p className="font-medium">Invite your team</p>
                <p className="text-sm text-primary-foreground/70">Collaborate with technicians and managers</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-primary-foreground/60">
          14-day free trial • No credit card required
        </p>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-12 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Wrench className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">MaintainPro</span>
          </div>

          <Card className="border-border bg-card">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                {step === 2 && (
                  <button 
                    onClick={() => setStep(1)} 
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                )}
                <div>
                  <CardTitle className="text-2xl">
                    {step === 1 ? 'Create an account' : 'Tell us about you'}
                  </CardTitle>
                  <CardDescription>
                    {step === 1 
                      ? 'Enter your details to get started'
                      : 'Help us personalize your experience'
                    }
                  </CardDescription>
                </div>
              </div>
              {/* Progress Indicator */}
              <div className="flex gap-2 pt-2">
                <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-secondary'}`} />
                <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-secondary'}`} />
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          required
                          className="bg-secondary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input
                          id="lastName"
                          placeholder="Smith"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          required
                          className="bg-secondary"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Work email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        className="bg-secondary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          required
                          className="bg-secondary pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Must be at least 8 characters with a number and symbol
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company name</Label>
                      <Input
                        id="company"
                        placeholder="Acme Corporation"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        required
                        className="bg-secondary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Your role</Label>
                      <Select 
                        value={formData.role} 
                        onValueChange={(value) => setFormData({...formData, role: value})}
                      >
                        <SelectTrigger className="bg-secondary">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="facility_manager">Facility Manager</SelectItem>
                          <SelectItem value="operations_director">Operations Director</SelectItem>
                          <SelectItem value="maintenance_supervisor">Maintenance Supervisor</SelectItem>
                          <SelectItem value="technician">Technician</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select 
                        value={formData.industry} 
                        onValueChange={(value) => setFormData({...formData, industry: value})}
                      >
                        <SelectTrigger className="bg-secondary">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hospitality">Hospitality / Hotels</SelectItem>
                          <SelectItem value="healthcare">Healthcare / Hospitals</SelectItem>
                          <SelectItem value="banking">Banking / Finance</SelectItem>
                          <SelectItem value="education">Education / Schools</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="corporate">Corporate Offices</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-start space-x-2 pt-2">
                      <Checkbox 
                        id="terms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => setFormData({...formData, agreeTerms: checked as boolean})}
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm text-muted-foreground cursor-pointer leading-tight"
                      >
                        I agree to the{' '}
                        <Link to="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || (step === 2 && !formData.agreeTerms)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : step === 1 ? (
                    'Continue'
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              {step === 1 && (
                <>
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          Or sign up with
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <Button variant="outline" type="button" className="w-full">
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Google
                      </Button>
                      <Button variant="outline" type="button" className="w-full">
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z"
                          />
                        </svg>
                        Apple
                      </Button>
                    </div>
                  </div>

                  <p className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
