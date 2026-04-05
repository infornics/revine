import type { Plugin, ViteDevServer } from "vite";
import chalk from "chalk";

export function revineLoggerPlugin(): Plugin {
  //  custom chalk instance pointing to the indigo color
  const indigo = chalk.hex("#6d28d9");

  return {
    name: "revine-logger",
    configureServer(server: ViteDevServer) {
      server.httpServer?.once("listening", () => {
        const protocol = server.config.server.https ? "https" : "http";
        const host = server.resolvedUrls?.local[0] || "localhost:3000";
        const { network = [] } = server.resolvedUrls ?? {};

        // Use the 'indigo' instance in place of 'chalk.cyan'
        console.log(indigo("─────────────────────────────────────────────"));
        console.log(indigo.bold("🚀 Revine Dev Server is now running!"));
        console.log(indigo("─────────────────────────────────────────────"));
        console.log(indigo(`Local:   ${chalk.green(`${protocol}://${host}`)}`));

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
