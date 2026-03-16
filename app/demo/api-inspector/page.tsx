"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type RequestResult = {
  label: string;
  status: number | string;
  duration: number;
  ok: boolean;
};

const requests = [
  {
    label: "GET /api/health",
    method: "GET",
    url: "/api/health",
    body: undefined,
  },
  {
    label: "POST /api/health",
    method: "POST",
    url: "/api/health",
    body: JSON.stringify({ ping: true }),
  },
  {
    label: "GET /api/does-not-exist (404)",
    method: "GET",
    url: "/api/does-not-exist",
    body: undefined,
  },
  {
    label: "GET https://httpbin.org/delay/1 (slow, cross-origin)",
    method: "GET",
    url: "https://httpbin.org/delay/1",
    body: undefined,
  },
];

export default function ApiInspectorDemoPage() {
  const [results, setResults] = useState<RequestResult[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  async function fire(req: (typeof requests)[number]) {
    setLoading(req.label);
    const start = performance.now();
    try {
      const res = await fetch(req.url, {
        method: req.method,
        body: req.body,
        headers: req.body ? { "Content-Type": "application/json" } : undefined,
      });
      const duration = Math.round(performance.now() - start);
      setResults((prev) => [
        { label: req.label, status: res.status, duration, ok: res.ok },
        ...prev,
      ]);
    } catch {
      const duration = Math.round(performance.now() - start);
      setResults((prev) => [
        { label: req.label, status: "ERR", duration, ok: false },
        ...prev,
      ]);
    } finally {
      setLoading(null);
    }
  }

  async function fireAll() {
    for (const req of requests) {
      await fire(req);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="w-full max-w-lg space-y-6">
        <div className="space-y-2 text-center">
          <code className="rounded bg-muted px-2 py-1 text-sm">
            ApiInspector
          </code>
          <h1 className="text-2xl font-semibold text-foreground">
            API Inspector Demo
          </h1>
          <p className="text-sm text-muted-foreground">
            Fire requests below and watch them appear in the floating{" "}
            <strong>API</strong> panel at the bottom-right of the screen.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-4 text-sm space-y-2">
          <p className="font-medium text-foreground">How it works</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>
              <code>ApiInspector</code> monkey-patches{" "}
              <code>globalThis.fetch</code> on mount
            </li>
            <li>
              Every <code>fetch()</code> call is intercepted, timed, and logged
            </li>
            <li>
              Click the <strong>API</strong> button (bottom-right) to open the
              panel
            </li>
            <li>Click any row to expand method, URL, status, and duration</li>
            <li>
              Only active in <code>development</code> — returns{" "}
              <code>null</code> in production
            </li>
          </ol>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Fire a request
          </p>
          <div className="grid gap-2">
            {requests.map((req) => (
              <button
                key={req.label}
                onClick={() => fire(req)}
                disabled={loading !== null}
                className="flex items-center justify-between rounded-lg border bg-card px-4 py-2.5 text-left text-sm transition-colors hover:bg-accent disabled:opacity-50"
              >
                <span className="font-mono text-xs text-foreground">
                  {req.label}
                </span>
                {loading === req.label && (
                  <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
                )}
              </button>
            ))}
          </div>

          <Button
            className="w-full"
            onClick={fireAll}
            disabled={loading !== null}
          >
            Fire all requests
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Results
              </p>
              <button
                onClick={() => setResults([])}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            </div>
            <div className="divide-y divide-border rounded-lg border bg-card">
              {results.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-2"
                >
                  <span className="font-mono text-xs text-muted-foreground truncate">
                    {r.label}
                  </span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`font-mono text-xs font-medium ${r.ok ? "text-green-500" : "text-destructive"}`}
                    >
                      {r.status}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {r.duration}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/demo">← Back</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
