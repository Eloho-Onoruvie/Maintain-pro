import { Link } from 'react-router-dom'
import { Building2, Truck, ArrowRight } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthSplitLayout } from '@/features/auth/components/AuthBrandingPanel'
import { SIGNUP_PATHS } from '@/features/auth/types/auth.types'

const SIGNUP_OPTIONS = [
  {
    type: 'organization' as const,
    title: 'Organization',
    description: 'For facility managers, admins, and internal operations teams.',
    href: SIGNUP_PATHS.organization,
    icon: Building2,
  },
  {
    type: 'vendor' as const,
    title: 'Vendor',
    description: 'For external service providers and contracted maintenance businesses.',
    href: SIGNUP_PATHS.vendor,
    icon: Truck,
  },
]

export function SignupHub() {
  return (
    <AuthSplitLayout brandingVariant="signup">
      <Card className="border-border bg-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Choose how you will use MaintainPro</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {SIGNUP_OPTIONS.map((option) => (
            <Link
              key={option.type}
              to={option.href}
              className="group flex items-start gap-4 rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:border-primary/40 hover:bg-secondary/60"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <option.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{option.title}</p>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{option.description}</p>
              </div>
            </Link>
          ))}

          <p className="pt-4 text-center text-sm text-muted-foreground">
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
