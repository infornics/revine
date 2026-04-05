import path from "path";
import { pathToFileURL } from "url";

export async function loadUserConfig() {
  const configPath = path.resolve(process.cwd(), "revine.config.ts");
  try {
    const configModule = await import(pathToFileURL(configPath).href);
    return configModule.default || {};
  } catch (error) {
    // If .ts fails, try .js or just return empty
    try {
      const configPathJs = path.resolve(process.cwd(), "revine.config.js");
      const configModule = await import(pathToFileURL(configPathJs).href);
      return configModule.default || {};
    } catch (e) {
      return {};
    }
  }
}
