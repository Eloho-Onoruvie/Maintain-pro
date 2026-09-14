import type { PaginatedResponse } from "@/types/api.types";
import type {
  CreateServiceRequestInput,
  ServiceRequestRecord,
} from "./serviceRequests.service";

const daysAgoIso = (days: number, hour: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

const initialSeed: ServiceRequestRecord[] = [
  {
    id: "SR-DEMO-001",
    organizationId: "demo-org",
    facilityId: "facility-1",
    facilityName: "HQ Office Tower",
    locationId: "location-1",
    locationName: "Floor 3",
    assetId: "asset-1",
    requestedBy: "demo-user",
    requesterName: "Demo User",
    title: "Conference Room thermostat unresponsive",
    description: "The thermostat is not responding to temperature changes.",
    priority: "high",
    serviceCategory: "HVAC",
    status: "pending",
    createdAt: daysAgoIso(25, 9),
    updatedAt: daysAgoIso(25, 9),
  },
  {
    id: "SR-DEMO-002",
    organizationId: "demo-org",
    facilityId: "facility-1",
    facilityName: "HQ Office Tower",
    locationId: "location-2",
    locationName: "Cafeteria",
    assetId: "asset-2",
    requestedBy: "demo-user",
    requesterName: "Demo User",
    title: "Water leak in cafeteria",
    description: "Water is pooling beneath the sink.",
    priority: "critical",
    serviceCategory: "Plumbing",
    status: "approved",
    workOrderId: "WO-DEMO-006",
    createdAt: daysAgoIso(27, 11),
    updatedAt: daysAgoIso(27, 12),
  },
  {
    id: "SR-DEMO-003",
    organizationId: "demo-org",
    facilityId: "facility-2",
    facilityName: "West Annex",
    locationId: "location-3",
    locationName: "Lobby",
    assetId: "asset-3",
    requestedBy: "demo-user",
    requesterName: "Demo User",
    title: "Automatic door sensor failure",
    description: "The main lobby door does not detect movement reliably.",
    priority: "medium",
    serviceCategory: "Electrical",
    status: "rejected",
    rejectionReason: "Duplicate request already in progress.",
    createdAt: daysAgoIso(30, 8),
    updatedAt: daysAgoIso(30, 10),
  },
];

let records: ServiceRequestRecord[] = [...initialSeed];

export const demoServiceRequestsService = {
  reloadMockData: () => {
    records = [...initialSeed];
  },
  list: async (
    filters: {
      page?: number;
      limit?: number;
      status?: ServiceRequestRecord["status"];
    } = {},
  ): Promise<PaginatedResponse<ServiceRequestRecord>> => {
    const filtered = records.filter(
      (item) => !filters.status || item.status === filters.status,
    );
    const page = filters.page ?? 1;
    const pageSize = filters.limit ?? 20;
    return {
      data: filtered.slice((page - 1) * pageSize, page * pageSize),
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    };
  },
  getById: async (id: string) => {
    const item = records.find((record) => record.id === id);
    if (!item) throw new Error("Service request not found");
    return item;
  },
  update: async (
    id: string,
    input: Partial<
      Pick<
        ServiceRequestRecord,
        "title" | "description" | "priority" | "serviceCategory"
      >
    >,
  ) => {
    const item = await demoServiceRequestsService.getById(id);
    Object.assign(item, input, { updatedAt: new Date().toISOString() });
    return item;
  },
  create: async (input: CreateServiceRequestInput) => {
    const now = new Date().toISOString();
    const item: ServiceRequestRecord = {
      ...input,
      id: `SR-DEMO-${String(records.length + 1).padStart(3, "0")}`,
      requestedBy: "demo-user",
      requesterName: "Demo User",
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
    records = [item, ...records];
    return item;
  },
  approve: async (id: string) => {
    const item = await demoServiceRequestsService.getById(id);
    item.status = "approved";
    item.approvalDecision = "approved";
    item.workOrderId = `WO-DEMO-${String(Date.now()).slice(-4)}`;
    item.updatedAt = new Date().toISOString();
    return { serviceRequest: item, workOrder: { _id: item.workOrderId } };
  },
  reject: async (id: string, rejectionReason: string) => {
    const item = await demoServiceRequestsService.getById(id);
    item.status = "rejected";
    item.approvalDecision = "rejected";
    item.rejectionReason = rejectionReason;
    item.updatedAt = new Date().toISOString();
    return item;
  },
};
