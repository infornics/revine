import { defineConfig } from "vite";
import { generateRevineViteConfig } from "./generateConfig.js";

// Vite supports async config. We can do:
export default defineConfig(async () => {
  // Merge defaults + user overrides
  return (await generateRevineViteConfig()) as any;
});
