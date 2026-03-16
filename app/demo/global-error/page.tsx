import Link from "next/link";
import { Button } from "@/components/ui/button";

// global-error.tsx cannot be triggered from within the app normally —
// it only fires when the root layout (app/layout.tsx) itself throws.
// This page explains the mechanism and shows how to reproduce it manually.
export default function GlobalErrorInfoPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="w-full max-w-lg space-y-6">
        <div className="space-y-2 text-center">
          <code className="rounded bg-muted px-2 py-1 text-sm">
            global-error.tsx
          </code>
          <h1 className="text-2xl font-semibold text-foreground">
            Root Layout Error Boundary
          </h1>
          <p className="text-sm text-muted-foreground">
            This boundary catches errors thrown inside{" "}
            <code>app/layout.tsx</code> itself — not its children. Because the
            layout has crashed, it renders its own{" "}
            <code>&lt;html&gt;</code> and <code>&lt;body&gt;</code> tags.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-4 space-y-3 text-sm">
          <p className="font-medium text-foreground">
            Why you can&apos;t demo it with a button
          </p>
          <p className="text-muted-foreground">
            Any route you navigate to is a <em>child</em> of the root layout,
            so errors there are caught by <code>app/error.tsx</code> first.
            Only code that runs <em>inside</em>{" "}
            <code>app/layout.tsx</code> (e.g. a broken font load, a top-level{" "}
            <code>await</code>, or a provider that throws) triggers{" "}
            <code>global-error.tsx</code>.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-4 space-y-2 text-sm">
          <p className="font-medium text-foreground">
            How to reproduce it manually
          </p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>
              Open <code>app/layout.tsx</code>
            </li>
            <li>
              Add <code>throw new Error(&quot;layout crash&quot;)</code> at the
              top of the component body
            </li>
            <li>Save and reload any page</li>
            <li>
              <code>global-error.tsx</code> takes over — notice it has its own{" "}
              <code>&lt;html&gt;</code> tag and no shared layout
            </li>
            <li>Undo the change when done</li>
          </ol>
        </div>

        <div className="rounded-lg border bg-card p-4 space-y-2 text-sm">
          <p className="font-medium text-foreground">
            Key differences vs <code>error.tsx</code>
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Must render its own HTML shell (no shared layout)</li>
            <li>Cannot import UI components that depend on layout context</li>
            <li>Only receives inline Tailwind classes — no CSS imports</li>
            <li>
              Is the absolute last resort before a blank white screen
            </li>
          </ul>
        </div>

        <div className="flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/demo">← Back</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
