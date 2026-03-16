# Next.js Boilerplate

A Next.js starter template by Sahil Saini, pre-configured with Tailwind CSS v4, shadcn/ui components, Radix UI, and TypeScript.

## Tech Stack

- **[Next.js 16](https://nextjs.org)** — React framework with App Router
- **[React 19](https://react.dev)** — UI library
- **[TypeScript](https://www.typescriptlang.org)** — Type safety
- **[Tailwind CSS v4](https://tailwindcss.com)** — Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com)** — Accessible component primitives built on Radix UI
- **[Lucide React](https://lucide.dev)** — Icon library

## Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

## Getting Started

1. **Clone or use this repo as a template**, then install dependencies:

```bash
npm install
```

2. **Start the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  layout.tsx             # Root layout (fonts, global styles, dev tools)
  page.tsx               # Home page — start editing here
  loading.tsx            # Global loading skeleton (Suspense fallback)
  error.tsx              # Route-level error boundary
  global-error.tsx       # Root layout error boundary
  not-found.tsx          # Custom 404 page
  api/
    health/
      route.ts           # GET /api/health — health-check endpoint
  demo/                  # Interactive error-handling demos → /demo
    page.tsx             # Demo hub with links to all cases
    error/page.tsx       # Triggers error.tsx (render-time throw)
    not-found/page.tsx   # Triggers not-found.tsx (calls notFound())
    loading/             # Triggers loading.tsx (3-second async page)
      loading.tsx
      page.tsx
    global-error/page.tsx  # Explains global-error.tsx + how to reproduce
components/
  ui/                 # shadcn/ui components (button, card, carousel)
  dev/
    api-inspector.tsx # Dev-only API request inspector panel
hooks/                # Reusable React hooks
  index.ts            # Barrel re-exports for all hooks
  use-media-query.ts  # CSS media query listener + useScreenSize()
  use-debounce.ts     # Debounce any value
  use-local-storage.ts# Persist state to localStorage with cross-tab sync
  use-on-click-outside.ts # Detect clicks outside a ref element
  use-is-mounted.ts   # SSR safety guard
  use-is-client.ts    # Hydration-safe client-side check
  use-copy-to-clipboard.ts # Clipboard API wrapper
lib/
  utils.ts            # cn() class-merge helper
public/               # Static assets
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at localhost:3000 |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

## Adding shadcn/ui Components

This boilerplate includes shadcn/ui. Add new components with:

```bash
npx shadcn@latest add <component-name>
# e.g.
npx shadcn@latest add button
npx shadcn@latest add dialog
```

## Error Handling

The boilerplate includes a complete error handling setup out of the box:

| File | Purpose |
|------|---------|
| `app/error.tsx` | Catches runtime errors in any route segment. Displays a styled error card with the error message, an error digest ID (for server-side errors), and a "Try again" button that re-renders the segment. This is a Client Component as required by Next.js. |
| `app/global-error.tsx` | Catches errors that occur in the root layout itself. Since the root layout has failed, this component renders its own `<html>` and `<body>` tags with minimal inline styling (no external component dependencies). |
| `app/not-found.tsx` | Custom 404 page shown when navigating to a non-existent route or when `notFound()` is called. Displays a centered "404 - Page Not Found" message with a button linking back to the home page. |
| `app/loading.tsx` | Automatic loading UI displayed while a route segment is loading. Uses Tailwind's `animate-pulse` on placeholder shapes to create a skeleton screen effect. |

### Interactive demos

Navigate to **`/demo`** to trigger each case live:

| Route | What it demonstrates |
|---|---|
| `/demo/error` | Clicks a button → sets state → component throws during render → `error.tsx` catches it and shows a retry button |
| `/demo/not-found` | Server Component calls `notFound()` → `not-found.tsx` renders |
| `/demo/loading` | Async Server Component with a 3-second delay → `loading.tsx` skeleton shown instantly via Suspense |
| `/demo/global-error` | Informational — explains why `global-error.tsx` can't be triggered via navigation and how to reproduce it manually |

## Hooks

All hooks live in `hooks/` and are importable via `@/hooks`. Each is a Client Component (`"use client"` directive) with full TypeScript generics where applicable.

| Hook | Signature | Description |
|------|-----------|-------------|
| `useMediaQuery` | `useMediaQuery(query: string): boolean` | Subscribes to a CSS media query using `useSyncExternalStore`. Returns `false` during SSR, then the live match result on the client. |
| `useScreenSize` | `useScreenSize(): { isMobile, isTablet, isDesktop }` | Convenience wrapper around `useMediaQuery` with breakpoints at 640px and 1024px. |
| `useDebounce` | `useDebounce<T>(value: T, delay?: number): T` | Returns a debounced copy of `value` that only updates after `delay` ms of inactivity (default 500ms). |
| `useLocalStorage` | `useLocalStorage<T>(key: string, initialValue: T): [T, setter]` | Works like `useState` but persists to `localStorage`. Handles SSR, JSON parse errors, quota limits, and syncs across browser tabs via the `storage` event. |
| `useOnClickOutside` | `useOnClickOutside(ref, handler)` | Calls `handler` when a `mousedown` or `touchstart` event occurs outside the element referenced by `ref`. Useful for closing dropdowns, modals, and popovers. |
| `useIsMounted` | `useIsMounted(): boolean` | Returns `false` on the server and `true` on the client. Implemented with `useSyncExternalStore` to avoid hydration mismatches. |
| `useIsClient` | `useIsClient(): boolean` | Same semantics as `useIsMounted` — returns `true` only on the client. Use whichever name reads better in your context. |
| `useCopyToClipboard` | `useCopyToClipboard(): { copiedText, copy }` | Copies text to the clipboard via `navigator.clipboard.writeText()`. Returns the last copied string and a `copy(text)` async function that resolves to `true`/`false`. |

Import hooks individually or via the barrel:

```tsx
import { useMediaQuery, useDebounce } from "@/hooks";
```

## API Inspector (Dev Tool)

A development-only floating panel that intercepts all `fetch()` calls and displays them in real time.

**How it works:**
- On mount, monkey-patches `globalThis.fetch` to wrap every request with timing and status tracking. The original `fetch` is restored on unmount.
- A toggle button sits fixed in the bottom-right corner showing the total request count. Click to open the inspector panel.
- Each request shows: HTTP method (color-coded badge), URL, status code (green/yellow/red), and duration in ms.
- Click any request to expand it and see full URL, status text, duration, timestamp, and error details.
- A "Clear" button resets the log.
- **Production safe:** The component returns `null` and skips fetch patching entirely when `NODE_ENV !== "development"`. It is also conditionally rendered in `layout.tsx`.

## Health Check API

`GET /api/health` returns:

```json
{
  "status": "ok",
  "timestamp": "2026-03-16T12:00:00.000Z",
  "uptime": 123.456
}
```

Use this for monitoring, load balancer health checks, or as a quick test target for the API Inspector.

## Customization

- **Global styles** — edit `app/globals.css`
- **Tailwind config** — edit `tailwind.config.ts` (or the CSS-based config in v4)
- **Fonts** — swap out fonts in `app/layout.tsx`
- **Home page** — edit `app/page.tsx`

## Deployment

The easiest way to deploy is [Vercel](https://vercel.com/new):

1. Push your code to GitHub
2. Import the repo on Vercel
3. Deploy — zero config required

See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for other platforms.
