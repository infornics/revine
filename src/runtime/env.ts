/**
 * env() — Revine's typed helper for accessing public environment variables.
 *
 * Usage:
 *   import { env } from "revine";
 *   const token = env("REVINE_PUBLIC_GITHUB_TOKEN");
 *
 * Rules:
 *   - Variables MUST be prefixed with REVINE_PUBLIC_ to be exposed to the browser.
 *   - Variables without this prefix are never included in the client bundle.
 *   - Values are replaced at build time by Vite (static string replacement).
 *   - Never use import.meta.env directly — always use this helper.
 */
export function env(key: string): string | undefined {
  return (import.meta.env as Record<string, string | undefined>)[key];
}

/**
 * All public env variables as a typed object.
 * Keys are the full variable names including the REVINE_PUBLIC_ prefix.
 */
export function envAll(): Record<string, string | undefined> {
  const all: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(import.meta.env)) {
    if (key.startsWith("REVINE_PUBLIC_")) {
      all[key] = value as string | undefined;
    }
  }
  return all;
}
