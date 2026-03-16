// This file is the loading UI for the /demo/loading segment only.
// Next.js wraps page.tsx in a Suspense boundary and shows this
// immediately on navigation while the async Server Component resolves.
export default function LoadingDemo() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="w-full max-w-md space-y-4">
        <div className="space-y-1">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-8 w-56 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="h-32 w-full animate-pulse rounded-xl bg-muted" />
        <div className="flex gap-3">
          <div className="h-10 w-28 animate-pulse rounded-md bg-muted" />
          <div className="h-10 w-20 animate-pulse rounded-md bg-muted" />
        </div>
        <p className="text-xs text-muted-foreground">
          ← This skeleton is <code>app/demo/loading/loading.tsx</code>,
          shown instantly while the page streams in…
        </p>
      </div>
    </div>
  );
}
