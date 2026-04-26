// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

const isVercel = !!process.env.VERCEL;

export default defineConfig({
  // Disable the Cloudflare Workers build plugin — we deploy to Vercel via Nitro.
  cloudflare: false,
  plugins: [
    nitro({
      // Nitro auto-detects `vercel` when VERCEL=1, but we set it explicitly so
      // local `npm run build` also produces a Vercel-compatible bundle.
      preset: isVercel ? undefined : "vercel",
    }),
  ],
});
