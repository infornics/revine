import { spawnSync } from "child_process";
import { logError, logInfo } from "../utils/logger.js";

export async function installDependencies(projectDir: string): Promise<void> {
  const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

  // Step 1: npm install
  const installResult = spawnSync(npmCmd, ["install"], {
    stdio: "inherit",
    cwd: projectDir,
    shell: true,
  });
  if (installResult.error || installResult.status !== 0) {
    logError("Error installing dependencies:", installResult.error);
    logInfo("Try running manually: npm install");
    process.exit(1);
  }

  // Step 2: Link local revine if available (replaces npm version with local build)
  // This is a no-op if revine hasn't been globally linked via `npm link` in the revine repo.
  spawnSync(npmCmd, ["link", "revine"], {
    stdio: "pipe", // suppress output — silently skip if not linked
    cwd: projectDir,
    shell: true,
  });
}
