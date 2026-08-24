# MaintainPro frontend design-system audit

Audited: 2026-08-19

## Existing foundation

- `ThemeProvider` owns `data-theme` on the document element. Tailwind's `dark:` variant is correctly scoped to that attribute.
- `src/styles/globals.css` already provides an OKLCH light/dark theme, chart colours, sidebar colours, a small spacing scale, focus behaviour and responsive portal helpers.
- Shared Radix/Tailwind primitives already exist for buttons, inputs, selects, cards, badges, tables, dialogs, sheets and tabs.
- `MainLayout`, `AppSidebar`, and `AppHeader` form the active authenticated shell. The navigation is responsive through a mobile sheet.
- Feedback components cover page loading, empty, inline error, full-page error, alerts, confirmation and toast feedback.

## Inconsistencies found

1. **Figma-derived pages bypass the foundation.** There are 1,463 raw hex literals in `src`; 24 feature pages contain them. This leaves light-theme `bg-white`, dark text, slate borders, and Figma palette values outside the theme system.
2. **Shell drift.** The sidebar, mobile sheet, and several topbar controls use hard-coded slate/indigo colours rather than the existing sidebar and semantic tokens. The shell can therefore diverge between themes.
3. **Duplicate page framing.** Thirty feature pages render `AppHeader`, then create a second page heading/breadcrumb wrapper with their own padding, text sizes, and action layout. A few pages use bare `main` elements instead.
4. **Cards and KPIs are duplicated.** `Card`, `SectionCard`, local `SectionCard` implementations, local KPI cards, and raw card containers differ in radius, padding, heading typography, borders, and shadows.
5. **Table density is not centralized.** Nineteen feature pages render native tables; only two import the shared `Table` primitive. Header heights, horizontal padding, row density, hover state, and pagination vary per page.
6. **Operational state mapping is fragmented.** Thirteen pages define a local status colour mapping and six define a local priority mapping. The current generic `StatusBadge` covers some synonyms but does not model each backend domain explicitly.
7. **Feedback state styling is partially semantic.** Base empty/loading/error components are sound, but alerts still use direct amber palette utilities and pages often format API errors inline.
8. **Missing shared boundaries.** There is no shared PageHeader, breadcrumbs, search input, pagination, date-range picker, chart card, activity timeline, or explicit drawer abstraction. Several deleted legacy component paths are still visible in the dirty worktree, so replacements must not be assumed without checking each consumer.
9. **Mock-data policy violation predates this pass.** `mockDataStore` is imported by finance, dashboard, service-request, and vendor pages; `WorkOrders.tsx` additionally contains a local `MOCK_WORK_ORDERS` dataset. These must be replaced with existing API/query flows as those pages are migrated; no new mock paths will be introduced.

## API status source of truth

The requested work-order list does not exactly match the current backend contract. The backend currently supports `open`, `assigned`, `in_progress`, `pending_completion`, `completed`, `cancelled`, and `on_hold`; it does not expose work-order `approved` or `rejected`. The UI must use these API values rather than inventing new ones.

- Service request: `pending`, `approved`, `rejected`.
- PM plan: `pending_approval`, `approved`, `rejected`, `cancelled`; PM occurrence: `scheduled`, `generated`, `completed`, `cancelled`.
- Vendor application: `submitted`, `under_review`, `withdrawn`, `rejected`, `awarded`.
- Organization/vendor relationship: `pending`, `active`, `suspended`, `inactive`, `removed`.
- Priority across operational modules: `low`, `medium`, `high`, `critical`.

## Proposed token boundary

The canonical token file remains `frontend/src/styles/globals.css`, with Tailwind aliases declared in its `@theme inline` block.

### Colour roles

- Surfaces: `background`, `surface`, `surface-muted`, `surface-elevated`.
- Text: `text-primary`, `text-secondary`, `text-muted`, `text-disabled`, `text-inverse`.
- Borders: `border`, `border-subtle`, `border-strong`.
- Actions: `primary`, `primary-hover`, `primary-muted`.
- Semantic states: `success`, `success-muted`, `warning`, `warning-muted`, `danger`, `danger-muted`, `info`, `info-muted`.

Each role receives deliberate light and dark values. Existing legacy aliases (`foreground`, `card`, `muted`, `destructive`) remain during migration, preventing unnecessary breakage.

### Sizing and typography roles

- Layout: sidebar 240px desktop / 220px compact, topbar 56px, page gutter 24px desktop / 16px mobile, content max-width 1440px.
- Spacing: 4, 8, 12, 16, 24, 32, 48px.
- Controls: input/button 36px default and 32px compact; icon buttons match their control height; table rows 52px; modal sizes 480/640/800px.
- Type: page title 24/30px semibold, section 16/24px semibold, card heading 15/20px semibold, body 14/20px, metadata 12/16px, label/table header 11/16px semibold uppercase, KPI 30/36px bold, navigation 13/20px medium.

## Incremental migration order

1. Add the semantic, sizing, typography, shadow, and radius tokens while preserving legacy aliases.
2. Align existing primitives and add only missing shared boundaries: `PageHeader`, `SearchInput`, `Pagination`, `ChartCard`, `ActivityTimeline`, and domain-aware state badges.
3. Migrate the approved dashboard first, using its existing Figma-derived visual language as the calibration page.
4. Migrate work orders, service requests, PM, assets, facilities, locations, and inventory.
5. Migrate organization, vendor, finance, reports, settings, and remaining portal pages.
6. Replace mock-store consumers only through the real service/query contracts already present; report any missing endpoint rather than fabricate a UI state.

## Validation gates

- Check both themes for every migrated shared component and representative page.
- Verify keyboard focus, disabled, hover, selected and loading states.
- Confirm API-backed flows remain intact and that no `mockDataStore` import is added.
- Run `tsc --noEmit`, the frontend build, and responsive inspection after each migration slice.
