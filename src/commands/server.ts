import http from "http";
import fs from "fs-extra";
import path from "path";
import { pathToFileURL } from "url";
import { logStep, logSuccess, logError } from "../utils/logger.js";
import { triggerISRRegeneration, type ISRManifest } from "../runtime/isr.js";
import chalk from "chalk";

export async function runServeCommand(port: number = 3000) {
  const cwd = process.cwd();
  const buildDir = path.resolve(cwd, "build");
  const serverEntryPath = path.resolve(buildDir, "server/entry-server.js");
  const clientHtmlPath = path.resolve(buildDir, "index.html");

  // Validate build exists
  if (!await fs.pathExists(serverEntryPath)) {
    logError("Server bundle not found. Run `revine build` first.");
    process.exit(1);
  }

  if (!await fs.pathExists(clientHtmlPath)) {
    logError("Client build not found. Run `revine build` first.");
    process.exit(1);
  }

  logStep("Loading server bundle...");

  // Load built artifacts
  const serverModule = await import(pathToFileURL(serverEntryPath).href);
  const { render, getPageMetadata } = serverModule;
  const htmlTemplate = await fs.readFile(clientHtmlPath, "utf-8");

  // Build a lookup of page metadata for routing decisions
  const pages = getPageMetadata();
  const pageMap = new Map<string, any>();
  for (const p of pages) pageMap.set(p.routePath, p);

  // Load ISR manifest if present
  const isrManifestPath = path.resolve(buildDir, "isr-manifest.json");
  let isrManifest: ISRManifest = {};
  if (await fs.pathExists(isrManifestPath)) {
    isrManifest = await fs.readJson(isrManifestPath);
  }

  const mimeTypes: Record<string, string> = {
    ".js": "text/javascript",
    ".mjs": "text/javascript",
    ".css": "text/css",
    ".html": "text/html",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
  };

  const server = http.createServer(async (req, res) => {
    const url = req.url || "/";

    // Serve static assets from build/ (assets/, favicon, public files)
    if (url.startsWith("/assets/") || url.match(/\.\w+$/)) {
      const filePath = path.resolve(buildDir, url.slice(1));
      if (await fs.pathExists(filePath)) {
        const content = await fs.readFile(filePath);
        const ext = path.extname(filePath);
        res.writeHead(200, {
          "Content-Type": mimeTypes[ext] || "application/octet-stream",
          "Cache-Control": url.startsWith("/assets/")
            ? "public, max-age=31536000, immutable"
            : "public, max-age=3600",
        });
        res.end(content);
        return;
      }
    }

    try {
      // Check for pre-rendered static page (SSG)
      const staticPath = url === "/"
        ? path.resolve(buildDir, "static/index.html")
        : path.resolve(buildDir, `static${url}/index.html`);

      if (await fs.pathExists(staticPath)) {
        // ISR: check if revalidation is needed
        const isrEntry = isrManifest[url];
        if (isrEntry && Date.now() - isrEntry.lastGenerated > isrEntry.revalidate * 1000) {
          // Serve stale content immediately, regenerate in background
          triggerISRRegeneration(
            url, render, htmlTemplate, buildDir, isrManifest, isrManifestPath
          );
        }

        const content = await fs.readFile(staticPath, "utf-8");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
        return;
      }

      // SSR: render on demand
      const fullUrl = `http://localhost:${port}${url}`;
      const { html, statusCode, redirect } = await render(fullUrl);

      if (redirect) {
        res.writeHead(statusCode, { Location: redirect });
        res.end();
        return;
      }

      const fullHtml = htmlTemplate.replace(
        '<div id="root"></div>',
        `<div id="root" data-ssr="true">${html}</div>`
      );

      res.writeHead(statusCode, { "Content-Type": "text/html" });
      res.end(fullHtml);
    } catch (e: any) {
      console.error("SSR Error:", e);
      res.writeHead(500, { "Content-Type": "text/html" });
      res.end("<h1>500 — Internal Server Error</h1>");
    }
  });

  server.listen(port, () => {
    logSuccess(
      `Revine SSR server running on ${chalk.blue(`http://localhost:${port}/`)}`
    );
  });
}
