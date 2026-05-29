import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Users } from 'lucide-react'

import { AppHeader as Navbar } from '@/components/navigation/Navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const INITIAL_TEAM = [
  { id: '1', name: 'Mike Rodriguez', role: 'Lead Technician', status: 'active' as const },
  { id: '2', name: 'Sarah Chen', role: 'HVAC Specialist', status: 'active' as const },
  { id: '3', name: 'James Wilson', role: 'Electrician', status: 'invited' as const },
]

export function VendorTeam() {
  const [team, setTeam] = useState(INITIAL_TEAM)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return

    const name = inviteEmail.split('@')[0].replace('.', ' ')
    setTeam((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: name.charAt(0).toUpperCase() + name.slice(1),
        role: 'Team Member',
        status: 'invited' as const,
      },
    ])
    toast.success(`Invitation sent to ${inviteEmail}`)
    setInviteEmail('')
    setDialogOpen(false)
  }

  return (
    <div className="flex flex-col min-h-full">
      <Navbar title="Team" subtitle="Manage your vendor team members" />
      <div className="page-body flex-1 space-y-6">
        <div className="page-toolbar">
          <div>
            <h2 className="text-lg font-semibold">Team Members</h2>
            <p className="text-sm text-muted-foreground">{team.length} members in your organization</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <Card key={member.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base truncate">{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </div>
                  <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                    {member.status}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {team.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="font-medium">No team members yet</p>
              <p className="text-sm text-muted-foreground mt-1">Invite technicians to collaborate on work orders</p>
              <Button className="mt-4" onClick={() => setDialogOpen(true)}>
                Invite your first member
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite team member</DialogTitle>
            <DialogDescription>Send an email invitation to join your vendor team on MaintainPro.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInvite}>
            <div className="space-y-2 py-2">
              <Label htmlFor="inviteEmail">Email address</Label>
              <Input
                id="inviteEmail"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Send Invitation</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
