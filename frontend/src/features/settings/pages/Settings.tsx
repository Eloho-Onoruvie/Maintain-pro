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

const roleColors: Record<UserRole, string> = {
  admin: "bg-red-400/10 text-red-400 border-red-400/20",
  facility_manager: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  technician: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  vendor: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20",
  staff: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  finance: "bg-amber-400/10 text-amber-400 border-amber-400/20",
};

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  facility_manager: "Facility Manager",
  technician: "Technician",
  vendor: "Vendor",
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
  vendor: [
    "View assigned WOs",
    "Update job status",
    "Upload completion photos",
    "Submit invoices",
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

export function Settings() {
  const [showInvite, setShowInvite] = useState(false);
  const [showRoleDetail, setShowRoleDetail] = useState<UserRole | null>(null);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "technician" as UserRole,
    name: "",
  });
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

  const users = mockUsers.map((u, i) => ({
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
  }));

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Settings & Administration
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Organization profile, users, roles, SLA & system configuration
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="organization">
          <TabsList className="bg-muted border border-border mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="organization" className="gap-2">
              <Building2 className="h-3.5 w-3.5" />
              Organization
            </TabsTrigger>
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
          </TabsList>

          {/* ORGANIZATION */}
          <TabsContent value="organization" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Company Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          label: "Organization Name *",
                          key: "name",
                          placeholder: "Your company name",
                        },
                        {
                          label: "Industry",
                          key: "industry",
                          placeholder: "e.g. Hotel",
                        },
                        {
                          label: "Email",
                          key: "email",
                          placeholder: "facilities@company.com",
                          type: "email",
                        },
                        {
                          label: "Phone",
                          key: "phone",
                          placeholder: "+1 (555) 000-0000",
                        },
                      ].map((f) => (
                        <div key={f.key} className="space-y-1.5">
                          <Label className="text-xs">{f.label}</Label>
                          <Input
                            type={f.type || "text"}
                            placeholder={f.placeholder}
                            value={(orgForm as Record<string, string>)[f.key]}
                            onChange={(e) =>
                              setOrgForm((p) => ({
                                ...p,
                                [f.key]: e.target.value,
                              }))
                            }
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
                    </div>
                    <div className="flex justify-end">
                      <Button size="sm">Save Organization</Button>
                    </div>
                  </CardContent>
                </Card>

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
                    >
                      <Download className="h-4 w-4" />
                      Export All Data
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Request Data Deletion
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* USERS */}
          <TabsContent value="users" className="mt-0 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <Input placeholder="Search users..." className="w-52 h-9" />
                <Select defaultValue="all">
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
                  {users.map((u) => (
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
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
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
              <Button size="sm">Save SLA Configuration</Button>
            </div>
          </TabsContent>

          {/* WORKFLOW RULES */}
          <TabsContent value="workflow" className="mt-0 space-y-4">
            <p className="text-sm text-muted-foreground">
              Automate work order routing, assignment, and escalation
            </p>
            {[
              {
                name: "Auto-assign by Category",
                desc: "Route new WOs to default technician based on service category",
                active: true,
              },
              {
                name: "Auto-approve Low Priority",
                desc: 'Automatically approve work orders with priority "Low" and cost under $500',
                active: false,
              },
              {
                name: "Vendor for HVAC",
                desc: "Route HVAC work orders to CoolTech HVAC Services when internal technicians are unavailable",
                active: true,
              },
              {
                name: "Emergency Fast-Track",
                desc: "Skip approval workflow for emergency work orders",
                active: true,
              },
              {
                name: "Weekend Restriction",
                desc: "Block non-emergency WO assignments on weekends without manager override",
                active: false,
              },
            ].map((rule) => (
              <Card key={rule.name} className="bg-card border-border">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{rule.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {rule.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch defaultChecked={rule.active} />
                    <Button variant="ghost" size="sm" className="text-xs gap-1">
                      <Pencil className="h-3 w-3" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Workflow Rule
            </Button>
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
              <Button size="sm" variant="outline" className="gap-2">
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
                  {(Object.entries(roleLabels) as [UserRole, string][]).map(
                    ([r, l]) => (
                      <SelectItem key={r} value={r}>
                        <div className="flex items-center gap-2">
                          <span>{l}</span>
                        </div>
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
              An email invitation will be sent with a link to set up their
              account. The link expires in 48 hours.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvite(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => setShowInvite(false)}
              disabled={!inviteForm.name || !inviteForm.email}
            >
              Send Invitation
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
              <Button>Edit Permissions</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
