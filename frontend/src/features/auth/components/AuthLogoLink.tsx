import { Link } from 'react-router-dom'

import { GearIcon } from '@/components/brand/GearIcon'
import { PUBLIC_ROUTES } from '@/features/public/constants/routes'
import { APP_NAME } from '@/utils/constants'
import { cn } from '@/utils/helpers'

type AuthLogoVariant = 'panel' | 'inline'

interface AuthLogoLinkProps {
  variant?: AuthLogoVariant
  className?: string
}

/** MaintainPro logo (gear icon + name) linking to the marketing home page. */
export function AuthLogoLink({ variant = 'inline', className }: AuthLogoLinkProps) {
  const isPanel = variant === 'panel'

  return (
    <Link
      to={PUBLIC_ROUTES.HOME}
      className={cn('inline-flex items-center gap-3 transition-opacity hover:opacity-90', className)}
      aria-label={`Back to ${APP_NAME} home`}
    >
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg',
          isPanel ? 'bg-primary-foreground/20' : 'bg-primary',
        )}
      >
        <GearIcon size={20} className="text-primary-foreground" />
      </div>
      <span
        className={cn(
          'text-xl font-semibold',
          isPanel ? 'text-primary-foreground' : 'text-foreground',
        )}
      >
        {APP_NAME}
      </span>
    </Link>
  )
}
