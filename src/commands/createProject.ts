import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import { updatePackageJson } from "../config/package.js";
import { updateReadme } from "../config/readme.js";
import { askForTailwindSetup, initGit, runProject } from "../prompts/index.js";
import { installDependencies } from "../setup/dependencies.js";
import { setupTailwind } from "../setup/tailwind.js";
import { copyTemplate } from "../utils/file.js";
import { logError, logInfo } from "../utils/logger.js";

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
    logInfo(`Creating project in ${projectDir}...`);

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
    logInfo("\nInstalling dependencies...");
    await installDependencies(projectDir);

    // If Tailwind is selected, set it up
    if (useTailwind) {
      await setupTailwind(projectDir);
    }

    logInfo(`\nSuccess! Created project at ${projectDir}`);
    logInfo("\nStart developing with:");
    if (!isCurrentDir) console.log(`  cd ${projectName}`);
    console.log("  npm run dev\n");

    // Check if Git exists and initialize repository if user agrees
    await initGit(projectDir);

    // Prompt to run project
    await runProject(projectDir);
  } catch (error) {
    logError("Error during project creation:", error);
    process.exit(1);
  }
}
