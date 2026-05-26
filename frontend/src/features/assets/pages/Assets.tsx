import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  QrCode,
  Download,
  Upload,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Archive,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAssets } from "../hooks/useAssets";
import { mockLocations } from "../services/assets.service";
import type { AssetStatus } from "@/types/common.types";
import { cn } from "@/utils/helpers";
import { formatDate } from "@/utils/formatDate";

const SERVICE_CATEGORIES = [
  "HVAC",
  "Electrical",
  "Plumbing",
  "Fire Safety",
  "Elevator",
  "Security",
  "Cleaning",
  "General",
];

const statusConfig: Record<
  AssetStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  active: {
    label: "active",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    icon: CheckCircle2,
  },
  needs_maintenance: {
    label: "Needs Maintenance",
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    icon: AlertTriangle,
  },
  under_repair: {
    label: "Under Repair",
    color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    icon: Wrench,
  },
  decommissioned: {
    label: "Decommissioned",
    color: "text-muted-foreground bg-muted border-border",
    icon: Archive,
  },
  down: {
    label: "down",
    color: "text-red-400 bg-red-400/10 border-red-400/20",
    icon: AlertTriangle,
  },
};

export function Assets() {
  const { assets, stats, filters, setFilters } = useAssets();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    model: "",
    serialNumber: "",
    manufacturer: "",
    locationId: "",
    status: "active",
    purchaseCost: "",
    warrantyExpiry: "",
    installDate: "",
    description: "",
  });

  const handleSave = () => {
    // In production: call assetsService.create(form)
    setShowCreate(false);
    setForm({
      name: "",
      category: "",
      model: "",
      serialNumber: "",
      manufacturer: "",
      locationId: "",
      status: "active",
      purchaseCost: "",
      warrantyExpiry: "",
      installDate: "",
      description: "",
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Assets</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage all equipment and infrastructure
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="h-4 w-4" /> Import CSV
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button
              size="sm"
              className="gap-2"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="h-4 w-4" /> Add Asset
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            {
              label: "Total Assets",
              value: stats.total,
              icon: Cpu,
              color: "text-foreground",
            },
            {
              label: "active",
              value: stats.active,
              icon: CheckCircle2,
              color: "text-emerald-400",
            },
            {
              label: "Needs Maintenance",
              value: stats.needsMaintenance,
              icon: AlertTriangle,
              color: "text-amber-400",
            },
            {
              label: "Under Repair",
              value: stats.underRepair,
              icon: Wrench,
              color: "text-blue-400",
            },
            {
              label: "Decommissioned",
              value: stats.decommissioned,
              icon: Archive,
              color: "text-muted-foreground",
            },
          ].map((s) => (
            <Card key={s.label} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className={cn("text-2xl font-semibold mt-1", s.color)}>
                      {s.value}
                    </p>
                  </div>
                  <s.icon className={cn("h-5 w-5", s.color)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets or serial number..."
              className="pl-9"
              value={filters.search || ""}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
            />
          </div>
          <Select
            value={filters.status || "all"}
            onValueChange={(v) => setFilters((f) => ({ ...f, status: v }))}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">active</SelectItem>
              <SelectItem value="needs_maintenance">
                Needs Maintenance
              </SelectItem>
              <SelectItem value="under_repair">Under Repair</SelectItem>
              <SelectItem value="decommissioned">Decommissioned</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.category || "all"}
            onValueChange={(v) => setFilters((f) => ({ ...f, category: v }))}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {SERVICE_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Table */}
        <Card className="bg-card border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                {[
                  "Asset",
                  "Category",
                  "Location",
                  "Status",
                  "Install Date",
                  "Next Maintenance",
                  "Actions",
                ].map((h) => (
                  <TableHead key={h} className="text-muted-foreground text-xs">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => {
                const s = statusConfig[asset.status];
                const Icon = s.icon;
                return (
                  <TableRow key={asset.id} className="border-border group">
                    <TableCell>
                      <Link
                        to={`/assets/${asset.id}`}
                        className="block group-hover:text-primary transition-colors"
                      >
                        <p className="font-medium text-foreground">
                          {asset.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {asset.manufacturer && `${asset.manufacturer} · `}
                          {asset.model || "—"}
                        </p>
                        {asset.serialNumber && (
                          <p className="text-xs text-muted-foreground font-mono">
                            {asset.serialNumber}
                          </p>
                        )}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {asset.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {asset.locationName}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("gap-1 text-xs", s.color)}
                      >
                        <Icon className="h-3 w-3" />
                        {s.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {asset.installDate
                          ? formatDate(asset.installDate)
                          : "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "text-sm",
                          asset.nextMaintenanceDate &&
                            new Date(asset.nextMaintenanceDate) < new Date()
                            ? "text-red-400"
                            : "",
                        )}
                      >
                        {asset.nextMaintenanceDate
                          ? formatDate(asset.nextMaintenanceDate)
                          : "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/assets/${asset.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit Asset</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <QrCode className="h-4 w-4" />
                            Generate QR
                          </DropdownMenuItem>
                          <DropdownMenuItem>View History</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Decommission
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {assets.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Cpu className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No assets found</p>
              <p className="text-sm mt-1">Adjust filters or add a new asset</p>
            </div>
          )}
        </Card>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle>Register New Asset</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            {[
              {
                label: "Asset Name *",
                key: "name",
                placeholder: "e.g. Carrier HVAC Unit #A3-01",
              },
              {
                label: "Manufacturer",
                key: "manufacturer",
                placeholder: "e.g. Carrier",
              },
              { label: "Model", key: "model", placeholder: "e.g. AHU-500X" },
              {
                label: "Serial Number",
                key: "serialNumber",
                placeholder: "e.g. SN-2024-00123",
              },
              {
                label: "Purchase Cost ($)",
                key: "purchaseCost",
                placeholder: "0.00",
              },
              { label: "Install Date", key: "installDate", type: "date" },
              { label: "Warranty Expiry", key: "warrantyExpiry", type: "date" },
            ].map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label className="text-xs">{f.label}</Label>
                <Input
                  type={f.type || "text"}
                  placeholder={f.placeholder}
                  value={(form as Record<string, string>)[f.key]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [f.key]: e.target.value }))
                  }
                />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label className="text-xs">Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Location *</Label>
              <Select
                value={form.locationId}
                onValueChange={(v) => setForm((p) => ({ ...p, locationId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {mockLocations.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">active</SelectItem>
                  <SelectItem value="needs_maintenance">
                    Needs Maintenance
                  </SelectItem>
                  <SelectItem value="under_repair">Under Repair</SelectItem>
                  <SelectItem value="decommissioned">Decommissioned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea
                placeholder="Optional notes about this asset..."
                rows={2}
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!form.name || !form.category || !form.locationId}
            >
              Register Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
