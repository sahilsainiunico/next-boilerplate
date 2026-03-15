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

### Path aliases
`@/` maps to the project root (configured in `tsconfig.json`).
