import { Link, useLocation } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { InstallPrompt } from "@/components/common/InstallPrompt";
import { useApp } from "@/components/providers/AppContext";
import { t } from "@/i18n";

export function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const { effectiveLanguage } = useApp();
  const copy = t(effectiveLanguage);
  const links = [
    { to: "/", label: copy.home },
    { to: "/map", label: copy.trustMap },
    { to: "/deserts", label: copy.desertAnalysis },
    { to: "/how-it-works", label: copy.howItWorks },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-200 bg-surface/80 backdrop-blur-md dark:bg-slate-900/80 dark:border-slate-800">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex flex-col leading-tight" aria-label="SachCare home">
          <span className="font-heading text-xl font-bold text-cyan-400">SachCare</span>
          <span className="text-[10px] text-muted-foreground">{copy.brandSubtitle}</span>
        </Link>

        <nav className="ml-8 hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={
                  active
                    ? "border-b-2 border-cyan-400 px-3 pb-[2px] pt-1 text-sm font-semibold text-cyan-400"
                    : "px-3 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-cyan-400"
                }
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <LanguageSwitcher />
          <ThemeToggle />
          <InstallPrompt />
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-cyan-100 dark:hover:bg-slate-800"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="mt-8 flex flex-col gap-1">
                  {links.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-cyan-100 dark:hover:bg-slate-800"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
