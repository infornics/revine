import react from "@vitejs/plugin-react";
import path from "path";
import { revinePlugin } from "../revinePlugin.js";
import { revineLoggerPlugin } from "../viteLoggerPlugin.js";

export const defaultViteConfig = {
  plugins: [react(), revinePlugin(), revineLoggerPlugin()],
  logLevel: "silent",
  // Only expose env variables prefixed with REVINE_PUBLIC_ to the browser bundle.
  // Variables without this prefix are never included in client-side code.
  envPrefix: "REVINE_PUBLIC_",
  resolve: {
    alias: {
      // @ always points to the user's project /src directory
      "@": path.resolve(process.cwd(), "src"),
    },
  },
  server: {
    clearScreen: false,
    open: false,
    port: 3000,
    host: true,
  },
  build: {
    outDir: "build",
    emptyOutDir: true,
  },
};
