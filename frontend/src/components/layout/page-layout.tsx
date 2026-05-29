import type { ReactNode } from 'react'

import { cn } from '@/utils/helpers'

/** Root wrapper for portal pages without AppHeader */
export function PageShell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('flex min-w-0 flex-col bg-background', className)}>{children}</div>
}

export function PageHeader({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('page-header shrink-0 border-b border-border', className)}>{children}</div>
  )
}

export function PageHeaderRow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('page-header-row', className)}>{children}</div>
}

export function PageTitleGroup({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('page-title-group min-w-0', className)}>{children}</div>
}

export function PageActions({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('page-actions', className)}>{children}</div>
}

export function PageBody({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('page-body', className)}>{children}</div>
}

export function PageToolbar({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('page-toolbar', className)}>{children}</div>
}

/** Horizontal scroll for wide tables on small screens */
export function DataTableWrap({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('data-table-wrap', className)}>{children}</div>
}

/** Tab lists that may overflow on narrow viewports */
export function TabsListScroll({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('tabs-list-scroll', className)}>{children}</div>
}
