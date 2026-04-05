import { merge } from "lodash-es";
import path from "path";
import fs from "fs-extra";
import { defaultViteConfig } from "./defaults/vite.js";
import { loadUserConfig } from "./utils/loadUserConfig.js";

interface UserConfig {
  vite?: Record<string, unknown>;
}

export async function generateRevineViteConfig() {
  // Load the user's revine.config.ts
  const userConfig = (await loadUserConfig()) as UserConfig;

  // Merge user "vite" overrides with your default config
  const finalConfig = merge({}, defaultViteConfig, userConfig.vite || {});

  // Dynamically add Tailwind if present in the project
  try {
    const projectPkgPath = path.resolve(process.cwd(), "package.json");
    const pkg = await fs.readJson(projectPkgPath);
    const hasTailwind =
      pkg.devDependencies?.["@tailwindcss/vite"] ||
      pkg.dependencies?.["@tailwindcss/vite"];

    if (hasTailwind) {
      const tailwindModule = "@tailwindcss/vite";
      const { default: tailwindcss } = (await import(tailwindModule)) as any;
      finalConfig.plugins = [...(finalConfig.plugins || []), tailwindcss()];
    }
  } catch (e) {
    // Ignore error if package.json not found or tailwind not importable
  }

  return finalConfig as any;
}
