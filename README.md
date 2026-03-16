# Next.js Boilerplate

A production-ready Next.js starter template by Sahil Saini, pre-configured with Tailwind CSS v4, shadcn/ui, Zustand, typed API client, auth system, and Docker support.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) + [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) (CSS-first config) + [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) |
| State | [Zustand](https://zustand.docs.pmnd.rs) with persist middleware |
| Forms | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) validation |
| Theme | [next-themes](https://github.com/pacocoursey/next-themes) (system preference + toggle) |
| Toasts | [Sonner](https://sonner.emilkowal.dev) |
| Icons | [Lucide React](https://lucide.dev) |
| Linting | ESLint (flat config) + Prettier with Tailwind plugin |
| Deploy | Docker (multi-stage) or Vercel |

## Prerequisites

- Node.js 20+
- npm

## Getting Started

```bash
# 1. Clone and install
npm install

# 2. Set up environment
cp .env.example .env.local

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  layout.tsx               # Root layout (fonts, Providers, SEO metadata)
  page.tsx                 # Home page
  globals.css              # Tailwind v4 design tokens (:root, .dark, @theme)
  error.tsx                # Route-level error boundary
  global-error.tsx         # Root layout error boundary
  not-found.tsx            # Custom 404 page
  loading.tsx              # Global loading skeleton
  demo/                    # Interactive error-handling demos → /demo
components/
  ui/                      # shadcn/ui components (Button, Card, Carousel, ThemeToggle)
  layouts/                 # Page layouts (PageLayout, AuthLayout)
  providers/               # Combined Providers wrapper (Theme, Auth, Toast)
config/
  routes.ts                # Centralized page route constants (ROUTES)
  endpoints.ts             # API endpoint constants (ENDPOINTS) + interpolate() helper
  env.ts                   # Typed environment variable access
hooks/                     # Custom React hooks with barrel export
lib/
  utils.ts                 # cn() class-merge helper
services/
  api-client.ts            # Typed fetch wrapper (retry, auth, error toasts)
  auth-service.ts          # Auth methods (login, register, logout, getProfile)
store/
  auth-store.ts            # Zustand auth store (user, tokens, persist)
types/
  api.ts                   # ApiResponse<T>, ApiError, PaginatedResponse<T>, RequestConfig
  auth.ts                  # User, AuthTokens, LoginCredentials, RegisterCredentials
  common.ts                # Theme, RouteConfig
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing |

## Key Features

### API Client

A typed `fetch` wrapper in `services/api-client.ts` that all API calls should go through:

- **Typed responses** — normalizes to `ApiResponse<T>` shape
- **Auth token injection** — auto-attaches Bearer token from Zustand store
- **401 refresh** — on unauthorized, refreshes the access token and retries
- **Retry with backoff** — configurable retries with exponential delay
- **Error toasts** — auto-triggers toast on failure (opt out with `skipErrorToast`)
- **Timeout** — per-request AbortController timeout (default 30s)

```ts
import { apiClient } from "@/services";
import { ENDPOINTS, interpolate } from "@/config/endpoints";

// GET request
const { data, ok } = await apiClient.get<User>(ENDPOINTS.AUTH.ME);

// POST with body
await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials, { skipAuth: true });

// Dynamic endpoint with mustache interpolation
await apiClient.get(interpolate(ENDPOINTS.USERS.DETAIL, { id: "42" }));
```

### Endpoint Constants

All API paths are defined in `config/endpoints.ts`. Dynamic segments use `{{param}}` syntax resolved by the `interpolate()` helper. Never hardcode endpoint strings.

### Auth System

- **Store** (`store/auth-store.ts`) — Zustand with localStorage persistence for user, tokens, and auth state
- **Service** (`services/auth-service.ts`) — login, register, logout, getProfile
- **Provider** (`components/providers/auth-provider.tsx`) — validates session on mount
- **Guard** (`components/layouts/auth-layout.tsx`) — redirects unauthenticated users to login

### Theme System

- System preference detection out of the box
- `ThemeToggle` component cycles: light → dark → system
- Design tokens in `globals.css` with `:root` (light) and `.dark` overrides using OKLch colors

### Form Handling

React Hook Form with Zod schema validation:

```ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

### Error Handling

| File | Purpose |
|------|---------|
| `app/error.tsx` | Route-level error boundary with retry button |
| `app/global-error.tsx` | Root layout error boundary (renders own `<html>`) |
| `app/not-found.tsx` | Custom 404 page |
| `app/loading.tsx` | Global loading skeleton |

Interactive demos at `/demo` to trigger each case.

### Hooks

All hooks in `hooks/` are importable via `@/hooks`:

| Hook | Description |
|------|-------------|
| `useMediaQuery` / `useScreenSize` | Hydration-safe media query matching (breakpoints: 640px, 1024px) |
| `useDebounce<T>` | Debounce any value (default 500ms) |
| `useLocalStorage<T>` | localStorage with cross-tab sync |
| `useOnClickOutside` | Click outside detection |
| `useIsMounted` / `useIsClient` | Hydration-safe booleans |
| `useCopyToClipboard` | Clipboard API wrapper |

### Layout Components

- **`PageLayout`** — responsive container with configurable `maxWidth` (sm/md/lg/xl/2xl/full)
- **`AuthLayout`** — client-side auth guard, redirects to login if unauthenticated

## Adding shadcn/ui Components

```bash
npx shadcn@latest add <component-name>
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | App base URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | App display name | `Next Boilerplate` |
| `NEXT_PUBLIC_API_BASE_URL` | API base URL | `http://localhost:3000/api` |
| `AUTH_SECRET` | Server-side auth secret | — |

## Docker

```bash
# Build
docker build -t next-boilerplate .

# Run
docker run -p 3000:3000 next-boilerplate
```

Multi-stage build using `node:20-alpine` with `output: "standalone"` for minimal image size.

## Deployment

**Vercel** (zero config):
1. Push to GitHub
2. Import on [Vercel](https://vercel.com/new)
3. Deploy

**Docker**: See above. Works with any container platform (Railway, Fly.io, AWS ECS, etc.)

See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for other options.
