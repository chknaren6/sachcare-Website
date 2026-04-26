// This file's only purpose is to load the `server` route option augmentation
// from @tanstack/start-client-core/serverRoute into @tanstack/router-core.
// The package only ships the .d.ts (no .js) so we reference it by path.
/// <reference path="../node_modules/@tanstack/start-client-core/dist/esm/serverRoute.d.ts" />
import "@tanstack/start-client-core";

export {};
