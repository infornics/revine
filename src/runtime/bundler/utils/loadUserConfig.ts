import { loadConfigFromFile } from "vite";
import path from "path";

export async function loadUserConfig() {
  const configPath = path.resolve(process.cwd(), "revine.config.ts");
  try {
    const result = await loadConfigFromFile(
      { command: "serve", mode: "development" },
      configPath
    );
    return result?.config || {};
  } catch (error) {
    console.error("Failed loading revine.config.ts:", error);
    // If .ts fails, try .js or just return empty
    try {
      const configPathJs = path.resolve(process.cwd(), "revine.config.js");
      const result = await loadConfigFromFile(
        { command: "serve", mode: "development" },
        configPathJs
      );
      return result?.config || {};
    } catch (e) {
      console.error("Failed loading revine.config.js:", e);
      return {};
    }
  }
}
