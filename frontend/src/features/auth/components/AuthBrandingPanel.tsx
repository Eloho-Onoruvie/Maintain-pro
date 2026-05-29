import type { ReactNode } from 'react'
import { Building2, HardHat, Truck } from 'lucide-react'

import { BrandLogo } from '@/components/brand/BrandLogo'
import { AuthLogoLink } from '@/features/auth/components/AuthLogoLink'

interface AuthBrandingPanelProps {
  variant?: 'login' | 'signup' | 'organization' | 'technician' | 'vendor'
}

const VARIANT_CONTENT = {
  login: {
    title: 'Enterprise Facility & Maintenance Management',
    description:
      'Streamline your facility operations with intelligent work order management, preventive maintenance scheduling, and real-time asset tracking.',
    footer: 'Trusted by hotels, hospitals, banks, and enterprises worldwide',
  },
  signup: {
    title: 'Start managing your facilities smarter',
    description:
      'Join thousands of operations teams who have transformed their maintenance workflows with MaintainPro.',
    footer: '14-day free trial • No credit card required',
  },
  organization: {
    title: 'Set up your organization',
    description:
      'Create your workspace, invite your team, and centralize maintenance operations across all your facilities.',
    footer: 'Built for facility managers, admins, and operations teams',
  },
  technician: {
    title: 'Join as a maintenance technician',
    description:
      'Access assigned jobs, log work, and collaborate with facility teams from one focused portal.',
    footer: 'Job-focused tools for field and in-house technicians',
  },
  vendor: {
    title: 'Partner as a service vendor',
    description:
      'Manage your team, track assigned work orders, and grow your maintenance business with MaintainPro.',
    footer: 'Business tools for contracted service providers',
  },
} as const

export function AuthBrandingPanel({ variant = 'login' }: AuthBrandingPanelProps) {
  const content = VARIANT_CONTENT[variant]

  return (
    <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground">
      <AuthLogoLink variant="panel" />

      <div className="space-y-6">
        <h1 className="text-4xl font-bold leading-tight text-balance">{content.title}</h1>
        <p className="text-lg text-primary-foreground/80 text-pretty">{content.description}</p>

        {variant === 'login' && (
          <div className="grid grid-cols-2 gap-4 pt-8">
            <Stat value="10K+" label="Facilities Managed" />
            <Stat value="2M+" label="Work Orders Completed" />
            <Stat value="99.9%" label="Uptime SLA" />
            <Stat value="24/7" label="Support Available" />
          </div>
        )}

        {variant === 'signup' && (
          <div className="grid gap-4 pt-4">
            <SignupTypePreview icon={Building2} title="Organization" description="Facilities & internal teams" />
            <SignupTypePreview icon={HardHat} title="Technician" description="Field & maintenance staff" />
            <SignupTypePreview icon={Truck} title="Vendor" description="External service providers" />
          </div>
        )}

        {(variant === 'organization' || variant === 'technician' || variant === 'vendor') && (
          <div className="space-y-4 pt-4">
            <Step number={1} title="Create your account" description="Set up credentials and profile" />
            <Step number={2} title="Complete onboarding" description="Tell us about your role and needs" />
            <Step number={3} title="Start working" description="Access your dedicated portal" />
          </div>
        )}
      </div>

      <p className="text-sm text-primary-foreground/60">{content.footer}</p>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="space-y-1">
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm text-primary-foreground/70">{label}</p>
    </div>
  )
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/20 text-sm">
        {number}
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-primary-foreground/70">{description}</p>
      </div>
    </div>
  )
}

function SignupTypePreview({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Building2
  title: string
  description: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-4 py-3">
      <Icon className="h-5 w-5 shrink-0" />
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-primary-foreground/70">{description}</p>
      </div>
    </div>
  )
}

export function AuthMobileLogo() {
  return (
    <div className="mb-8 flex justify-center lg:hidden">
      <BrandLogo
        asLink={false}
        boxedIcon
        textClassName="text-xl font-semibold text-foreground"
      />
    </div>
  )
}

export function AuthSplitLayout({
  brandingVariant,
  children,
}: {
  brandingVariant?: AuthBrandingPanelProps['variant']
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <AuthBrandingPanel variant={brandingVariant} />
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-12 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <AuthMobileLogo />
          {children}
        </div>
      </div>
    </div>
  )
}
