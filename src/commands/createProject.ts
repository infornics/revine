import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import { updatePackageJson } from "../config/package.js";
import { updateReadme } from "../config/readme.js";
import { askForTailwindSetup, initGit, runProject } from "../prompts/index.js";
import { installDependencies } from "../setup/dependencies.js";
import { setupTailwind } from "../setup/tailwind.js";
import { copyTemplate } from "../utils/file.js";
import { logError, logInfo, logStep, logSuccess } from "../utils/logger.js";
import boxen from "boxen";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITIGNORE_CONTENT = `# Dependencies
node_modules/
dist/
dist-ssr/

# Vite cache
.vite/
*.local

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor/IDE
.vscode/
.idea/
*.swp
*.swo

# OS metadata
.DS_Store
Thumbs.db

# TypeScript build info
*.tsbuildinfo

# Optional
.cache/
.tmp/
.sass-cache/
`;

export async function createProject(
  projectName: string,
  options: { force?: boolean }
) {
  // Calculate directories. This uses "../../template" for your template folder.
  const templateDir = path.join(__dirname, "../../template");
  const projectDir = path.resolve(projectName);
  const isCurrentDir = [".", "./"].includes(projectName);

  try {
    logStep(`Creating project in ${chalk.cyan(projectDir)}...`);

    // Ensure the project directory exists
    await fs.ensureDir(projectDir);

    // This copies everything, including hidden directories like .revine
    await copyTemplate(templateDir, projectDir, options.force);

    // Explicitly write .gitignore because npm strips it from published tarballs
    await fs.writeFile(path.join(projectDir, ".gitignore"), GITIGNORE_CONTENT);

    // Derive final project name
    const finalProjectName = isCurrentDir
      ? path.basename(projectDir)
      : projectName;

    // Check if package.json exists after template copy
    const packageJsonPath = path.join(projectDir, "package.json");

    // Create basic package.json if it doesn't exist
    if (!(await fs.pathExists(packageJsonPath))) {
      const basicPackageJson = {
        name: finalProjectName,
        version: "0.1.0",
        private: true,
        type: "module",
      };
      await fs.writeJSON(packageJsonPath, basicPackageJson, { spaces: 2 });
    }

    // Update package.json with the correct details
    const useTailwind = await askForTailwindSetup();
    await updatePackageJson(packageJsonPath, finalProjectName, { useTailwind });

    // Check if README exists, create it if it doesn't
    const readmePath = path.join(projectDir, "README.md");
    if (!(await fs.pathExists(readmePath))) {
      await fs.writeFile(
        readmePath,
        `# ${finalProjectName}\n\nCreated with Revine`
      );
    }

    // Update README with the project name
    await updateReadme(readmePath, finalProjectName);

    // Install dependencies
    logStep("Installing dependencies...");
    await installDependencies(projectDir);

    // If Tailwind is selected, set it up
    if (useTailwind) {
      logStep("Setting up Tailwind CSS...");
      await setupTailwind(projectDir);
    }

    logSuccess(`Project created at ${chalk.cyan(projectDir)}`);

    const successContent = [
      `${chalk.bold.green("Success!")} Your Revine project is ready.`,
      "",
      `${chalk.white("Next steps:")}`,
      !isCurrentDir ? `${chalk.dim("1.")} ${chalk.cyan(`cd ${projectName}`)}` : "",
      `${isCurrentDir ? chalk.dim("1.") : chalk.dim("2.")} ${chalk.cyan("npm run dev")}`,
      "",
      `${chalk.dim("Happy coding!")}`
    ].filter(Boolean).join("\n");

    console.log(boxen(successContent, {
      padding: 1,
      margin: { top: 1, bottom: 1, left: 0, right: 0 },
      borderStyle: "round",
      borderColor: "green",
    }));

    // Check if Git exists and initialize repository if user agrees
    await initGit(projectDir);

    // Prompt to run project
    await runProject(projectDir);
  } catch (error) {
    logError("Error during project creation:", error);
    process.exit(1);
  }
}
