import { useState } from 'react'
import { Crown, Mail, Plus, Trash2, Users } from 'lucide-react'
import { toast } from 'sonner'

import { AppHeader as Navbar } from '@/components/navigation/Navbar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuthStore } from '@/app/store'
import { useActionConfirm } from '@/hooks/useActionConfirm'

const MEMBER_ROLES = ['HVAC Technician', 'Electrician', 'Plumber', 'General Technician', 'Inspector', 'Site Supervisor']

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'invited'
  isTeamLead?: boolean
}

const SEED_MEMBERS: TeamMember[] = [
  { id: 'tm-2', name: 'James Wilson', email: 'james@vendor.com', role: 'HVAC Technician', status: 'active' },
  { id: 'tm-3', name: 'Priya Kapoor', email: 'priya@vendor.com', role: 'Electrician', status: 'invited' },
]

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

export function VendorTeam() {
  const user = useAuthStore((s) => s.user)
  const { requestConfirm, ActionConfirmDialog } = useActionConfirm()

  const teamLead: TeamMember = {
    id: user?.id ?? 'vendor-lead',
    name: `${user?.firstName ?? 'Team'} ${user?.lastName ?? 'Lead'}`,
    email: user?.email ?? '',
    role: 'Team Lead',
    status: 'active',
    isTeamLead: true,
  }

  const [members, setMembers] = useState<TeamMember[]>(SEED_MEMBERS)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', role: MEMBER_ROLES[0] })

  const allMembers = [teamLead, ...members]

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.firstName || !form.email) return
    const name = `${form.firstName} ${form.lastName}`.trim()
    const exists = allMembers.some((m) => m.email.toLowerCase() === form.email.toLowerCase())
    if (exists) {
      toast.error('A team member with this email already exists')
      return
    }
    setMembers((prev) => [
      ...prev,
      { id: `tm-${Date.now()}`, name, email: form.email, role: form.role, status: 'invited' },
    ])
    toast.success(`Invitation sent to ${form.email}`)
    setForm({ firstName: '', lastName: '', email: '', role: MEMBER_ROLES[0] })
    setDialogOpen(false)
  }

  const handleRemove = (member: TeamMember) => {
    requestConfirm({
      title: 'Remove team member?',
      description: `${member.name} will lose access to your vendor portal.`,
      confirmLabel: 'Remove',
      destructive: true,
      onConfirm: () => {
        setMembers((prev) => prev.filter((m) => m.id !== member.id))
        toast.success(`${member.name} removed from team`)
      },
    })
  }

  return (
    <div className="flex flex-col min-h-full">
      {ActionConfirmDialog}
      <Navbar
        title="Team"
        subtitle={`${allMembers.length} member${allMembers.length !== 1 ? 's' : ''} · you are the Team Lead`}
      />
      <div className="page-body flex-1 space-y-6">
        <div className="page-toolbar">
          <div>
            <h2 className="text-lg font-semibold">Team Members</h2>
            <p className="text-sm text-muted-foreground">
              Manage who has access to your vendor portal
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {allMembers.map((member) => (
            <Card key={member.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {initials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-medium truncate">{member.name}</p>
                      {member.isTeamLead && (
                        <Crown className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={
                          member.isTeamLead
                            ? 'text-xs text-amber-400 border-amber-400/20 bg-amber-400/10'
                            : 'text-xs text-muted-foreground'
                        }
                      >
                        {member.role}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          member.status === 'active'
                            ? 'text-xs text-emerald-400 border-emerald-400/20'
                            : 'text-xs text-amber-400 border-amber-400/20'
                        }
                      >
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                  {!member.isTeamLead && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                      onClick={() => handleRemove(member)}
                      aria-label={`Remove ${member.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {members.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="font-medium">No team members yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Invite technicians to collaborate on work orders
            </p>
            <Button className="mt-4" onClick={() => setDialogOpen(true)}>
              Invite your first member
            </Button>
          </div>
        )}
      </div>

      {/* Invite dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle>Invite team member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInvite} className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">First name *</Label>
                <Input
                  placeholder="Jane"
                  value={form.firstName}
                  onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Last name</Label>
                <Input
                  placeholder="Smith"
                  value={form.lastName}
                  onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Work email *</Label>
              <Input
                type="email"
                placeholder="jane@yourcompany.com"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm((p) => ({ ...p, role: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEMBER_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                They'll receive an invite link to join your vendor team.
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!form.firstName || !form.email}>
                Send Invite
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
