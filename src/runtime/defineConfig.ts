import type { UserConfig } from "vite";
import type { RenderMode } from "./page-config.js";

export interface RevineConfig {
  rendering?: {
    default?: RenderMode;
    revalidateTime?: string | number;
  };
  vite?: UserConfig;
}

export function defineConfig(config: RevineConfig): RevineConfig {
  return config;
}