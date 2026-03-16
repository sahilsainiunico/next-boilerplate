"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorDemoPage() {
  const [shouldThrow, setShouldThrow] = useState(false);

  // Throwing during render is what triggers error.tsx.
  // Event-handler throws are NOT caught by React error boundaries.
  if (shouldThrow) {
    throw new Error("Demo error: thrown intentionally during render.");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <code className="rounded bg-muted px-2 py-1 text-sm">error.tsx</code>
          <h1 className="text-2xl font-semibold text-foreground">
            Route Error Boundary
          </h1>
          <p className="text-sm text-muted-foreground">
            Clicking the button sets state that causes this component to{" "}
            <strong>throw during render</strong>. React catches it and hands
            control to <code>app/error.tsx</code>.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-4 text-left">
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            What happens
          </p>
          <ol className="space-y-1 text-sm text-muted-foreground list-decimal list-inside">
            <li>State update schedules a re-render</li>
            <li>
              <code>if (shouldThrow) throw new Error(...)</code> executes
            </li>
            <li>React error boundary catches it</li>
            <li>
              Next.js renders <code>app/error.tsx</code> with the error + a{" "}
              <code>reset()</code> callback
            </li>
          </ol>
        </div>

        <div className="flex justify-center gap-3">
          <Button variant="destructive" onClick={() => setShouldThrow(true)}>
            Throw error now
          </Button>
          <Button variant="outline" asChild>
            <Link href="/demo">← Back</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
