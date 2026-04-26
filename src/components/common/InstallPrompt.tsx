import { Download } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";

export function InstallPrompt() {
  const { canInstall, promptInstall } = usePWAInstall();
  if (!canInstall) return null;
  return (
    <button
      type="button"
      onClick={promptInstall}
      aria-label="Install SachCare app"
      className="hidden items-center gap-1.5 rounded-md bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-cyan-300 sm:inline-flex"
    >
      <Download className="h-3.5 w-3.5" aria-hidden="true" />
      Install
    </button>
  );
}
