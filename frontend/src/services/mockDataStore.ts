import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type {
  Asset,
  EscalationRule,
  InventoryItem,
  Location,
  PreventiveMaintenance,
  ServiceRequest,
  VendorInvoice,
  VendorOpportunity,
  VendorBid,
  WorkOrder,
} from '@/types/common.types'
import {
  mockAssets as seedAssets,
  mockInventory as seedInventory,
  mockLocations as seedLocations,
  mockPMs as seedPMs,
  mockServiceRequests as seedServiceRequests,
  mockWorkOrders as seedWorkOrders,
  SEED_VENDOR_OPPORTUNITIES as seedVendorOpportunities,
} from '@/features/dashboard/services/dashboard.service'
import {
  enrichWorkOrdersForStories,
  SEED_ESCALATION_RULES,
  SEED_VENDOR_INVOICES,
} from '@/services/mockDataSeeds'

function daysAgo(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(12, 0, 0, 0)
  return d
}

function daysFromNow(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(17, 0, 0, 0)
  return d
}

function normalizeWorkOrderDates(workOrders: WorkOrder[]): WorkOrder[] {
  const createdOffsets = [0, 2, 5, 10, 18, 28, 45, 75]
  return enrichWorkOrdersForStories(
    workOrders.map((wo, index) => {
      const createdDaysAgo = createdOffsets[index % createdOffsets.length]
      const createdAt = daysAgo(createdDaysAgo)
      const updatedAt = daysAgo(Math.max(0, createdDaysAgo - 1))
      return {
        ...wo,
        createdAt,
        updatedAt,
        dueDate: wo.dueDate ? daysFromNow(Math.max(1, 7 - (index % 7))) : wo.dueDate,
      }
    }),
  )
}

function createInitialState() {
  return {
    workOrders: normalizeWorkOrderDates(structuredClone(seedWorkOrders)),
    assets: structuredClone(seedAssets),
    locations: structuredClone(seedLocations),
    inventory: structuredClone(seedInventory),
    pms: structuredClone(seedPMs),
    serviceRequests: structuredClone(seedServiceRequests).map((sr) => ({
      ...sr,
      createdAt: new Date(sr.createdAt),
      resolvedAt: sr.resolvedAt ? new Date(sr.resolvedAt) : undefined,
    })),
    vendorInvoices: structuredClone(SEED_VENDOR_INVOICES),
    escalationRules: structuredClone(SEED_ESCALATION_RULES),
    vendorTeamMembers: structuredClone(SEED_VENDOR_TEAM_MEMBERS),
    vendorOpportunities: structuredClone(seedVendorOpportunities).map((opp) => ({
      ...opp,
      publishedAt: new Date(opp.publishedAt),
      deadline: opp.deadline ? new Date(opp.deadline) : undefined,
      bids: opp.bids.map((b) => ({ ...b, submittedAt: new Date(b.submittedAt) })),
    })) as VendorOpportunity[],
  }
}

export interface VendorTeamMember {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'invited'
  isTeamLead?: boolean
}

const SEED_VENDOR_TEAM_MEMBERS: VendorTeamMember[] = [
  { id: 'tm-2', name: 'James Wilson', email: 'james@vendor.com', role: 'HVAC Technician', status: 'active' },
  { id: 'tm-3', name: 'Priya Kapoor', email: 'priya@vendor.com', role: 'Electrician', status: 'invited' },
]

interface MockDataState {
  workOrders: WorkOrder[]
  assets: Asset[]
  locations: Location[]
  inventory: InventoryItem[]
  pms: PreventiveMaintenance[]
  serviceRequests: ServiceRequest[]
  vendorInvoices: VendorInvoice[]
  escalationRules: EscalationRule[]
  vendorTeamMembers: VendorTeamMember[]
  vendorOpportunities: VendorOpportunity[]

  addWorkOrder: (workOrder: WorkOrder) => void
  updateWorkOrder: (id: string, patch: Partial<WorkOrder>) => void
  removeWorkOrder: (id: string) => void

  updateAsset: (id: string, patch: Partial<Asset>) => void
  addAsset: (asset: Asset) => void

  updateLocation: (id: string, patch: Partial<Location>) => void
  addLocation: (location: Location) => void

  updateInventoryItem: (id: string, patch: Partial<InventoryItem>) => void

  updatePm: (id: string, patch: Partial<PreventiveMaintenance>) => void
  addPm: (pm: PreventiveMaintenance) => void

  addServiceRequest: (request: ServiceRequest) => void
  updateServiceRequest: (id: string, patch: Partial<ServiceRequest>) => void

  addVendorInvoice: (invoice: VendorInvoice) => void
  updateVendorInvoice: (id: string, patch: Partial<VendorInvoice>) => void

  setEscalationRules: (rules: EscalationRule[]) => void
  addEscalationRule: (rule: EscalationRule) => void

  addVendorTeamMember: (member: VendorTeamMember) => void
  removeVendorTeamMember: (id: string) => void

  addVendorOpportunity: (opp: VendorOpportunity) => void
  updateVendorOpportunity: (id: string, patch: Partial<VendorOpportunity>) => void
  addBidToOpportunity: (opportunityId: string, bid: VendorBid) => void
  updateBid: (opportunityId: string, bidId: string, patch: Partial<VendorBid>) => void

  resetToSeeds: () => void
}

export const useMockDataStore = create<MockDataState>()(
  persist(
    (set) => ({
      ...createInitialState(),

      addWorkOrder: (workOrder) =>
        set((state) => ({ workOrders: [workOrder, ...state.workOrders] })),

      updateWorkOrder: (id, patch) =>
        set((state) => ({
          workOrders: state.workOrders.map((wo) =>
            wo.id === id ? { ...wo, ...patch, updatedAt: new Date() } : wo,
          ),
        })),

      removeWorkOrder: (id) =>
        set((state) => ({
          workOrders: state.workOrders.filter((wo) => wo.id !== id),
        })),

      updateAsset: (id, patch) =>
        set((state) => ({
          assets: state.assets.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),

      addAsset: (asset) => set((state) => ({ assets: [asset, ...state.assets] })),

      updateLocation: (id, patch) =>
        set((state) => ({
          locations: state.locations.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        })),

      addLocation: (location) =>
        set((state) => ({ locations: [...state.locations, location] })),

      updateInventoryItem: (id, patch) =>
        set((state) => ({
          inventory: state.inventory.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        })),

      updatePm: (id, patch) =>
        set((state) => ({
          pms: state.pms.map((pm) => (pm.id === id ? { ...pm, ...patch } : pm)),
        })),

      addPm: (pm) => set((state) => ({ pms: [pm, ...state.pms] })),

      addServiceRequest: (request) =>
        set((state) => ({ serviceRequests: [request, ...state.serviceRequests] })),

      updateServiceRequest: (id, patch) =>
        set((state) => ({
          serviceRequests: state.serviceRequests.map((sr) =>
            sr.id === id ? { ...sr, ...patch } : sr,
          ),
        })),

      addVendorInvoice: (invoice) =>
        set((state) => ({ vendorInvoices: [invoice, ...state.vendorInvoices] })),

      updateVendorInvoice: (id, patch) =>
        set((state) => ({
          vendorInvoices: state.vendorInvoices.map((inv) =>
            inv.id === id ? { ...inv, ...patch } : inv,
          ),
        })),

      setEscalationRules: (rules) => set({ escalationRules: rules }),

      addEscalationRule: (rule) =>
        set((state) => ({ escalationRules: [...state.escalationRules, rule] })),

      addVendorTeamMember: (member) =>
        set((state) => ({ vendorTeamMembers: [...state.vendorTeamMembers, member] })),

      removeVendorTeamMember: (id) =>
        set((state) => ({ vendorTeamMembers: state.vendorTeamMembers.filter((m) => m.id !== id) })),

      addVendorOpportunity: (opp) =>
        set((state) => ({ vendorOpportunities: [opp, ...state.vendorOpportunities] })),

      updateVendorOpportunity: (id, patch) =>
        set((state) => ({
          vendorOpportunities: state.vendorOpportunities.map((o) =>
            o.id === id ? { ...o, ...patch } : o
          ),
        })),

      addBidToOpportunity: (opportunityId, bid) =>
        set((state) => ({
          vendorOpportunities: state.vendorOpportunities.map((o) =>
            o.id === opportunityId ? { ...o, bids: [...o.bids, bid] } : o
          ),
        })),

      updateBid: (opportunityId, bidId, patch) =>
        set((state) => ({
          vendorOpportunities: state.vendorOpportunities.map((o) =>
            o.id === opportunityId
              ? { ...o, bids: o.bids.map((b) => b.id === bidId ? { ...b, ...patch } : b) }
              : o
          ),
        })),

      resetToSeeds: () => set(createInitialState()),
    }),
    {
      name: 'maintainpro_mock_data_v4',
      partialize: (state) => ({
        workOrders: state.workOrders,
        assets: state.assets,
        locations: state.locations,
        inventory: state.inventory,
        pms: state.pms,
        serviceRequests: state.serviceRequests,
        vendorInvoices: state.vendorInvoices,
        escalationRules: state.escalationRules,
        vendorTeamMembers: state.vendorTeamMembers,
        vendorOpportunities: state.vendorOpportunities,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<MockDataState> | undefined
        if (!p?.workOrders?.length) return current
        return {
          ...current,
          ...p,
          workOrders: p.workOrders!.map((wo) => ({
            ...wo,
            createdAt: new Date(wo.createdAt),
            updatedAt: new Date(wo.updatedAt),
            dueDate: wo.dueDate ? new Date(wo.dueDate) : undefined,
            approvedAt: wo.approvedAt ? new Date(wo.approvedAt) : undefined,
            proposedSchedule: wo.proposedSchedule
              ? new Date(wo.proposedSchedule)
              : undefined,
          })),
          assets: p.assets ?? current.assets,
          locations: p.locations ?? current.locations,
          inventory: p.inventory ?? current.inventory,
          pms: (p.pms ?? current.pms).map((pm) => ({
            ...pm,
            nextDue: new Date(pm.nextDue),
            lastCompleted: pm.lastCompleted ? new Date(pm.lastCompleted) : undefined,
          })),
          serviceRequests: (p.serviceRequests ?? current.serviceRequests).map((sr) => ({
            ...sr,
            createdAt: new Date(sr.createdAt),
            resolvedAt: sr.resolvedAt ? new Date(sr.resolvedAt) : undefined,
          })),
          vendorInvoices: (p.vendorInvoices ?? current.vendorInvoices).map((inv) => ({
            ...inv,
            submittedAt: new Date(inv.submittedAt),
            paidAt: inv.paidAt ? new Date(inv.paidAt) : undefined,
          })),
          escalationRules: p.escalationRules ?? current.escalationRules,
          vendorTeamMembers: p.vendorTeamMembers ?? current.vendorTeamMembers,
          vendorOpportunities: (p.vendorOpportunities ?? current.vendorOpportunities).map((opp: VendorOpportunity) => ({
            ...opp,
            publishedAt: new Date(opp.publishedAt),
            deadline: opp.deadline ? new Date(opp.deadline) : undefined,
            bids: opp.bids.map((b: VendorBid) => ({ ...b, submittedAt: new Date(b.submittedAt) })),
          })),
        }
      },
    },
  ),
)

export function getWorkOrders(): WorkOrder[] {
  return useMockDataStore.getState().workOrders
}

export function getAssets(): Asset[] {
  return useMockDataStore.getState().assets
}

export function getLocations(): Location[] {
  return useMockDataStore.getState().locations
}

export function getInventory(): InventoryItem[] {
  return useMockDataStore.getState().inventory
}

export function getPMs(): PreventiveMaintenance[] {
  return useMockDataStore.getState().pms
}

export function getServiceRequests(): ServiceRequest[] {
  return useMockDataStore.getState().serviceRequests
}

export function getVendorInvoices(): VendorInvoice[] {
  return useMockDataStore.getState().vendorInvoices
}

export function getEscalationRules(): EscalationRule[] {
  return useMockDataStore.getState().escalationRules
}
