import { mockVendors } from '@/features/dashboard/services/dashboard.service'

import type { WorkOrder } from '@/types/common.types'
import type {
  AssignmentOptionsResult,
  AssignmentSort,
  IndependentTechnicianOption,
  VendorAssignmentOption,
  VendorManagerProfile,
  VendorTechnicianProfile,
} from '../types/assignment.types'

/** Mock vendor managers — `vendor` role is the default for organization signup on vendor portal */
const VENDOR_MANAGERS: VendorManagerProfile[] = [
  {
    id: 'vm-1',
    name: 'David Okonkwo',
    email: 'david.okonkwo@protechhvac.com',
    phone: '+1 (555) 401-2201',
    vendorId: 'vendor-1',
  },
  {
    id: 'vm-2',
    name: 'Lisa Park',
    email: 'lisa.park@elevatorsolutions.com',
    phone: '+1 (555) 401-2202',
    vendorId: 'vendor-2',
  },
  {
    id: 'vm-3',
    name: 'Marcus Webb',
    email: 'marcus.webb@safeguardsec.com',
    phone: '+1 (555) 401-2203',
    vendorId: 'vendor-3',
  },
  {
    id: 'vm-4',
    name: 'Ana Ruiz',
    email: 'ana.ruiz@cleanpro.com',
    phone: '+1 (555) 401-2204',
    vendorId: 'vendor-4',
  },
]

const VENDOR_TECHNICIANS: VendorTechnicianProfile[] = [
  {
    id: 'vt-1',
    name: 'James Wilson',
    vendorId: 'vendor-1',
    rating: 4.9,
    yearsExperience: 8,
    completedJobs: 312,
    specialties: ['HVAC', 'Refrigeration'],
    distanceKm: 4.2,
    available: true,
  },
  {
    id: 'vt-2',
    name: 'Carlos Mendez',
    vendorId: 'vendor-1',
    rating: 4.7,
    yearsExperience: 5,
    completedJobs: 189,
    specialties: ['HVAC', 'Electrical'],
    distanceKm: 6.8,
    available: true,
  },
  {
    id: 'vt-3',
    name: 'Priya Shah',
    vendorId: 'vendor-2',
    rating: 4.8,
    yearsExperience: 11,
    completedJobs: 420,
    specialties: ['Elevator', 'Mechanical'],
    distanceKm: 8.1,
    available: true,
  },
  {
    id: 'vt-4',
    name: 'Tom Bradley',
    vendorId: 'vendor-2',
    rating: 4.4,
    yearsExperience: 6,
    completedJobs: 156,
    specialties: ['Elevator'],
    distanceKm: 9.5,
    available: false,
  },
  {
    id: 'vt-5',
    name: 'Elena Vasquez',
    vendorId: 'vendor-3',
    rating: 4.9,
    yearsExperience: 7,
    completedJobs: 98,
    specialties: ['Security', 'Access Control'],
    distanceKm: 3.1,
    available: true,
  },
  {
    id: 'vt-6',
    name: 'Ryan Okafor',
    vendorId: 'vendor-4',
    rating: 4.3,
    yearsExperience: 4,
    completedJobs: 540,
    specialties: ['Cleaning', 'General'],
    distanceKm: 11.2,
    available: true,
  },
]

const INDEPENDENT_TECHNICIANS: IndependentTechnicianOption[] = [
  {
    id: 'ind-1',
    name: 'Mike Rodriguez',
    email: 'mike.r@independent.tech',
    rating: 4.85,
    yearsExperience: 12,
    completedJobs: 890,
    specialties: ['HVAC', 'Plumbing', 'General Repairs'],
    distanceKm: 2.4,
    availability: 'available',
  },
  {
    id: 'ind-2',
    name: 'Emma Wilson',
    email: 'emma.w@independent.tech',
    rating: 4.72,
    yearsExperience: 9,
    completedJobs: 645,
    specialties: ['Electrical', 'Fire Safety'],
    distanceKm: 5.6,
    availability: 'available',
  },
  {
    id: 'ind-3',
    name: 'Jordan Lee',
    email: 'jordan.lee@independent.tech',
    rating: 4.91,
    yearsExperience: 15,
    completedJobs: 1204,
    specialties: ['HVAC', 'Building Automation'],
    distanceKm: 7.3,
    availability: 'busy',
  },
  {
    id: 'ind-4',
    name: 'Sofia Martins',
    email: 'sofia.m@independent.tech',
    rating: 4.68,
    yearsExperience: 6,
    completedJobs: 278,
    specialties: ['Plumbing', 'Gas'],
    distanceKm: 4.9,
    availability: 'available',
  },
]

/** Per-location distance tweak so proximity sort feels contextual */
const LOCATION_DISTANCE_OFFSET: Record<string, number> = {
  'loc-1': 0,
  'loc-3': 1.2,
  'loc-4': 2.5,
  'loc-5': 0.8,
}

function categoryMatchesWorkOrder(vendorCategories: string[], woCategory: string): boolean {
  const cat = woCategory.toLowerCase()
  return vendorCategories.some(
    (c) => c.toLowerCase().includes(cat) || cat.includes(c.toLowerCase().split(' ')[0] ?? ''),
  )
}

function adjustDistance(baseKm: number, locationId: string): number {
  const offset = LOCATION_DISTANCE_OFFSET[locationId] ?? 1.5
  return Math.round((baseKm + offset) * 10) / 10
}

function buildVendorOptions(workOrder: WorkOrder): VendorAssignmentOption[] {
  return mockVendors
    .filter((v) => v.status === 'active')
    .map((v) => {
      const techs = VENDOR_TECHNICIANS.filter((t) => t.vendorId === v.id).map((t) => ({
        ...t,
        distanceKm: adjustDistance(t.distanceKm, workOrder.locationId),
      }))
      const minDistance = techs.length ? Math.min(...techs.map((t) => t.distanceKm)) : 99
      const manager = VENDOR_MANAGERS.find((m) => m.vendorId === v.id) ?? {
        id: `vm-${v.id}`,
        name: `${v.name} Manager`,
        email: v.email,
        phone: v.phone,
        vendorId: v.id,
      }

      return {
        vendorId: v.id,
        vendorName: v.name,
        rating: v.rating,
        completedJobs: v.completedJobs ?? 0,
        distanceKm: minDistance,
        serviceCategories: v.serviceCategories,
        categoryMatch: categoryMatchesWorkOrder(v.serviceCategories, workOrder.category),
        manager,
        technicians: techs,
      }
    })
}

function buildIndependentOptions(workOrder: WorkOrder): IndependentTechnicianOption[] {
  return INDEPENDENT_TECHNICIANS.map((t) => ({
    ...t,
    distanceKm: adjustDistance(t.distanceKm, workOrder.locationId),
  }))
}

function sortVendors(vendors: VendorAssignmentOption[], sort: AssignmentSort): VendorAssignmentOption[] {
  const list = [...vendors]
  if (sort === 'proximity') list.sort((a, b) => a.distanceKm - b.distanceKm)
  else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
  else list.sort((a, b) => b.completedJobs - a.completedJobs)
  return list
}

function sortIndependents(
  techs: IndependentTechnicianOption[],
  sort: AssignmentSort,
): IndependentTechnicianOption[] {
  const list = [...techs]
  if (sort === 'proximity') list.sort((a, b) => a.distanceKm - b.distanceKm)
  else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
  else list.sort((a, b) => b.yearsExperience - a.yearsExperience)
  return list
}

export function getAssignmentOptions(
  workOrder: WorkOrder,
  sort: AssignmentSort,
): AssignmentOptionsResult {
  const vendors = sortVendors(buildVendorOptions(workOrder), sort)
  const independents = sortIndependents(buildIndependentOptions(workOrder), sort)
  return { vendors, independents }
}

export function getVendorTechniciansSorted(
  vendor: VendorAssignmentOption,
  sort: AssignmentSort,
): VendorTechnicianProfile[] {
  const list = vendor.technicians.filter((t) => t.available)
  if (sort === 'proximity') list.sort((a, b) => a.distanceKm - b.distanceKm)
  else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
  else list.sort((a, b) => b.yearsExperience - a.yearsExperience)
  return list
}
