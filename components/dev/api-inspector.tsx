"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ApiLogEntry = {
  id: string;
  method: string;
  url: string;
  status: number | null;
  statusText: string;
  duration: number | null;
  timestamp: number;
  error: string | null;
  pending: boolean;
};

function StatusBadge({ status }: { status: number | null }) {
  if (status === null) return <span className="text-muted-foreground">---</span>;
  const color =
    status < 300
      ? "text-green-500"
      : status < 400
        ? "text-yellow-500"
        : "text-destructive";
  return <span className={cn("font-mono text-xs font-medium", color)}>{status}</span>;
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "bg-blue-500/15 text-blue-500",
    POST: "bg-green-500/15 text-green-500",
    PUT: "bg-yellow-500/15 text-yellow-500",
    PATCH: "bg-orange-500/15 text-orange-500",
    DELETE: "bg-red-500/15 text-red-500",
  };
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold",
        colors[method] ?? "bg-muted text-muted-foreground"
      )}
    >
      {method}
    </span>
  );
}

export function ApiInspector() {
  const [logs, setLogs] = useState<ApiLogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const originalFetchRef = useRef<typeof fetch | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const originalFetch = globalThis.fetch;
    originalFetchRef.current = originalFetch;

    globalThis.fetch = async (input, init) => {
      const id = crypto.randomUUID();
      const method = init?.method?.toUpperCase() ?? "GET";
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input instanceof Request
              ? input.url
              : String(input);

      const entry: ApiLogEntry = {
        id,
        method,
        url,
        status: null,
        statusText: "",
        duration: null,
        timestamp: Date.now(),
        error: null,
        pending: true,
      };

      setLogs((prev) => [entry, ...prev]);
      const start = performance.now();

      try {
        const response = await originalFetch(input, init);
        const duration = Math.round(performance.now() - start);

        setLogs((prev) =>
          prev.map((l) =>
            l.id === id
              ? {
                  ...l,
                  status: response.status,
                  statusText: response.statusText,
                  duration,
                  pending: false,
                }
              : l
          )
        );

        return response;
      } catch (err) {
        const duration = Math.round(performance.now() - start);
        setLogs((prev) =>
          prev.map((l) =>
            l.id === id
              ? {
                  ...l,
                  duration,
                  error: err instanceof Error ? err.message : "Unknown error",
                  pending: false,
                }
              : l
          )
        );
        throw err;
      }
    };

    return () => {
      globalThis.fetch = originalFetch;
    };
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
    setExpandedId(null);
  }, []);

  if (process.env.NODE_ENV !== "development") return null;

  const pendingCount = logs.filter((l) => l.pending).length;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={cn(
          "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 font-mono text-xs text-card-foreground shadow-lg transition-colors hover:bg-accent",
          isOpen && "ring-2 ring-ring"
        )}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.97.633-3.794 1.708-5.278" />
        </svg>
        API
        {logs.length > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {logs.length}
          </span>
        )}
        {pendingCount > 0 && (
          <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 z-50 flex max-h-[70vh] w-[420px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <h3 className="text-sm font-semibold text-card-foreground">
              API Inspector
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={clearLogs}
                className="rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Close
              </button>
            </div>
          </div>

          {/* Request List */}
          <div className="flex-1 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                No requests captured yet
              </div>
            ) : (
              logs.map((entry) => (
                <div key={entry.id} className="border-b border-border last:border-0">
                  <button
                    onClick={() =>
                      setExpandedId((id) => (id === entry.id ? null : entry.id))
                    }
                    className="flex w-full items-center gap-2 px-4 py-2 text-left transition-colors hover:bg-accent/50"
                  >
                    <MethodBadge method={entry.method} />
                    <span className="min-w-0 flex-1 truncate font-mono text-xs text-card-foreground">
                      {entry.url}
                    </span>
                    {entry.pending ? (
                      <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
                    ) : entry.error ? (
                      <span className="text-xs text-destructive">ERR</span>
                    ) : (
                      <StatusBadge status={entry.status} />
                    )}
                    {entry.duration !== null && (
                      <span className="whitespace-nowrap font-mono text-[10px] text-muted-foreground">
                        {entry.duration}ms
                      </span>
                    )}
                  </button>

                  {expandedId === entry.id && (
                    <div className="space-y-1 border-t border-border bg-muted/30 px-4 py-2 font-mono text-[11px]">
                      <div>
                        <span className="text-muted-foreground">URL: </span>
                        <span className="break-all text-card-foreground">{entry.url}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status: </span>
                        <span className="text-card-foreground">
                          {entry.status ?? "N/A"} {entry.statusText}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration: </span>
                        <span className="text-card-foreground">
                          {entry.duration !== null ? `${entry.duration}ms` : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Time: </span>
                        <span className="text-card-foreground">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      {entry.error && (
                        <div>
                          <span className="text-muted-foreground">Error: </span>
                          <span className="text-destructive">{entry.error}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
