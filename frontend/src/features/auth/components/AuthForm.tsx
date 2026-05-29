import { ReactNode } from 'react'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AuthFormProps {
  title: string
  description?: string
  children: ReactNode
  showLogo?: boolean
}

export function AuthForm({ title, description, children, showLogo = true }: AuthFormProps) {
  return (
    <div className="w-full max-w-sm">
      {showLogo && (
        <BrandLogo
          asLink={false}
          boxedIcon
          textClassName="text-xl font-semibold text-foreground"
          className="mb-8 justify-center"
        />
      )}
      <Card className="border-border bg-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}
