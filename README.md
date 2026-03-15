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
  page.tsx        # Home page — start editing here
  layout.tsx      # Root layout (fonts, global styles)
components/
  ui/             # shadcn/ui components (e.g. card.tsx)
public/           # Static assets
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
