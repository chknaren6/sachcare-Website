import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LANGUAGES } from "@/lib/languageMap";
import { useApp } from "@/components/providers/AppContext";

export function LanguageSwitcher() {
  const { effectiveLanguage, setLanguageOverride } = useApp();
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
        <DropdownMenuItem onSelect={() => setLanguageOverride(null)}>
          Auto-detect
        </DropdownMenuItem>
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onSelect={() => setLanguageOverride(l.code)}
            className={effectiveLanguage === l.code ? "bg-cyan-100 dark:bg-slate-800" : ""}
          >
            <span className="mr-2">{l.flag}</span>
            <span className="font-medium">{l.nativeName}</span>
            <span className="ml-auto text-xs text-muted-foreground">{l.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
