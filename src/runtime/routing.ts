// This module is intentionally empty at the source level.
// `revine/routing` is a virtual module resolved by the Revine Vite plugin at build/dev time.
// The actual router is injected via the plugin's resolveId/load hooks.
//
// The type declaration below tells TypeScript that these exports exist on this module
// so consumers don't get ts(2305) errors.
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import type { PageMetadata } from "./page-config.js";

declare module "revine/routing" {
  export const router: ReturnType<typeof createBrowserRouter>;
  export const routes: RouteObject[];
  export function createRevineRoutes(): RouteObject[];
  export function createBrowserRevineRouter(): ReturnType<typeof createBrowserRouter>;
  export function getPageMetadata(): PageMetadata[];
}

export {};
