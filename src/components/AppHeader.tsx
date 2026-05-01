import { Link } from "@tanstack/react-router";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-soft)]">
            L
          </span>
          <span>Loksewa Prep</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link to="/" className="px-3 py-1.5 rounded-md hover:bg-muted" activeOptions={{ exact: true }} activeProps={{ className: "px-3 py-1.5 rounded-md bg-muted font-medium" }}>
            Home
          </Link>
          <Link to="/stats" className="px-3 py-1.5 rounded-md hover:bg-muted" activeProps={{ className: "px-3 py-1.5 rounded-md bg-muted font-medium" }}>
            Stats
          </Link>
        </nav>
      </div>
    </header>
  );
}
