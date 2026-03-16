# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js with Turbopack)
npm run build    # Production build
npm run lint     # Run ESLint
```

No test suite is configured.

## Stack

- **Next.js 16** with App Router, React 19, TypeScript
- **Tailwind CSS v4** — configured via `@import "tailwindcss"` in `globals.css`, no `tailwind.config` file
- **shadcn** — component library installed as a package (`shadcn` + `radix-ui`); base styles imported via `@import "shadcn/tailwind.css"`
- **tw-animate-css** — animation utilities
- **class-variance-authority (cva)** — variant-based component styling
- `cn()` helper in `lib/utils.ts` merges `clsx` + `tailwind-merge`

## Architecture

### Styling system
Tailwind v4 uses CSS-first config. All design tokens (colors, radius, fonts) are defined as CSS custom properties in `app/globals.css` under `:root` and `.dark`. These are then aliased into Tailwind's `@theme inline` block so they can be used as Tailwind utilities (e.g. `bg-card`, `text-muted-foreground`). Dark mode uses the `.dark` class strategy via `@custom-variant dark (&:is(.dark *))`.

### UI components
Components live in `components/ui/`. They follow shadcn conventions:
- Accept `className` and spread remaining props onto the underlying element
- Use `data-slot` attributes for parent-context styling (e.g. `group/card` targets child slots)
- `Card` accepts a `size` prop (`"default"` | `"sm"`) that propagates to children via `data-size`
- `Button` supports `asChild` via `Slot.Root` from `radix-ui` for polymorphic rendering

### Error handling
Complete error boundary setup in `app/`:
- `error.tsx` — route-level error boundary (Client Component). Uses Card + Button from `components/ui/`, logs errors via `useEffect`, shows digest ID for server errors, and provides a `reset()` retry button.
- `global-error.tsx` — root layout error boundary (Client Component). Renders its own `<html>`/`<body>` tags since the root layout has failed. Uses only inline Tailwind classes (no external component imports).
- `not-found.tsx` — custom 404 page (Server Component). Uses Button with `asChild` wrapping a Next.js `Link`.
- `loading.tsx` — global loading skeleton (Server Component). Uses `animate-pulse` on `bg-muted` placeholder divs.

### Hooks
All hooks live in `hooks/` (alias `@/hooks`). Every hook file has a `"use client"` directive. Import via barrel (`@/hooks`) or individual files.
- `useMediaQuery(query)` / `useScreenSize()` — uses `useSyncExternalStore` for hydration-safe media query matching. Screen size helper uses breakpoints 640px/1024px.
- `useDebounce<T>(value, delay?)` — generic debounce with `setTimeout`/`clearTimeout`, default 500ms.
- `useLocalStorage<T>(key, initialValue)` — `useState`-like API with `localStorage` persistence, cross-tab sync via `storage` event, SSR-safe with try/catch.
- `useOnClickOutside(ref, handler)` — listens to `mousedown`/`touchstart` on `document`, checks `ref.current.contains()`.
- `useIsMounted()` / `useIsClient()` — hydration-safe boolean via `useSyncExternalStore` (returns `false` on server, `true` on client).
- `useCopyToClipboard()` — wraps `navigator.clipboard.writeText()`, tracks last copied text.

### API Inspector
Dev-only component at `components/dev/api-inspector.tsx`. Monkey-patches `globalThis.fetch` in a `useEffect` to intercept all requests. Shows a floating toggle button (bottom-right) with request count badge, and an expandable panel listing method, URL, status, and duration. Returns `null` in production. Integrated in `app/layout.tsx` behind a `process.env.NODE_ENV === "development"` guard.

### API routes
- `app/api/health/route.ts` — `GET` handler returning `{ status, timestamp, uptime }`. Standard health-check endpoint.

### Path aliases
`@/` maps to the project root (configured in `tsconfig.json`).
