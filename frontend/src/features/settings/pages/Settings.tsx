import { useState } from "react";
import {
  Building2,
  Users,
  Shield,
  Sliders,
  GitBranch,
  FileText,
  Download,
  Check,
  X,
  Globe,
  Clock,
  DollarSign,
  Mail,
  Phone,
  Plus,
  Pencil,
  Trash2,
  Camera,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { mockUsers } from "@/features/dashboard/services/dashboard.service";
import { useAuthStore } from "@/app/store";
import { formatDate, formatRelativeDate } from "@/utils/formatDate";
import { cn } from "@/utils/helpers";
import type { UserRole } from "@/types/user.types";
import { toast } from "sonner";
import { createMockInvite } from "@/features/auth/utils/mockInvite";
import { PORTALS } from "@/app/portal.config";
import { AppHeader } from "@/components/navigation/Navbar";
import { usePortal } from "@/hooks/usePortal";
import { useActionConfirm } from "@/hooks/useActionConfirm";
import { useDownloadConfirm } from "@/hooks/useDownloadConfirm";
import { downloadJson } from "@/utils/downloadFile";
import { useMockDataStore } from "@/services/mockDataStore";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import type { EscalationRule } from "@/types/common.types";

const roleColors: Record<UserRole, string> = {
  admin: "bg-red-400/10 text-red-400 border-red-400/20",
  facility_manager: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  technician: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  vendor_team_lead: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20",
  vendor_technician: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20",
  staff: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  finance: "bg-amber-400/10 text-amber-400 border-amber-400/20",
};

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  facility_manager: "Facility Manager",
  technician: "Technician",
  vendor_team_lead: "Vendor Team Lead",
  vendor_technician: "Vendor Technician",
  staff: "Staff",
  finance: "Finance",
};

const rolePermissions: Record<UserRole, string[]> = {
  admin: ["All permissions"],
  facility_manager: [
    "View dashboard",
    "Manage work orders",
    "Manage PM schedules",
    "View reports",
    "Manage vendors",
    "Approve work orders",
  ],
  technician: [
    "View assigned WOs",
    "Update WO status",
    "Log time & parts",
    "Upload photos",
    "Report issues",
  ],
  vendor_team_lead: [
    "View assigned WOs",
    "Update job status",
    "Upload completion photos",
    "Submit invoices",
  ],
  vendor_technician: [
    "View assigned WOs",
    "Update job status",
    "Upload completion photos",
  ],
  staff: [
    "Submit service requests",
    "Track request status",
    "Rate completed services",
  ],
  finance: [
    "View cost reports",
    "Approve high-value WOs",
    "Verify vendor invoices",
    "Export financial data",
  ],
};

const mockAuditLog = [
  {
    id: "1",
    userId: "u1",
    userName: "Sarah Chen",
    action: "Created",
    resource: "Work Order",
    resourceId: "WO-2024-089",
    timestamp: new Date(Date.now() - 10 * 60000),
  },
  {
    id: "2",
    userId: "u2",
    userName: "Mike Rodriguez",
    action: "Updated status",
    resource: "Work Order",
    resourceId: "WO-2024-085",
    timestamp: new Date(Date.now() - 25 * 60000),
  },
  {
    id: "3",
    userId: "u1",
    userName: "Sarah Chen",
    action: "Approved",
    resource: "Work Order",
    resourceId: "WO-2024-091",
    timestamp: new Date(Date.now() - 1 * 3600000),
  },
  {
    id: "4",
    userId: "u4",
    userName: "James Park",
    action: "Invited user",
    resource: "User",
    resourceId: "james.smith@co.com",
    timestamp: new Date(Date.now() - 2 * 3600000),
  },
  {
    id: "5",
    userId: "u1",
    userName: "Sarah Chen",
    action: "Updated SLA config",
    resource: "Settings",
    resourceId: "sla",
    timestamp: new Date(Date.now() - 4 * 3600000),
  },
  {
    id: "6",
    userId: "u3",
    userName: "Emma Wilson",
    action: "Submitted invoice",
    resource: "Vendor",
    resourceId: "CoolTech HVAC",
    timestamp: new Date(Date.now() - 6 * 3600000),
  },
  {
    id: "7",
    userId: "u4",
    userName: "James Park",
    action: "Exported",
    resource: "Report",
    resourceId: "Cost Analysis Q4",
    timestamp: new Date(Date.now() - 8 * 3600000),
  },
  {
    id: "8",
    userId: "u2",
    userName: "Mike Rodriguez",
    action: "Completed",
    resource: "PM Schedule",
    resourceId: "Quarterly HVAC",
    timestamp: new Date(Date.now() - 10 * 3600000),
  },
];

const defaultSLA = {
  critical: { responseHours: 1, resolutionHours: 4 },
  high: { responseHours: 4, resolutionHours: 24 },
  medium: { responseHours: 8, resolutionHours: 72 },
  low: { responseHours: 24, resolutionHours: 168 },
  approvalThreshold: 2000,
};

const INVITABLE_ORG_ROLES: UserRole[] = [
  "facility_manager",
  "technician",
  "staff",
  "finance",
];

export function Settings() {
  const portal = usePortal();
  const isVendorPortal = portal === PORTALS.VENDOR;
  const { canConfigureEscalation, canViewEscalationRules } = useRoleAccess();
  const storeEscalationRules = useMockDataStore((s) => s.escalationRules ?? []);
  const [escalationRules, setEscalationRules] = useState<EscalationRule[]>(storeEscalationRules);
  const [showEscalationCreate, setShowEscalationCreate] = useState(false);
  const [escalationForm, setEscalationForm] = useState({
    name: '', triggerHours: 24, priority: 'high' as EscalationRule['priority'],
    escalateTo: '', method: ['in_app'] as EscalationRule['method'], level: 1,
  });
  const { requestDownload, DownloadConfirmDialog } = useDownloadConfirm();
  const { requestConfirm, ActionConfirmDialog } = useActionConfirm();
  const [showInvite, setShowInvite] = useState(false);
  const [showRoleDetail, setShowRoleDetail] = useState<UserRole | null>(null);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "facility_manager" as UserRole,
    name: "",
  });
  const [lastInviteUrl, setLastInviteUrl] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  const isAdmin = user?.role === "admin";

  const [sla, setSLA] = useState(defaultSLA);
  const [orgForm, setOrgForm] = useState({
    name: "MaintainPro Demo Corp",
    industry: "Corporate Offices",
    email: "facilities@demo.com",
    phone: "+1 (555) 010-2030",
    address: "123 Corporate Drive, Suite 400, New York, NY 10001",
    timezone: "America/New_York",
    currency: "USD",
  });

  const [users, setUsers] = useState(
    mockUsers.map((u, i) => ({
    ...u,
    status: i < 4 ? "active" : "pending",
    lastLogin: i < 3 ? new Date(Date.now() - i * 24 * 3600000) : undefined,
    department: [
      "Operations",
      "Maintenance",
      "Management",
      "Finance",
      "External",
    ][i % 5],
  })),
  );
  const [usersSearch, setUsersSearch] = useState("");
  const [usersRoleFilter, setUsersRoleFilter] = useState<"all" | UserRole>("all");

  const filteredUsers = users.filter((u) => {
    const term = usersSearch.toLowerCase();
    const matchesSearch =
      !term ||
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term);
    const matchesRole = usersRoleFilter === "all" || u.role === usersRoleFilter;
    return matchesSearch && matchesRole;
  });

  const handleInvite = () => {
    if (!inviteForm.name || !inviteForm.email) return;
    requestConfirm({
      title: "Send invitation?",
      description: `Invite ${inviteForm.name} (${inviteForm.email}) to join the organization?`,
      confirmLabel: "Send invite",
      onConfirm: () => {
        const [firstName, ...rest] = inviteForm.name.trim().split(/\s+/)
        const lastName = rest.join(' ') || firstName
        const { acceptUrl } = createMockInvite({
          email: inviteForm.email,
          role: inviteForm.role,
          firstName,
          lastName,
        })
        setUsers((prev) => [
          {
            id: `inv-${Date.now()}`,
            name: inviteForm.name,
            email: inviteForm.email,
            role: inviteForm.role,
            status: "pending",
            department: "Operations",
          } as (typeof users)[number],
          ...prev,
        ]);
        setLastInviteUrl(acceptUrl)
        toast.success("Invitation created — share the accept link below");
        setInviteForm({ name: "", email: "", role: "facility_manager" as UserRole });
      },
    });
  };

  return (
    <div className="flex flex-col bg-background">
      {DownloadConfirmDialog}
      {ActionConfirmDialog}
      <AppHeader
        title={isVendorPortal ? "Business settings" : "Organization administration"}
        subtitle={
          isVendorPortal
            ? "Company profile, team access, and vendor portal configuration"
            : "Organization profile, users, roles, SLA & system configuration"
        }
        hideQuickCreate
      />

      <div className="page-body">
        <Tabs defaultValue="organization">
          <TabsList className="tabs-list-scroll bg-muted border border-border">
            <TabsTrigger value="organization" className="gap-2">
              <Building2 className="h-3.5 w-3.5" />
              {isVendorPortal ? 'Company' : 'Organization'}
            </TabsTrigger>
            {!isVendorPortal && (
              <>
                <TabsTrigger value="users" className="gap-2">
                  <Users className="h-3.5 w-3.5" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="roles" className="gap-2">
                  <Shield className="h-3.5 w-3.5" />
                  Roles & Permissions
                </TabsTrigger>
                {isAdmin && (
                  <>
                    <TabsTrigger value="sla" className="gap-2">
                      <Sliders className="h-3.5 w-3.5" />
                      SLA Config
                    </TabsTrigger>
                    <TabsTrigger value="workflow" className="gap-2">
                      <GitBranch className="h-3.5 w-3.5" />
                      Workflow Rules
                    </TabsTrigger>
                  </>
                )}
                <TabsTrigger value="audit" className="gap-2">
                  <FileText className="h-3.5 w-3.5" />
                  Audit Log
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {/* ORGANIZATION / COMPANY */}
          <TabsContent value="organization" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      {isVendorPortal ? 'Business Information' : 'Company Information'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {(isVendorPortal
                        ? [
                            { label: 'Company Name *', key: 'name', placeholder: 'Your company name' },
                            { label: 'Service Category', key: 'industry', placeholder: 'e.g. HVAC, Electrical' },
                            { label: 'Business Email', key: 'email', placeholder: 'service@company.com', type: 'email' },
                            { label: 'Phone', key: 'phone', placeholder: '+1 (555) 000-0000' },
                          ]
                        : [
                            { label: 'Organization Name *', key: 'name', placeholder: 'Your company name' },
                            { label: 'Industry', key: 'industry', placeholder: 'e.g. Hotel' },
                            { label: 'Email', key: 'email', placeholder: 'facilities@company.com', type: 'email' },
                            { label: 'Phone', key: 'phone', placeholder: '+1 (555) 000-0000' },
                          ]
                      ).map((f) => (
                        <div key={f.key} className="space-y-1.5">
                          <Label className="text-xs">{f.label}</Label>
                          <Input
                            type={(f as any).type || "text"}
                            placeholder={f.placeholder}
                            value={(orgForm as Record<string, string>)[f.key]}
                            onChange={(e) => setOrgForm((p) => ({ ...p, [f.key]: e.target.value }))}
                          />
                        </div>
                      ))}
                      <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs">Address</Label>
                        <Textarea
                          placeholder="Full address"
                          rows={2}
                          value={orgForm.address}
                          onChange={(e) =>
                            setOrgForm((p) => ({
                              ...p,
                              address: e.target.value,
                            }))
                          }
                        />
                      </div>
                      {!isVendorPortal && (
                        <>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Timezone</Label>
                        <Select
                          value={orgForm.timezone}
                          onValueChange={(v) =>
                            setOrgForm((p) => ({ ...p, timezone: v }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "America/New_York",
                              "America/Chicago",
                              "America/Los_Angeles",
                              "America/Denver",
                              "Europe/London",
                              "Europe/Paris",
                              "Asia/Dubai",
                              "Asia/Singapore",
                              "Asia/Tokyo",
                            ].map((tz) => (
                              <SelectItem key={tz} value={tz}>
                                {tz.replace("_", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Currency</Label>
                        <Select
                          value={orgForm.currency}
                          onValueChange={(v) =>
                            setOrgForm((p) => ({ ...p, currency: v }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              ["USD", "US Dollar"],
                              ["GBP", "British Pound"],
                              ["EUR", "Euro"],
                              ["AED", "UAE Dirham"],
                              ["SGD", "Singapore Dollar"],
                              ["NGN", "Nigerian Naira"],
                            ].map(([code, name]) => (
                              <SelectItem key={code} value={code}>
                                {code} — {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                        </>
                      )}
                    </div>
                    
                    <div className="flex justify-end">
                      <Button size="sm">{isVendorPortal ? 'Save Business Info' : 'Save Organization'}</Button>
                    </div>
                  </CardContent>
                </Card>

                {!isVendorPortal && (
                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Feature Flags
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        label: "Multi-Site Support",
                        desc: "Manage multiple facility locations",
                        enabled: true,
                      },
                      {
                        label: "Vendor Portal",
                        desc: "Allow vendors to self-manage work orders",
                        enabled: true,
                      },
                      {
                        label: "Guest Request Portal",
                        desc: "Public-facing request form (e.g. hotel guests)",
                        enabled: false,
                      },
                      {
                        label: "Finance Approvals",
                        desc: "Require approval for WOs above threshold",
                        enabled: true,
                      },
                      {
                        label: "IoT Sensor Integration",
                        desc: "Connect sensors for automated alerts",
                        enabled: false,
                      },
                    ].map((f) => (
                      <div
                        key={f.label}
                        className="flex items-center justify-between py-1 border-b border-border/50 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium">{f.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {f.desc}
                          </p>
                        </div>
                        <Switch defaultChecked={f.enabled} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
                 )}
              </div>
           
              <div className="space-y-4">
                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Company Logo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-3">
                    <div className="h-24 w-24 bg-primary/10 rounded-xl flex items-center justify-center mx-auto border-2 border-dashed border-primary/30">
                      <Building2 className="h-10 w-10 text-primary/50" />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 w-full"
                      onClick={() =>
                        requestConfirm({
                          title: "Upload company logo?",
                          description: "Logo upload will connect to your organization API.",
                          confirmLabel: "Continue",
                          singleAction: true,
                          onConfirm: () => {},
                        })
                      }
                    >
                      <Camera className="h-4 w-4" />
                      Upload Logo
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG up to 2MB. Recommended: 200×200px
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Data Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                      onClick={() =>
                        requestDownload({
                          title: "Export organization data?",
                          description:
                            "A JSON file with organization settings, users, and SLA configuration will be downloaded to your device.",
                          confirmLabel: "Download export",
                          onDownload: () => {
                            downloadJson("maintainpro-organization-export.json", {
                              organization: orgForm,
                              users,
                              sla,
                            });
                            toast.success("Organization data exported");
                          },
                        })
                      }
                    >
                      <Download className="h-4 w-4" />
                      Export All Data
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 text-destructive hover:text-destructive"
                      onClick={() =>
                        requestConfirm({
                          title: "Request data deletion?",
                          description:
                            "Submit a request to delete organization data? This action may require admin approval.",
                          confirmLabel: "Submit request",
                          destructive: true,
                          onConfirm: () => toast.warning("Data deletion request submitted"),
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                      Request Data Deletion
                    </Button>
                  </CardContent>
                </Card>
                
                {/* end !isVendorPortal */}
              </div>
            </div>
          </TabsContent>

          {/* USERS */}
          <TabsContent value="users" className="mt-0 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <Input
                  placeholder="Search users..."
                  className="w-52 h-9"
                  value={usersSearch}
                  onChange={(e) => setUsersSearch(e.target.value)}
                />
                <Select
                  value={usersRoleFilter}
                  onValueChange={(v) => setUsersRoleFilter(v as "all" | UserRole)}
                >
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                      <SelectItem key={r} value={r}>
                        {roleLabels[r]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                size="sm"
                className="gap-2"
                onClick={() => setShowInvite(true)}
              >
                <Plus className="h-4 w-4" />
                Invite User
              </Button>
            </div>
            <Card className="bg-card border-border">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    {[
                      "User",
                      "Role",
                      "Department",
                      "Status",
                      "Last Login",
                      "Actions",
                    ].map((h) => (
                      <TableHead
                        key={h}
                        className="text-muted-foreground text-xs"
                      >
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id} className="border-border">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs">
                              {u.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{u.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            roleColors[u.role as UserRole],
                          )}
                        >
                          {roleLabels[u.role as UserRole]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {u.department}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            u.status === "active"
                              ? "text-emerald-400 border-emerald-400/20"
                              : "text-amber-400 border-amber-400/20",
                          )}
                        >
                          {u.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {u.lastLogin
                          ? formatRelativeDate(u.lastLogin)
                          : "Never"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              requestConfirm({
                                title: `Edit ${u.name}?`,
                                description: "User editing will connect to your directory API.",
                                confirmLabel: "Continue",
                                singleAction: true,
                                onConfirm: () => {},
                              })
                            }
                            aria-label={`Edit user ${u.name}`}
                          >
                            <Pencil className="h-3.5 w-3.5" aria-hidden />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:text-destructive"
                            onClick={() =>
                              requestConfirm({
                                title: "Remove user?",
                                description: `Remove ${u.name} from this organization?`,
                                confirmLabel: "Remove",
                                destructive: true,
                                onConfirm: () => {
                                  setUsers((prev) => prev.filter((item) => item.id !== u.id));
                                  toast.success("User removed");
                                },
                              })
                            }
                            aria-label={`Remove user ${u.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* ROLES & PERMISSIONS */}
          <TabsContent value="roles" className="mt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {(Object.entries(roleLabels) as [UserRole, string][]).map(
                ([role, label]) => (
                  <Card
                    key={role}
                    className="bg-card border-border hover:border-primary/30 transition-colors cursor-pointer"
                    onClick={() => setShowRoleDetail(role)}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className={cn("text-xs", roleColors[role])}
                        >
                          {label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {users.filter((u) => u.role === role).length} users
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {rolePermissions[role].slice(0, 4).map((p) => (
                          <div
                            key={p}
                            className="flex items-center gap-2 text-xs text-muted-foreground"
                          >
                            <Check className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                            {p}
                          </div>
                        ))}
                        {rolePermissions[role].length > 4 && (
                          <p className="text-xs text-muted-foreground pl-5">
                            +{rolePermissions[role].length - 4} more
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full h-7 text-xs gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowRoleDetail(role);
                        }}
                      >
                        <Pencil className="h-3 w-3" />
                        Edit Permissions
                      </Button>
                    </CardContent>
                  </Card>
                ),
              )}
            </div>
          </TabsContent>

          {/* SLA CONFIG */}
          <TabsContent value="sla" className="mt-0 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  SLA Response & Resolution Times
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Define target response and resolution times per priority level
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(["critical", "high", "medium", "low"] as const).map(
                    (priority) => {
                      const colors = {
                        critical: "text-red-400",
                        high: "text-orange-400",
                        medium: "text-amber-400",
                        low: "text-muted-foreground",
                      };
                      return (
                        <div
                          key={priority}
                          className="grid grid-cols-3 gap-4 items-center py-3 border-b border-border/50 last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full",
                                {
                                  critical: "bg-red-400",
                                  high: "bg-orange-400",
                                  medium: "bg-amber-400",
                                  low: "bg-muted-foreground",
                                }[priority],
                              )}
                            />
                            <span
                              className={cn(
                                "text-sm font-medium capitalize",
                                colors[priority],
                              )}
                            >
                              {priority}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              Response Time (hours)
                            </Label>
                            <Input
                              type="number"
                              className="h-8"
                              value={sla[priority].responseHours}
                              onChange={(e) =>
                                setSLA((s) => ({
                                  ...s,
                                  [priority]: {
                                    ...s[priority],
                                    responseHours: Number(e.target.value),
                                  },
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              Resolution Time (hours)
                            </Label>
                            <Input
                              type="number"
                              className="h-8"
                              value={sla[priority].resolutionHours}
                              onChange={(e) =>
                                setSLA((s) => ({
                                  ...s,
                                  [priority]: {
                                    ...s[priority],
                                    resolutionHours: Number(e.target.value),
                                  },
                                }))
                              }
                            />
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Finance Approval Threshold
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Work orders above this amount require finance approval
                </p>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <div className="relative w-48">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    className="pl-8"
                    value={sla.approvalThreshold}
                    onChange={(e) =>
                      setSLA((s) => ({
                        ...s,
                        approvalThreshold: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Any work order estimated over this amount will be flagged for
                  approval
                </p>
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button size="sm" onClick={() => toast.success("SLA configuration saved")}>
                Save SLA Configuration
              </Button>
            </div>
          </TabsContent>

          {/* WORKFLOW / ESCALATION RULES — US-14 */}
          <TabsContent value="workflow" className="mt-0 space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Define escalation rules so overdue work orders automatically notify the right people.
                {!canConfigureEscalation && (
                  <span className="ml-1 text-amber-400">You can view rules but only Admin can create or edit them.</span>
                )}
              </p>
            </div>

            {/* Escalation Rules List */}
            <div className="space-y-3">
              {escalationRules.length === 0 && (
                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                  <p className="text-sm font-medium">No escalation rules configured</p>
                  <p className="text-xs text-muted-foreground mt-1">Create a rule to notify managers when work orders are overdue</p>
                </div>
              )}
              {escalationRules.map((rule) => (
                <Card key={rule.id} className="bg-card border-border">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium">{rule.name}</p>
                        <Badge variant="outline" className={cn(
                          'text-xs capitalize',
                          rule.priority === 'critical' && 'text-red-400 border-red-400/20 bg-red-400/10',
                          rule.priority === 'high' && 'text-orange-400 border-orange-400/20 bg-orange-400/10',
                          rule.priority === 'medium' && 'text-amber-400 border-amber-400/20 bg-amber-400/10',
                          rule.priority === 'low' && 'text-muted-foreground',
                        )}>
                          Level {rule.level} · {rule.priority}
                        </Badge>
                        <Badge variant={rule.isActive ? 'default' : 'secondary'} className="text-xs">
                          {rule.isActive ? 'Active' : 'Paused'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Triggers after <strong>{rule.triggerHours}h</strong> overdue · Escalate to: <strong>{rule.escalateTo || 'Facility Manager'}</strong>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Notify via: {rule.method.join(', ')}
                      </p>
                    </div>
                    {canConfigureEscalation && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={(checked) =>
                            setEscalationRules((prev) =>
                              prev.map((r) => r.id === rule.id ? { ...r, isActive: checked } : r)
                            )
                          }
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs gap-1"
                          onClick={() =>
                            requestConfirm({
                              title: `Test "${rule.name}"?`,
                              description: `Send a test notification to "${rule.escalateTo || 'Facility Manager'}" to verify the rule fires correctly.`,
                              confirmLabel: 'Send test',
                              onConfirm: () => toast.success('Test notification sent'),
                            })
                          }
                        >
                          Test
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:text-destructive"
                          onClick={() =>
                            requestConfirm({
                              title: 'Delete rule?',
                              description: `Remove the "${rule.name}" escalation rule?`,
                              confirmLabel: 'Delete',
                              destructive: true,
                              onConfirm: () =>
                                setEscalationRules((prev) => prev.filter((r) => r.id !== rule.id)),
                            })
                          }
                          aria-label="Delete rule"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Create Rule */}
            {canConfigureEscalation && (
              <>
                {!showEscalationCreate ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setShowEscalationCreate(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Add Escalation Rule
                  </Button>
                ) : (
                  <Card className="bg-card border-border border-dashed">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">New Escalation Rule</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Rule name *</Label>
                          <Input
                            placeholder="e.g. Critical overdue alert"
                            value={escalationForm.name}
                            onChange={(e) => setEscalationForm((p) => ({ ...p, name: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Trigger after (hours) *</Label>
                          <Input
                            type="number"
                            min={1}
                            value={escalationForm.triggerHours}
                            onChange={(e) => setEscalationForm((p) => ({ ...p, triggerHours: Number(e.target.value) }))}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Priority level</Label>
                          <Select
                            value={escalationForm.priority}
                            onValueChange={(v) => setEscalationForm((p) => ({ ...p, priority: v as EscalationRule['priority'] }))}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="critical">Critical</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Escalation level</Label>
                          <Select
                            value={String(escalationForm.level)}
                            onValueChange={(v) => setEscalationForm((p) => ({ ...p, level: Number(v) }))}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Level 1 (Manager)</SelectItem>
                              <SelectItem value="2">Level 2 (Director)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Escalate to (name or email)</Label>
                        <Input
                          placeholder="e.g. Facility Manager, director@company.com"
                          value={escalationForm.escalateTo}
                          onChange={(e) => setEscalationForm((p) => ({ ...p, escalateTo: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Notification method</Label>
                        <div className="flex flex-wrap gap-3">
                          {(['in_app', 'email', 'sms'] as const).map((method) => (
                            <label key={method} className="flex items-center gap-2 text-sm cursor-pointer">
                              <input
                                type="checkbox"
                                checked={escalationForm.method.includes(method)}
                                onChange={(e) =>
                                  setEscalationForm((p) => ({
                                    ...p,
                                    method: e.target.checked
                                      ? [...p.method, method]
                                      : p.method.filter((m) => m !== method),
                                  }))
                                }
                                className="rounded"
                              />
                              {method === 'in_app' ? 'In-App' : method.toUpperCase()}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button
                          size="sm"
                          disabled={!escalationForm.name || !escalationForm.triggerHours}
                          onClick={() => {
                            const newRule: EscalationRule = {
                              id: `esc-${Date.now()}`,
                              name: escalationForm.name,
                              triggerHours: escalationForm.triggerHours,
                              priority: escalationForm.priority,
                              escalateTo: escalationForm.escalateTo || 'Facility Manager',
                              method: escalationForm.method.length ? escalationForm.method : ['in_app'],
                              isActive: true,
                              level: escalationForm.level,
                            }
                            setEscalationRules((prev) => [...prev, newRule])
                            toast.success('Escalation rule created')
                            setEscalationForm({ name: '', triggerHours: 24, priority: 'high', escalateTo: '', method: ['in_app'], level: 1 })
                            setShowEscalationCreate(false)
                          }}
                        >
                          Create Rule
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowEscalationCreate(false)}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          {/* AUDIT LOG */}
          <TabsContent value="audit" className="mt-0 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <Input placeholder="Search audit log..." className="w-52 h-9" />
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue placeholder="Resource" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Resources</SelectItem>
                    <SelectItem value="work_order">Work Orders</SelectItem>
                    <SelectItem value="user">Users</SelectItem>
                    <SelectItem value="settings">Settings</SelectItem>
                    <SelectItem value="vendor">Vendors</SelectItem>
                    <SelectItem value="report">Reports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() =>
                  requestDownload({
                    title: "Export audit log?",
                    description:
                      "The full audit log will be downloaded as a JSON file to your device.",
                    confirmLabel: "Download log",
                    onDownload: () => {
                      downloadJson("maintainpro-audit-log.json", mockAuditLog);
                      toast.success("Audit log exported");
                    },
                  })
                }
              >
                <Download className="h-4 w-4" />
                Export Log
              </Button>
            </div>
            <Card className="bg-card border-border">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    {["Timestamp", "User", "Action", "Resource", "ID"].map(
                      (h) => (
                        <TableHead
                          key={h}
                          className="text-muted-foreground text-xs"
                        >
                          {h}
                        </TableHead>
                      ),
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAuditLog.map((log) => (
                    <TableRow key={log.id} className="border-border">
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatRelativeDate(log.timestamp)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                              {log.userName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{log.userName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {log.resource}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {log.resourceId}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Invite Dialog */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Full Name *</Label>
              <Input
                placeholder="e.g. John Smith"
                value={inviteForm.name}
                onChange={(e) =>
                  setInviteForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email Address *</Label>
              <Input
                type="email"
                placeholder="john@company.com"
                value={inviteForm.email}
                onChange={(e) =>
                  setInviteForm((p) => ({ ...p, email: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Role *</Label>
              <Select
                value={inviteForm.role}
                onValueChange={(v) =>
                  setInviteForm((p) => ({ ...p, role: v as UserRole }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
              {INVITABLE_ORG_ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  <div className="flex items-center gap-2">
                    <span>{roleLabels[r]}</span>
                  </div>
                </SelectItem>
              ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              In production this link is emailed automatically. For demo, copy the accept URL
              after sending and share it with the invitee (expires in 7 days).
            </div>
            {lastInviteUrl ? (
              <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
                <Label className="text-xs">Accept invitation link</Label>
                <div className="flex gap-2">
                  <Input readOnly value={lastInviteUrl} className="text-xs font-mono" />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      await navigator.clipboard.writeText(lastInviteUrl)
                      toast.success('Link copied to clipboard')
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowInvite(false)
                setLastInviteUrl(null)
              }}
            >
              {lastInviteUrl ? 'Done' : 'Cancel'}
            </Button>
            <Button
              onClick={handleInvite}
              disabled={!inviteForm.name || !inviteForm.email}
            >
              {lastInviteUrl ? 'Send another' : 'Create invitation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Detail Dialog */}
      <Dialog
        open={!!showRoleDetail}
        onOpenChange={() => setShowRoleDetail(null)}
      >
        {showRoleDetail && (
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(roleColors[showRoleDetail])}
                >
                  {roleLabels[showRoleDetail]}
                </Badge>
                Permissions
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2 py-2">
              {rolePermissions[showRoleDetail].map((p) => (
                <div
                  key={p}
                  className="flex items-center gap-2 p-2 rounded hover:bg-muted/50"
                >
                  <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">{p}</span>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRoleDetail(null)}>
                Close
              </Button>
              <Button
                onClick={() =>
                  requestConfirm({
                    title: "Permissions editor",
                    description: "Role permissions editor will be available in a future release.",
                    confirmLabel: "OK",
                    singleAction: true,
                    onConfirm: () => {},
                  })
                }
              >
                Edit Permissions
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
