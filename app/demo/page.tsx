import Link from "next/link";

const cases = [
  {
    href: "/demo/error",
    title: "error.tsx",
    badge: "Client Component",
    description:
      "A route-level error boundary. Caught when any Server or Client Component throws during render inside the root layout.",
    cta: "Trigger error →",
    color: "border-destructive/40 hover:border-destructive",
  },
  {
    href: "/demo/not-found",
    title: "not-found.tsx",
    badge: "Server Component",
    description:
      "Shown when notFound() is called inside a Server Component, or when no route matches the URL.",
    cta: "Trigger 404 →",
    color: "border-yellow-500/40 hover:border-yellow-500",
  },
  {
    href: "/demo/loading",
    title: "loading.tsx",
    badge: "Server Component",
    description:
      "Instantly shown while a route segment is streaming in. Next.js wraps the page in a Suspense boundary automatically.",
    cta: "Trigger loading →",
    color: "border-blue-500/40 hover:border-blue-500",
  },
  {
    href: "/demo/global-error",
    title: "global-error.tsx",
    badge: "Last resort",
    description:
      "Replaces the entire page, including the root layout, when the layout itself throws. Renders its own <html> and <body>.",
    cta: "Learn how to trigger →",
    color: "border-purple-500/40 hover:border-purple-500",
  },
];

export default function DemoPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Boilerplate Demos
          </h1>
          <p className="text-muted-foreground">
            Each card links to a route that demonstrates a specific feature of
            this boilerplate.
          </p>
        </div>

        <div className="grid gap-4">
          {cases.map(({ href, title, badge, description, cta, color }) => (
            <Link
              key={href}
              href={href}
              className={`group block rounded-xl border bg-card p-5 transition-colors ${color}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-semibold text-foreground">
                      {title}
                    </code>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {badge}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <span className="shrink-0 text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                  {cta}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Tip: you can also trigger <code>not-found.tsx</code> by visiting any
          URL that has no matching route, e.g.{" "}
          <Link href="/this-does-not-exist" className="underline">
            /this-does-not-exist
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
