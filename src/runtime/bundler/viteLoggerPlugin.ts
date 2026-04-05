import chalk from "chalk";
import type { Plugin, ViteDevServer } from "vite";

export function revineLoggerPlugin(): Plugin {
  //  custom chalk instance pointing to the indigo color
  const indigo = chalk.hex("#6d28d9");

  return {
    name: "revine-logger",
    configureServer(server: ViteDevServer) {
      server.httpServer?.once("listening", () => {
        const protocol = server.config.server.https ? "https" : "http";
        const localUrl =
          server.resolvedUrls?.local[0] || `http://localhost:3000`;
        const { network = [] } = server.resolvedUrls ?? {};

        // Use the 'indigo' instance in place of 'chalk.cyan'
        console.log(indigo("─────────────────────────────────────────────"));
        console.log(indigo.bold("🚀 Revine Dev Server is now running!"));
        console.log(indigo("─────────────────────────────────────────────"));
        console.log(indigo(`Local:   ${chalk.green(localUrl)}`));

        if (network.length) {
          network.forEach((url: string) => {
            console.log(indigo(`Network: ${chalk.green(url)}`));
          });
        }

        console.log(indigo("─────────────────────────────────────────────"));
        console.log("");
      });
    },
  };
}
