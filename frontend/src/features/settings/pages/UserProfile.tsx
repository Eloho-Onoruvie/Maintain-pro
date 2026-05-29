import { useEffect, useState } from 'react'
import {
  Bell,
  Camera,
  Eye,
  EyeOff,
  Key,
  Mail,
  Shield,
  User as UserIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { AppHeader } from '@/components/navigation/Navbar'

import { useAuthStore } from '@/app/store'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { UserRole } from '@/types/user.types'

const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  facility_manager: 'Facility Manager',
  technician: 'Technician',
  vendor: 'Vendor',
  staff: 'Staff',
  finance: 'Finance',
}

export function UserProfile() {
  const user = useAuthStore((state) => state.user)
  const updateUser = useAuthStore((state) => state.updateUser)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [department, setDepartment] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [emailWorkOrders, setEmailWorkOrders] = useState(true)
  const [emailMaintenance, setEmailMaintenance] = useState(true)
  const [emailApprovals, setEmailApprovals] = useState(true)
  const [pushEnabled, setPushEnabled] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [timezone, setTimezone] = useState('America/New_York')

  useEffect(() => {
    if (!user) return
    setFirstName(user.firstName)
    setLastName(user.lastName)
    setPhone(user.phone ?? '')
    setDepartment(user.department ?? '')
  }, [user])

  if (!user) return null

  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()

  const handleSaveProfile = () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('First and last name are required')
      return
    }
    updateUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || undefined,
      department: department.trim() || undefined,
    })
    toast.success('Profile updated')
  }

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      toast.error('Enter your current and new password')
      return
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    toast.success('Password updated')
  }

  const handleSavePreferences = () => {
    toast.success('Notification preferences saved')
  }

  return (
    <div className="flex flex-col bg-background">
      <AppHeader
        title="My Profile"
        subtitle="Personal information, security, and notification preferences"
        hideQuickCreate
      />

      <div className="page-body">
        <Tabs defaultValue="profile">
          <TabsList className="mb-6 h-auto flex-wrap gap-1 border border-border bg-muted">
            <TabsTrigger value="profile" className="gap-2">
              <UserIcon className="h-3.5 w-3.5" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Key className="h-3.5 w-3.5" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2">
              <Bell className="h-3.5 w-3.5" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profile photo</CardTitle>
                <CardDescription>Visible in the header and sidebar</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                    aria-label="Change profile photo"
                    onClick={() => toast.info('Photo upload will connect to your account API')}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <p className="font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Badge variant="outline" className="mt-2 capitalize">
                    {roleLabels[user.role]}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Personal details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="email" className="pl-9" value={user.email} disabled />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Contact your administrator to change your sign-in email.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Facilities"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Role</Label>
                  <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{roleLabels[user.role]}</span>
                    <span className="text-muted-foreground">— assigned by your organization</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveProfile}>Save profile</Button>
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            <Card className="max-w-lg">
              <CardHeader>
                <CardTitle className="text-base">Change password</CardTitle>
                <CardDescription>Use a strong password you do not use elsewhere</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowCurrentPassword((v) => !v)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowNewPassword((v) => !v)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <Button onClick={handleChangePassword}>Update password</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Appearance</CardTitle>
                <CardDescription>Light or dark theme for this device</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Regional</CardTitle>
              </CardHeader>
              <CardContent className="max-w-sm space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern (US)</SelectItem>
                    <SelectItem value="America/Chicago">Central (US)</SelectItem>
                    <SelectItem value="America/Denver">Mountain (US)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific (US)</SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notifications</CardTitle>
                <CardDescription>How you receive alerts for your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Work order updates</p>
                    <p className="text-xs text-muted-foreground">Assignments, status changes, comments</p>
                  </div>
                  <Switch checked={emailWorkOrders} onCheckedChange={setEmailWorkOrders} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Preventive maintenance</p>
                    <p className="text-xs text-muted-foreground">Due and overdue PM tasks</p>
                  </div>
                  <Switch checked={emailMaintenance} onCheckedChange={setEmailMaintenance} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Approvals & escalations</p>
                    <p className="text-xs text-muted-foreground">Items requiring your action</p>
                  </div>
                  <Switch checked={emailApprovals} onCheckedChange={setEmailApprovals} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Push notifications</p>
                    <p className="text-xs text-muted-foreground">In-browser alerts when signed in</p>
                  </div>
                  <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Weekly digest</p>
                    <p className="text-xs text-muted-foreground">Summary email every Monday</p>
                  </div>
                  <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSavePreferences}>Save preferences</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
