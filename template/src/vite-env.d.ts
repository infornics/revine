/// <reference types="vite/client" />
/// <reference types="revine/routing" />

/**
 * Augment ImportMetaEnv so TypeScript knows about your REVINE_PUBLIC_ variables.
 *
 * Add your own variables here:
 *
 * interface ImportMetaEnv {
 *   readonly REVINE_PUBLIC_API_URL: string;
 *   readonly REVINE_PUBLIC_GITHUB_TOKEN: string;
 * }
 */
interface ImportMetaEnv {
  // Add your REVINE_PUBLIC_ variables here
  [key: `REVINE_PUBLIC_${string}`]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
