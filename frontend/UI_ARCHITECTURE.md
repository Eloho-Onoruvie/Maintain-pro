# MaintainPro UI Architecture

This document establishes the implemented MaintainPro frontend as the product design system. New screens should be composed from these patterns before introducing new visual or interaction abstractions.

## Production folder structure

The frontend repository is the `MaintainPro` repository. The application source currently lives under `frontend/src/` in this workspace and is organized by ownership:

```text
src/
├── main.tsx, AppLayout.tsx       Application entry and shell composition
├── app/                          Providers, router, navigation, portal state
├── api/                          Shared HTTP client and cross-feature contracts
├── components/                   Reusable brand, layout, feedback, navigation, and UI primitives
├── config/                       Runtime configuration only
├── features/<domain>/             Domain-owned pages, components, hooks, api, services, types
├── hooks/                        Cross-domain React hooks
├── lib/                          Framework-neutral helpers and error/query infrastructure
├── realtime/                     Socket connection and realtime provider
├── services/                     Transitional shared adapters; new domain services belong in features
├── styles/                       Global and design-token styles
├── types/                        Cross-domain types only
└── utils/                        Small cross-domain pure utilities
```

### Ownership rules

- A feature owns its API adapters, contracts, hooks, services, pages, and domain types whenever those pieces are not shared.
- `api/` owns only transport primitives and contracts shared across multiple domains.
- `components/` contains reusable presentation and interaction primitives; business rules remain in features.
- `services/` is a compatibility boundary for older shared adapters. New domain services belong in their owning feature.
- `types/` is for genuinely cross-domain types. Feature-only types belong in that feature's `types/` directory.
- `app/` owns bootstrapping and routing, while pages remain in feature folders.

### Normalization decisions

- Reports now follow the standard feature shape with `reports/api/` and `reports/hooks/`.
- Inventory uses the canonical `inventory/services/inventory.service.ts`; duplicate root-level service code was removed.
- Existing shared adapters under `services/` remain temporarily for compatibility and should migrate feature-by-feature.

## Reference implementations

| Concern | Reference |
| --- | --- |
| Organization dashboard | `src/features/dashboard/views/AdminDashboard.tsx` |
| Facility dashboard | `src/features/dashboard/views/FacilityManagerDashboard.tsx` |
| Technician dashboard | `src/features/dashboard/views/TechnicianDashboard.tsx` |
| Vendor dashboard | `src/features/dashboard/views/VendorDashboard.tsx` |
| Work-order list/detail | `src/features/work-orders/pages/WorkOrders.tsx`, `WorkOrderDetails.tsx` |
| Forms | `src/features/work-orders/components/WorkOrderForm.tsx`, settings forms |
| Settings | `src/features/settings/pages/Settings.tsx`, `UserProfile.tsx` |
| Tables and pagination | work-order, asset, inventory, and vendor pages |
| Confirmation/destructive actions | `src/components/feedback/ConfirmDialog.tsx` |
| Public/authentication | `src/features/public`, `src/features/auth` |
| Reports and charts | `src/features/reports`, `src/features/dashboard/components/DashboardWidgets.tsx` |

The newest implementation is not automatically authoritative. Prefer the reference with the clearest states, accessibility, responsive behavior, and backend integration.

## UI constitution

### Typography and spacing

- Preserve the existing font family and Tailwind typography utilities.
- Use the existing page-title, section-title, label, body, metadata, and helper-text patterns instead of introducing a second type scale.
- Use the established `p-*`, `gap-*`, and `space-y-*` rhythm. Avoid arbitrary pixel values when an existing utility expresses the same intent.
- Page headers, cards, tables, dialogs, and drawers should use the spacing already present in their nearest reference implementation.

### Containers and surfaces

- Use the existing page shell and content gutters from `AppHeader`, `MainLayout`, and portal layouts.
- Cards use the existing `border`, surface/background tokens, radius, and restrained shadow hierarchy.
- Dividers use theme border tokens; do not introduce one-off gray values.
- Buttons, inputs, badges, dialogs, and cards should retain the existing radius hierarchy.

### Theme

Every new component must work in light and dark mode. Prefer semantic tokens (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, status tokens, and chart tokens) over literal colors. Verify hover, focus, selected, disabled, success, warning, danger, and informational states in both themes.

### Responsive behavior

- Desktop: 1440–1024px uses the full portal shell and multi-column grids.
- Tablet: 1024–768px reduces columns, keeps actions usable, and allows horizontal table treatment where necessary.
- Mobile: 768–360px stacks content, converts dense tables into cards/lists, moves navigation into the existing mobile drawer, and makes modal actions full-width or sheet-like where appropriate.
- Responsive behavior must preserve task completion, not only prevent overflow.

## Page archetypes

### Dashboard

Page header → contextual actions → role-specific KPIs → primary operational content → supporting analytics → alerts/activity.

Do not copy metrics between roles when they do not represent that role's responsibilities.

### List/table

Page header → context → primary action → search/filter/sort → populated table/list → pagination.

Every backend-backed list needs loading, empty, error, unauthorized, and populated states. On mobile, use a card/list representation rather than forcing a dense desktop table.

### Detail

Breadcrumb/back → entity header/status/actions → overview → entity-specific information → related records → activity/history → attachments/comments where applicable.

Tabs are appropriate only when the content is substantial and independently navigable.

### Create/edit and review

Use a modal for a small operation, a drawer for contextual inspection or secondary editing, and a page for complex workflows. Approval actions must show the current state, available next state, consequences, and confirmation requirements.

### Settings

Keep user-scoped, organization-scoped, and vendor-scoped settings separate. Reuse the existing settings navigation and save/error/toast patterns.

## Reuse policy

Before creating a component, search the frontend for an equivalent. Extend shared primitives where possible. Avoid domain-specific duplicates such as separate table, badge, pagination, dialog, loading, and empty-state implementations when one configurable abstraction is sufficient.

Existing shared primitives include:

- `src/components/ui/*`
- `src/components/feedback/*`
- `src/components/navigation/*`
- `src/components/layout/*`
- feature-level chart, table, and form components where behavior is domain-specific

## Data and workflow rules

- A screen must use the actual backend contract, domain states, permissions, and API service.
- Do not add fake operational records, fake metrics, or localStorage as a second database.
- Loading uses the existing skeleton/loading patterns; empty states explain what is missing and provide a next action; errors show a safe constructed message; success uses the existing toast/notification system.
- Unauthorized and not-found cases use the existing route and feedback patterns.
- If a required backend contract is missing, document the dependency instead of fabricating state.

## Modal and drawer policy

Prefer the existing modal/drawer patterns for create, edit, delete confirmation, assignment, status changes, and quick inspection. Use a page only for complex workflows, dashboards, reports, and substantial entity details. Destructive actions must use `ConfirmDialog` and clearly state what will be removed.

## Implementation checklist

Before each new screen, confirm:

1. Closest reference page and archetype.
2. Reusable components and tokens.
3. Backend contract and permissions.
4. Domain states and transitions.
5. Page versus modal versus drawer decision.
6. Loading, empty, error, unauthorized, not-found, and success behavior.
7. Mobile and tablet transformation.
8. Light/dark contrast and interactive states.
9. Ownership of the behavior in an existing component or feature.

At handoff, report the reference pattern, reused/new components, backend contract, responsive behavior, theme behavior, and remaining dependencies.

## Known follow-up work

- Continue migrating older pages with literal colors or bespoke spacing to semantic tokens when they are touched.
- Replace remaining report/dashboard fixture data with report API responses as each backend report contract is connected.
- Consolidate repeated table/card layouts only when their state and interaction requirements are genuinely shared.
