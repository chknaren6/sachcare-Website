// This file's only purpose is to load the `server` route option augmentation
// from @tanstack/start-client-core/serverRoute into @tanstack/router-core.
// The package only ships the .d.ts (no .js) so we import the type module by path.
import type {} from "../node_modules/@tanstack/start-client-core/dist/esm/serverRoute";
import "@tanstack/start-client-core";

export {};
