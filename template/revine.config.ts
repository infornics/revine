import { defineConfig } from "revine";

export default defineConfig({
  rendering: {
    default: "csr", // Default rendering mode: "csr" | "ssr" | "ssg"
    revalidateTime: "1h", // ISR revalidation time for SSG pages (e.g. "1h", "5m", or in seconds)
  },
  vite: {
    server: {
      open: false,
      port: 3000,
      host: true,
    },
    build: {
      outDir: "build",
      emptyOutDir: true,
    },
  },
});