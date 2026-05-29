import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { GearIcon } from '@/components/brand/GearIcon'
import { APP_NAME } from '@/utils/constants'
import { cn } from '@/utils/helpers'

interface BrandLogoProps {
  className?: string
  iconClassName?: string
  textClassName?: string
  iconSize?: number
  showText?: boolean
  asLink?: boolean
  to?: string
  /** Renders the gear inside the branded square (auth / portal sidebar style). */
  boxedIcon?: boolean
  children?: ReactNode
}

export function BrandLogo({
  className,
  iconClassName = 'text-primary',
  textClassName = 'font-headline-lg text-headline-lg font-bold text-primary',
  iconSize = 32,
  showText = true,
  asLink = true,
  to = '/',
  boxedIcon = false,
}: BrandLogoProps) {
  const icon = boxedIcon ? (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
      <GearIcon size={20} className="text-primary-foreground" />
    </div>
  ) : (
    <GearIcon size={iconSize} className={iconClassName} />
  )

  const content = (
    <>
      {icon}
      {showText ? <span className={textClassName}>{APP_NAME}</span> : null}
    </>
  )

  if (!asLink) {
    return <div className={cn('flex items-center gap-2', className)}>{content}</div>
  }

  return (
    <Link to={to} className={cn('flex items-center gap-2 transition-opacity hover:opacity-90', className)}>
      {content}
    </Link>
  )
}
