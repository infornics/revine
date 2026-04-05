export interface RevineConfig {
  vite?: {
    server?: {
      port?: number;
      open?: boolean;
      host?: boolean | string;
    };
    build?: {
      outDir?: string;
      emptyOutDir?: boolean;
    };
  };
}

export function defineConfig(config: RevineConfig): RevineConfig {
  return config;
}
