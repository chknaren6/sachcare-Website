import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-surface/60 backdrop-blur-sm dark:bg-slate-900/40">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-sm sm:flex-row sm:px-6">
        <div className="flex items-center gap-3">
          <span className="font-heading font-semibold text-primary">SachCare</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Truth in healthcare · Made for Bharat 🇮🇳
          </span>
        </div>

        <nav className="flex items-center gap-4 text-xs" aria-label="Footer">
          <Link to="/" className="text-muted-foreground transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/map" className="text-muted-foreground transition-colors hover:text-primary">
            Map
          </Link>
          <Link to="/deserts" className="text-muted-foreground transition-colors hover:text-primary">
            Analysis
          </Link>
          <Link to="/how-it-works" className="text-muted-foreground transition-colors hover:text-primary">
            How it works
          </Link>
        </nav>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-success" />
          Operational
          <span className="hidden sm:inline">· © 2026</span>
        </div>
      </div>
    </footer>
  );
}
