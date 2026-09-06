# Insurance Management System Admin Panel

## Purpose

This file is a working context guide for AI assistants and developers extending the admin dashboard. It describes the current frontend baseline, the backend business domains, and the conventions to follow when adding insurance administration features.

## Repository Layout

- `admin-panel/`: React admin dashboard frontend.
- `src/`: Node.js and Express backend. The folder name is historical and is not the frontend `src` directory.
- `src/modules/`: backend feature modules.
- `ui-dashboard/`: uploaded files and generated operational documents.
- `README.md`: backend product and business workflow overview.

When referring to frontend files, use paths relative to `admin-panel/`.

## Frontend Stack

- Vite 6
- React 19
- TypeScript 5.7 with strict checking
- React Router 7
- Tailwind CSS 4
- ApexCharts and `react-apexcharts`
- FullCalendar
- Flatpickr
- React DnD, React Dropzone, Swiper
- `react-helmet-async` for page metadata
- `vite-plugin-svgr` for SVG imports

Useful commands from `admin-panel/`:

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

## Current Frontend Entry Points

- `src/main.tsx`: mounts the app inside `StrictMode`, `ThemeProvider`, and `AppWrapper`.
- `src/App.tsx`: defines the router and route-to-page mapping.
- `src/index.css`: Tailwind configuration, theme tokens, shared utilities, dark-mode styles, and library overrides.
- `src/layout/AppLayout.tsx`: dashboard shell containing the sidebar, header, backdrop, and nested route outlet.
- `src/layout/AppSidebar.tsx`: current navigation arrays and active menu behavior.
- `src/layout/AppHeader.tsx`: search, theme toggle, notifications, user menu, and responsive sidebar controls.
- `src/context/ThemeContext.tsx`: light/dark mode persisted in `localStorage`.
- `src/context/SidebarContext.tsx`: desktop expansion, mobile drawer, hover expansion, and sidebar state.

## Current Routes

Dashboard-layout routes are rendered inside `AppLayout`:

- `/` -> `pages/Dashboard/Home.tsx`
- `/profile`
- `/calendar`
- `/blank`
- `/form-elements`
- `/basic-tables`
- `/alerts`
- `/avatars`
- `/badge`
- `/buttons`
- `/images`
- `/videos`
- `/line-chart`
- `/bar-chart`

Auth routes currently render without the dashboard shell:

- `/signin`
- `/signup`

Unknown paths render `pages/OtherPage/NotFound.tsx`.

The sidebar navigation is hard-coded in `src/layout/AppSidebar.tsx`. Adding a real feature normally requires both a route in `src/App.tsx` and an item in `AppSidebar.tsx`.

Known small issue: the sidebar links to `/error-404`, but there is no dedicated route for it; it falls through to the wildcard not-found route.

## Current Dashboard State

`pages/Dashboard/Home.tsx` is still an ecommerce template dashboard. Its main components use hard-coded demo data:

- `components/ecommerce/EcommerceMetrics.tsx`
- `components/ecommerce/MonthlySalesChart.tsx`
- `components/ecommerce/MonthlyTarget.tsx`
- `components/ecommerce/StatisticsChart.tsx`
- `components/ecommerce/DemographicCard.tsx`
- `components/ecommerce/RecentOrders.tsx`

The ecommerce labels and product rows must be replaced with insurance concepts before treating the page as a production dashboard. Do not preserve demo labels such as Customers, Orders, Products, or Sales unless they are intentionally mapped to a real insurance metric.

## Existing Reusable UI

Prefer these existing patterns before introducing new abstractions:

- `components/common/PageMeta.tsx`: page title and metadata.
- `components/common/PageBreadCrumb.tsx`: page heading and breadcrumb.
- `components/common/ComponentCard.tsx`: bordered titled content section.
- `components/ui/table`: table wrapper, header, row, and cell components.
- `components/ui/badge`: status and metric badges.
- `components/ui/dropdown`: dropdown menus and actions.
- `components/ui/modal`: modal behavior, Escape handling, backdrop close, scroll locking, and fullscreen mode.
- `hooks/useModal.ts`: local modal state.
- `components/form`: existing form controls.
- `components/charts`: chart components and chart-specific patterns.
- `pages/Calendar.tsx`: existing FullCalendar integration and modal workflow.

Typical page composition:

1. Render `PageMeta`.
2. Render `PageBreadCrumb`.
3. Compose tables, cards, forms, charts, and modals with Tailwind classes.
4. Keep feature-specific interaction state local until a shared state requirement is proven.

## Insurance Business Scope

The backend README describes these supported insurance types and workflows:

- Motor insurance.
- Travel insurance: domestic, Hajj/Umrah/Ziarat, international, and student guard.
- Proposal submission, KYC, document validation, review, approval, rejection, and document re-upload requests.
- Payment initialization and manual payment confirmation.
- Policy issuance after an approved and paid proposal.
- Policy number, policy document upload, expiry calculation, and renewal documents.
- Refund cases when a paid proposal is rejected.
- Claims with supporting documents and voice notes; admins can assign surveyors.
- In-app, email, and push notifications through Firebase.
- User support requests with an active-message restriction.
- Admin and user management with role-based access control.

Important domain rules documented by the backend:

- Policies are stored within proposal records rather than a separate policy table.
- A paid proposal must be approved before policy issuance.
- Motor vehicles have an eligibility rule up to model year 2010, with custom vehicle support.
- A motor proposal can use an applied-for-registration flow and cover note.
- During document re-upload, the user can only replace the document requested by an admin.
- After payment, a motor cover note includes personal details, vehicle details, premium information, and policy start date.

## Backend Modules

The backend uses a modular service/controller/routes structure. Current module directories include:

- `src/modules/admin/`
- `src/modules/auth/`
- `src/modules/claim/`
- `src/modules/content/`
- `src/modules/motor/`
- `src/modules/notifications/`
- `src/modules/payment/`
- `src/modules/proposals/`
- `src/modules/support/`
- `src/modules/travel/`
- `src/modules/user/`

Before wiring a frontend feature, inspect the relevant backend routes, controller response shapes, authentication middleware, and role checks. Do not infer endpoint names or payload formats from the directory names alone.

## Current Integration Gaps

The admin frontend currently has no visible production API integration:

- No API client, fetch wrapper, Axios layer, bearer-token handling, or `/api` calls are present in the frontend source.
- Sign-in is currently a UI page and form, not a demonstrated backend login flow.
- There is no protected route, admin session provider, or frontend RBAC guard.
- Dashboard values, header identity, notifications, and table rows are placeholders.
- The header still contains template identity values.
- `SidebarWidget.tsx` contains a TailAdmin purchase-plan promotion that should be removed or replaced.
- Page metadata still contains TailAdmin/ecommerce wording in places.

Treat every hard-coded value as temporary until it is deliberately replaced with typed API data or a documented mock.

## Recommended Dashboard Direction

The first insurance dashboard should prioritize operational work and decision support rather than ecommerce sales. A reasonable initial home screen can include:

- Total active policies, pending proposals, open claims, and outstanding refunds.
- Proposal review queue grouped by submitted, under review, awaiting documents, approved, and rejected.
- Policy expirations and renewals due soon.
- Claims requiring assignment or action.
- Payment and refund status summaries.
- Recent notifications or support cases.
- Filters for date range, insurance type, status, and branch or administrator where supported by the API.

Recommended feature areas and likely routes:

- `/proposals`
- `/policies`
- `/claims`
- `/payments`
- `/refunds`
- `/users`
- `/notifications`
- `/support`
- `/content`
- `/admin-logs`

These are planning names only. Confirm the backend routes and response contracts before implementation.

## Implementation Rules For Future AI Work

- Preserve the existing React, TypeScript, Tailwind, and router choices.
- Reuse the existing layout and UI primitives instead of duplicating table, modal, dropdown, badge, or breadcrumb behavior.
- Keep API response types explicit. Do not use `any` to bypass backend contract uncertainty.
- Keep status values and transitions aligned with backend rules. A visual status change must not imply an allowed business transition.
- Add loading, empty, error, and permission-denied states to data-driven pages.
- Keep destructive actions behind a confirmation modal and show the resulting success or error state.
- Use accessible labels, keyboard-friendly controls, and responsive layouts for tables and forms.
- Avoid putting domain logic in chart components. Transform API data in a page or feature-level data layer.
- Add routes and sidebar navigation together so features are reachable and deep links work.
- Remove template copy, placeholder users, and unrelated promotional UI as each area is converted.
- Run `npm run lint` and `npm run build` after meaningful frontend changes.
- Do not change backend behavior while working on a frontend-only task unless the API contract is demonstrably insufficient.

## Suggested Build Sequence

1. Confirm admin authentication and RBAC API contracts.
2. Add a small typed API client and session/auth state.
3. Protect dashboard routes and handle expired sessions.
4. Replace the ecommerce home page with insurance KPIs and operational queues.
5. Build proposal review first because it is the central workflow.
6. Add policy, claims, refunds, payments, users, support, notifications, and content pages incrementally.
7. Add loading, error, empty, permission, and audit-friendly action states.
8. Replace remaining TailAdmin branding and demo content.

## Working Assumption

This frontend is a starter shell, not a completed admin product. Future changes should make the insurance workflows visible and usable while retaining the existing responsive layout, theme system, and component conventions.
