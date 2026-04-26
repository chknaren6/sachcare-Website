import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/components/providers/AppContext";
import { UI_LANGUAGES } from "@/i18n";

export function LanguageSwitcher() {
  const { uiLanguage, setUiLanguage } = useApp();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:hover:bg-slate-800"
        aria-label="Change interface language"
      >
        <Globe className="h-4.5 w-4.5" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Interface language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {UI_LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onSelect={() => setUiLanguage(l.code)}
            className={uiLanguage === l.code ? "bg-cyan-100 dark:bg-slate-800" : ""}
          >
            <span className="font-medium">{l.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
