# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js with Turbopack)
npm run build        # Production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check formatting
```

No test suite is configured.

## Stack

- **Next.js 16** with App Router, React 19, TypeScript
- **Tailwind CSS v4** — CSS-first config via `@import "tailwindcss"` in `globals.css`, no `tailwind.config` file
- **shadcn** — CLI in devDependencies, `radix-ui` in dependencies; base styles via `@import "shadcn/tailwind.css"`
- **Zustand** — state management with `persist` middleware
- **next-themes** — theme switching with system preference detection
- **sonner** — toast notifications
- **react-hook-form** + **zod** + **@hookform/resolvers** — form handling and schema validation
- **class-variance-authority (cva)** — variant-based component styling
- **Prettier** with `prettier-plugin-tailwindcss` (printWidth: 100, double quotes, trailing commas)
- `cn()` helper in `lib/utils.ts` merges `clsx` + `tailwind-merge`

## Architecture

### Directory structure
```
app/             # Next.js App Router pages and layouts
components/
  ui/            # shadcn/ui components (Button, Card, Carousel, ThemeToggle)
  layouts/       # Page layout components (PageLayout, AuthLayout)
  providers/     # Context providers (combined Providers wrapper in index.tsx)
config/          # Routes, API endpoints, environment variables
hooks/           # Custom React hooks (barrel export via index.ts)
lib/             # Utilities (cn)
services/        # API service layer (apiClient, authService)
store/           # Zustand stores (auth-store)
types/           # Shared TypeScript types (api, auth, common)
```

### Key conventions
- **Path alias**: `@/` maps to project root. Always use `@/` for cross-directory imports; `./` only for same-directory barrel re-exports.
- **No hardcoded endpoints**: All API paths live in `config/endpoints.ts` as `ENDPOINTS` constants. Dynamic segments use mustache syntax: `"/users/{{id}}"` resolved via `interpolate(ENDPOINTS.USERS.DETAIL, { id })`.
- **No hardcoded routes**: Page paths live in `config/routes.ts` as `ROUTES` constants.
- **Types go in `types/`**: Never inline shared types. Import from `@/types`.

### Styling system
Tailwind v4 CSS-first config. Design tokens (OKLch colors, radius, fonts) defined as CSS custom properties in `app/globals.css` under `:root` and `.dark`, aliased into `@theme inline` for Tailwind utility usage (e.g. `bg-card`, `text-muted-foreground`). Dark mode via `next-themes` with `attribute="class"`, `defaultTheme="system"`, and `suppressHydrationWarning` on `<html>`.

### Providers
Root layout wraps children in `<Providers>` (defined in `components/providers/index.tsx`), which nests:
1. **ThemeProvider** — next-themes
2. **AuthProvider** — validates session on mount via `authService.getProfile()`
3. **ToastProvider** — sonner `<Toaster>`

### API client (`services/api-client.ts`)
Typed `fetch` wrapper with all calls going through `apiClient.get/post/put/patch/delete<T>()`. Features:
- Normalizes all responses to `ApiResponse<T>` (`data`, `error`, `message`, `status`, `ok`)
- Auto-attaches `Authorization: Bearer` from Zustand auth store (skip with `skipAuth: true`)
- On 401: attempts token refresh → retries original request → logs out if refresh fails
- Retry with exponential backoff (default: 2 retries, 1s base delay)
- Auto-triggers `toast.error()` on failures (skip with `skipErrorToast: true`)
- Per-request timeout via AbortController (default: 30s)

### Auth system
- **Store**: `store/auth-store.ts` — Zustand with `persist` middleware. Persists `user`, `tokens`, `isAuthenticated` to localStorage.
- **Service**: `services/auth-service.ts` — login, register, logout, getProfile (all use `ENDPOINTS` constants).
- **Guard**: `components/layouts/auth-layout.tsx` — redirects to `ROUTES.AUTH.LOGIN` if unauthenticated.

### Error handling
- `app/error.tsx` — route-level error boundary with reset button
- `app/global-error.tsx` — root layout error boundary (renders own `<html>`)
- `app/not-found.tsx` — custom 404
- `app/loading.tsx` — global loading skeleton
- Interactive demos at `/demo` for each error type

### Environment variables
Defined in `.env.example`. Access via typed `env` object from `config/env.ts` (throws on missing required vars):
- `NEXT_PUBLIC_APP_URL` — app base URL
- `NEXT_PUBLIC_APP_NAME` — app display name
- `NEXT_PUBLIC_API_BASE_URL` — API base URL (used by `apiClient`)
- `AUTH_SECRET` — server-side auth secret

### Docker
Multi-stage Dockerfile (`node:20-alpine`). Requires `output: "standalone"` in `next.config.ts`.
```bash
docker build -t next-boilerplate .
docker run -p 3000:3000 next-boilerplate
```

### ESLint
Flat config (`eslint.config.mjs`) extending `eslint-config-next/core-web-vitals` + `typescript`. Custom rules: `consistent-type-imports` (prefer `type` keyword), `no-console` (allow warn/error only), `no-unused-vars` (ignore `_` prefix).
