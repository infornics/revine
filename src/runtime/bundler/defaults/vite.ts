import react from "@vitejs/plugin-react";
import { revinePlugin } from "../revinePlugin.js";
import { revineLoggerPlugin } from "../viteLoggerPlugin.js";

export const defaultViteConfig = {
  plugins: [react(), revinePlugin(), revineLoggerPlugin()],
  logLevel: "silent",
  server: {
    clearScreen: false,
    open: false,
    port: 3000,
    host: true,
  },
  build: {
    outDir: "build",
    emptyOutDir: true,
    rollupOptions: {
      external: ["revine"],
    },
  },
  optimizeDeps: {
    exclude: ["revine"],
  },
};
