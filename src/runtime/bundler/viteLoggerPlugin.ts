import chalk from "chalk";
import os from "os";
import type { Plugin, ViteDevServer } from "vite";

/**
 * Reads all non-internal IPv4 addresses from the host machine's
 * network interfaces so we can display them regardless of Vite's
 * resolvedUrls behaviour (which can be empty when logLevel is silent).
 */
function getNetworkAddresses(): string[] {
  const interfaces = os.networkInterfaces();
  const addresses: string[] = [];

  for (const nets of Object.values(interfaces)) {
    if (!nets) continue;
    for (const net of nets) {
      // Only include external IPv4 addresses
      if (net.family === "IPv4" && !net.internal) {
        addresses.push(net.address);
      }
    }
  }

  return addresses;
}

export function revineLoggerPlugin(): Plugin {
  const indigo = chalk.hex("#6d28d9");

  return {
    name: "revine-logger",
    configureServer(server: ViteDevServer) {
      server.httpServer?.once("listening", () => {
        const protocol = server.config.server.https ? "https" : "http";
        const port = server.config.server.port ?? 3000;
        const localUrl =
          server.resolvedUrls?.local[0] ?? `${protocol}://localhost:${port}/`;

        // Always derive network URLs from OS interfaces — reliable even with logLevel: silent
        const networkUrls =
          server.resolvedUrls?.network?.length
            ? server.resolvedUrls.network
            : getNetworkAddresses().map((addr) => `${protocol}://${addr}:${port}/`);

        console.log(indigo("─────────────────────────────────────────────"));
        console.log(indigo.bold("🚀 Revine Dev Server is now running!"));
        console.log(indigo("─────────────────────────────────────────────"));
        console.log(indigo(`Local:   ${chalk.green(localUrl)}`));

        if (networkUrls.length) {
          networkUrls.forEach((url: string) => {
            console.log(indigo(`Network: ${chalk.green(url)}`));
          });
        } else {
          console.log(indigo(`Network: ${chalk.dim("not available")}`));
        }

        console.log(indigo("─────────────────────────────────────────────"));
        console.log("");
      });
    },
  };
}
