// ─── User ────────────────────────────────────────────────────────────────────
export type UserRole =
  | "facility_manager"
  | "technician"
  | "vendor"
  | "staff"
  | "finance"
  | "admin";
export type UserStatus = "active" | "inactive" | "pending";

export interface User {
  id: string;
  name: string;
  firstName: string; // Made mandatory
  lastName: string; // Made mandatory
  email: string;
  role: UserRole;
  status?: UserStatus;
  avatar?: string;
  department?: string;
  phone?: string;
  createdAt: Date;
}

// ─── Work Orders ─────────────────────────────────────────────────────────────
export type WorkOrderStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "pending"
  | "completed"
  | "verified"
  | "closed"
  | "cancelled";
export type WorkOrderPriority = "critical" | "high" | "medium" | "low";
export type WorkOrderType =
  | "reactive"
  | "preventive"
  | "emergency"
  | "inspection"
  | "project";

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  type: WorkOrderType;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  category: string;
  locationId: string;
  locationName: string;
  assetId?: string;
  assetName?: string;
  assigneeId?: string;
  assigneeName?: string;
  requesterId: string;
  requesterName: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  estimatedCost?: number;
  actualCost?: number;
  laborCost?: number;
  partsCost?: number;
  timeSpent?: number;
  images?: string[];
  comments?: Comment[];
  partsUsed?: PartUsed[];
  requiresApproval?: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  slaTarget?: number;
  slaBreached?: boolean;
  completionNotes?: string;
  /** Vendor portal: accept/reject assignment */
  vendorOfferStatus?: "pending_acceptance" | "accepted" | "rejected";
  vendorRejectReason?: string;
  proposedSchedule?: Date;
  linkedServiceRequestId?: string;
  approvalNotes?: string;
  rejectionReason?: string;
  paymentStatus?: "pending" | "approved" | "paid";
}

export interface VendorInvoice {
  id: string;
  workOrderId: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  estimatedAmount?: number;
  status: "pending" | "approved" | "rejected" | "paid" | "disputed";
  submittedAt: Date;
  paidAt?: Date;
  invoiceNumber?: string;
  notes?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}
export interface PartUsed {
  partId: string;
  partName: string;
  quantity: number;
  unitCost: number;
}

// ─── Assets ──────────────────────────────────────────────────────────────────
export type AssetStatus =
  | "active"
  | "under_repair"
  | "needs_maintenance"
  | "decommissioned"
  | "down";

export interface Asset {
  id: string;
  name: string;
  category: string;
  model?: string;
  serialNumber?: string;
  manufacturer?: string;
  locationId: string;
  locationName: string;
  status: AssetStatus;
  installDate?: Date;
  warrantyExpiry?: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  purchaseCost?: number;
  currentValue?: number;
  qrCode?: string;
  barcode?: string;
  documents?: AssetDocument[];
  maintenanceHistory?: AssetMaintenanceRecord[];
  linkedPartIds?: string[];
}

export interface AssetDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}
export interface AssetMaintenanceRecord {
  id: string;
  date: Date;
  type: string;
  description: string;
  cost: number;
  technician: string;
}

// ─── Locations ───────────────────────────────────────────────────────────────
export interface Location {
  id: string;
  name: string;
  type: "site" | "building" | "floor" | "room" | "zone";
  parentId?: string;
  address?: string;
  city?: string;
  country?: string;
  coordinates?: { lat: number; lng: number };
  assetCount?: number;
  openWorkOrders?: number;
  managerId?: string;
  managerName?: string;
  floorPlanUrl?: string;
  description?: string;
}

// ─── Vendors ─────────────────────────────────────────────────────────────────
export type VendorStatus = "active" | "inactive" | "blacklisted";
export interface Vendor {
  id: string;
  name: string;
  category: string;
  serviceCategories: string[];
  email: string;
  phone: string;
  address?: string;
  rating: number;
  status: VendorStatus;
  contractStart?: Date;
  contractEnd?: Date;
  contractValue?: number;
  slaResponseTime?: number;
  slaResolutionTime?: number;
  slaDetails?: string;
  totalSpend?: number;
  completedJobs?: number;
  pendingJobs?: number;
  insuranceExpiry?: Date;
  certifications?: VendorCertification[];
  contactPerson?: string;
  bankDetails?: string;
  taxId?: string;
}
export interface VendorCertification {
  id: string;
  name: string;
  issuedBy: string;
  expiryDate: Date;
  documentUrl?: string;
}

// ─── Inventory ───────────────────────────────────────────────────────────────
export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  description?: string;
  quantity: number;
  minStock: number;
  maxStock?: number;
  unitPrice: number;
  unit?: string;
  locationId: string;
  locationName: string;
  lastRestocked?: Date;
  supplier?: string;
  linkedAssetIds?: string[];
  reorderPoint?: number;
  leadTimeDays?: number;
}

export interface PurchaseRequest {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  estimatedCost: number;
  requestedBy: string;
  requestedAt: Date;
  status: "pending" | "approved" | "rejected" | "ordered";
  approvedBy?: string;
  notes?: string;
}

export interface StockReceipt {
  id: string;
  itemId: string;
  quantity: number;
  unitPrice: number;
  receivedBy: string;
  receivedAt: Date;
  supplier: string;
  invoiceNumber?: string;
}

// ─── Preventive Maintenance ───────────────────────────────────────────────────
export type PMFrequency =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "custom";
export type PMStatus = "active" | "paused" | "completed" | "cancelled";

export interface PreventiveMaintenance {
  id: string;
  title: string;
  description: string;
  assetId: string;
  assetName: string;
  locationId: string;
  locationName: string;
  frequency: PMFrequency;
  customDays?: number;
  nextDue: Date;
  lastCompleted?: Date;
  assigneeId?: string;
  assigneeName?: string;
  vendorId?: string;
  vendorName?: string;
  checklist: ChecklistItem[];
  isActive: boolean;
  status?: PMStatus;
  estimatedDuration?: number;
  estimatedCost?: number;
  isComplianceRequired?: boolean;
  regulatoryRef?: string;
  contractId?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
  completedBy?: string;
  completedAt?: Date;
}

// ─── Service Requests ─────────────────────────────────────────────────────────
export type ServiceRequestStatus =
  | "submitted"
  | "reviewed"
  | "approved"
  | "in_progress"
  | "resolved"
  | "rejected"
  | "reopened";

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ServiceRequestStatus;
  priority: WorkOrderPriority;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  locationId: string;
  locationName: string;
  images?: string[];
  createdAt: Date;
  resolvedAt?: Date;
  rating?: number;
  feedback?: string;
  convertedToWorkOrderId?: string;
  assignedTo?: string;
  reviewedBy?: string;
  isGuest?: boolean;
  guestContactInfo?: string;
}

// ─── Notifications ────────────────────────────────────────────────────────────
export type NotificationType =
  | "work_order"
  | "maintenance"
  | "inventory"
  | "approval"
  | "system"
  | "vendor"
  | "contract"
  | "escalation";
export type NotificationChannel = "in_app" | "email" | "sms" | "push";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  priority?: "normal" | "high";
  userId?: string;
}

export interface NotificationPreference {
  userId: string;
  channel: NotificationChannel;
  enabled: boolean;
  types: NotificationType[];
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

export interface EscalationRule {
  id: string;
  name: string;
  triggerHours: number;
  priority: WorkOrderPriority;
  escalateTo: string;
  method: NotificationChannel[];
  isActive: boolean;
  level: number;
}

// ─── Reports ──────────────────────────────────────────────────────────────────
export interface ReportFilter {
  dateFrom?: string;
  dateTo?: string;
  locationId?: string;
  vendorId?: string;
  category?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
}

export interface CostBreakdown {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

// ─── Settings ─────────────────────────────────────────────────────────────────
export interface Organization {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  timezone: string;
  currency: string;
  address?: string;
  phone?: string;
  email?: string;
  slaConfig: SLAConfig;
  multiSiteEnabled: boolean;
}

export interface SLAConfig {
  critical: { responseHours: number; resolutionHours: number };
  high: { responseHours: number; resolutionHours: number };
  medium: { responseHours: number; resolutionHours: number };
  low: { responseHours: number; resolutionHours: number };
  approvalThreshold: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  changes?: Record<string, unknown>;
  timestamp: Date;
  ipAddress?: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface DashboardKPI {
  label: string;
  value: number | string;
  change?: number;
  changeType?: "increase" | "decrease";
  icon?: string;
}
