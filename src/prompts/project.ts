import inquirer from "inquirer";
import { spawn } from "child_process";
import { logInfo } from "../utils/logger.js";

/**
 * Ask the user if they want to run the project after setup is complete.
 * If the user confirms, it will start the dev server using the same revine
 * binary that was invoked (i.e. the local build), rather than the npm package.
 * @param projectDir - The directory where the project was set up.
 */
export default async function runProject(projectDir: string) {
  const { runProject } = await inquirer.prompt([
    {
      type: "confirm",
      name: "runProject",
      message: "Do you want to run the project now?",
      default: true,
    },
  ]);

  if (runProject) {
    logInfo("Running your Revine project on dev server...");

    // Use the same revine binary that the user invoked (process.argv[1])
    // so that local development always uses the local build.
    const revineBin = process.argv[1];

    spawn("node", [revineBin, "dev"], {
      cwd: projectDir,
      stdio: "inherit",
      shell: false,
    });
  }
}
