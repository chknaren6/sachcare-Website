import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-cyan-200 bg-surface dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2">
        <div>
          <div className="font-heading text-lg font-bold text-cyan-400">SachCare</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Truth in healthcare for 1.4 Billion Indians.
          </p>
          <p className="mt-3 text-sm">Made for Bharat 🇮🇳</p>
        </div>
        <nav className="flex flex-col gap-2 text-sm" aria-label="Footer">
          <Link to="/" className="text-muted-foreground transition-colors hover:text-cyan-400">
            Home
          </Link>
          <Link to="/map" className="text-muted-foreground transition-colors hover:text-cyan-400">
            Trust Map
          </Link>
          <Link
            to="/deserts"
            className="text-muted-foreground transition-colors hover:text-cyan-400"
          >
            Desert Analysis
          </Link>
          <Link
            to="/how-it-works"
            className="text-muted-foreground transition-colors hover:text-cyan-400"
          >
            How It Works
          </Link>
        </nav>
      </div>
      <div className="border-t border-cyan-200 py-4 text-center text-xs text-muted-foreground dark:border-slate-800">
        © 2026 SachCare. Open source. MIT License.
      </div>
    </footer>
  );
}
