import { notFound } from "next/navigation";

// This Server Component unconditionally calls notFound().
// Next.js intercepts the thrown NEXT_NOT_FOUND error and renders
// the nearest not-found.tsx — in this case app/not-found.tsx.
export default function NotFoundDemoPage() {
  notFound();
}
