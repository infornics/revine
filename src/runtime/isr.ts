import fs from "fs-extra";
import path from "path";

export interface ISREntry {
  filePath: string;
  lastGenerated: number;
  revalidate: number; // seconds
}

export type ISRManifest = Record<string, ISREntry>;

// Track in-flight regenerations to avoid duplicate work
const pendingRegenerations = new Set<string>();

/**
 * Triggers background regeneration for an ISR page.
 * Returns immediately — the caller should serve stale content.
 *
 * Implements "stale-while-revalidate" semantics:
 * - The current (stale) HTML is served to the user immediately
 * - A new render is kicked off in the background
 * - Once complete, the HTML file and manifest are updated
 * - The next request will get the fresh content
 */
export function triggerISRRegeneration(
  routePath: string,
  renderFn: (url: string) => Promise<{ html: string; statusCode: number }>,
  htmlTemplate: string,
  buildDir: string,
  manifest: ISRManifest,
  manifestPath: string,
): void {
  if (pendingRegenerations.has(routePath)) return;
  pendingRegenerations.add(routePath);

  // Fire-and-forget — don't await this
  (async () => {
    try {
      const { html, statusCode } = await renderFn(`http://localhost${routePath}`);

      if (statusCode >= 400) {
        console.error(
          `ISR: regeneration for ${routePath} returned ${statusCode}, keeping stale version`
        );
        return;
      }

      const fullHtml = htmlTemplate.replace(
        '<div id="root"></div>',
        `<div id="root" data-ssr="true">${html}</div>`
      );

      const outputPath = routePath === "/"
        ? path.resolve(buildDir, "static/index.html")
        : path.resolve(buildDir, `static${routePath}/index.html`);

      await fs.ensureDir(path.dirname(outputPath));
      await fs.writeFile(outputPath, fullHtml);

      // Update manifest
      manifest[routePath] = {
        ...manifest[routePath],
        lastGenerated: Date.now(),
      };
      await fs.writeJson(manifestPath, manifest, { spaces: 2 });

      console.log(`ISR: regenerated ${routePath}`);
    } catch (e) {
      console.error(`ISR: regeneration failed for ${routePath}`, e);
    } finally {
      pendingRegenerations.delete(routePath);
    }
  })();
}
