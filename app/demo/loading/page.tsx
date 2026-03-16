import Link from "next/link";
import { Button } from "@/components/ui/button";

// Simulates a slow data fetch. The artificial delay causes Next.js to
// show loading.tsx (via automatic Suspense wrapping) until this resolves.
async function slowData() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return { loadedAt: new Date().toISOString() };
}

export default async function LoadingDemoPage() {
  const data = await slowData();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <code className="rounded bg-muted px-2 py-1 text-sm">
            loading.tsx
          </code>
          <h1 className="text-2xl font-semibold text-foreground">
            Route Loading UI
          </h1>
          <p className="text-sm text-muted-foreground">
            This page awaited a 3-second delay before rendering. During that
            time, <code>loading.tsx</code> was shown instantly via Suspense.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-4 text-left">
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            What happened
          </p>
          <ol className="space-y-1 text-sm text-muted-foreground list-decimal list-inside">
            <li>You navigated to this route</li>
            <li>
              Next.js auto-wrapped <code>page.tsx</code> in a Suspense boundary
            </li>
            <li>
              <code>loading.tsx</code> rendered immediately as the fallback
            </li>
            <li>
              After 3 s the async Server Component resolved and replaced the
              skeleton
            </li>
          </ol>
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            Loaded at: {data.loadedAt}
          </p>
        </div>

        <Button variant="outline" asChild>
          <Link href="/demo">← Back</Link>
        </Button>
      </div>
    </div>
  );
}
