import path from "path";
import { pathToFileURL } from "url";
import type { PageMetadata } from "./page-config.js";

/**
 * Loads the built server bundle and collects page metadata.
 * This runs at build/export time only — never shipped to the browser.
 */
export async function collectPageMetadata(buildDir: string): Promise<PageMetadata[]> {
  const serverEntry = pathToFileURL(
    path.resolve(buildDir, "server/entry-server.js")
  ).href;
  const serverModule = await import(serverEntry);

  return serverModule.getPageMetadata?.() ?? [];
}
