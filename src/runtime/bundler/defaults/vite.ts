import react from "@vitejs/plugin-react";
import { revineLoggerPlugin } from "../viteLoggerPlugin.js";
import { revinePlugin } from "../revinePlugin.js";

export const defaultViteConfig = {
  plugins: [react(), revinePlugin(), revineLoggerPlugin()],
  logLevel: "silent",
  server: {
    clearScreen: false,
    open: true,
    port: 3000,
    host: true,
  },
  build: {
    outDir: "build",
    emptyOutDir: true,
  },
};
