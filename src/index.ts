#!/usr/bin/env node
import { Command } from "commander";
import { createProject } from "./commands/createProject.js";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

// Main command handler for direct project creation
const handleProjectCreation = async (
  projectName: string,
  options: { force?: boolean },
) => {
  await createProject(projectName, options);
};

// Helper to run vite with internal config
const runViteCommand = (command: string) => {
  // Path to the compiled vite.config.js in dist
  const configPath = path.resolve(__dirname, "runtime/bundler/vite.config.js");

  const args = [command, "--config", configPath];
  if (command === "dev") {
    // Vite dev doesn't need 'dev' argument, just calling vite is enough
    args.shift();
  }

  spawn("npx", ["vite", ...args], {
    stdio: "inherit",
    shell: true,
  });
};

// Main command handler for direct project creation with command check
const handleRootAction = async (
  projectName: string | undefined,
  options: { force?: boolean },
) => {
  const knownCommands = ["create", "dev", "build", "preview"];
  if (projectName && !knownCommands.includes(projectName)) {
    await handleProjectCreation(projectName, options);
  } else if (!projectName) {
    program.help();
  }
};

// Root command
program
  .version("0.8.0")
  .argument("[project-name/command]")
  .option("-f, --force", "Force creation in non-empty directory")
  .action(async (arg: string | undefined, options: { force?: boolean }) => {
    // If it's a known command, Commander will handle it in the subcommand action.
    // We only handle it here if it's NOT a known command.
    const knownCommands = ["create", "dev", "build", "preview"];
    if (arg && !knownCommands.includes(arg)) {
      await handleProjectCreation(arg, options);
    } else if (!arg) {
      program.help();
    }
  });

// Create subcommand (npx revine create my-app)
program
  .command("create")
  .argument("<project-name>")
  .option("-f, --force", "Force creation in non-empty directory")
  .action(async (projectName: string, options: { force?: boolean }) => {
    await handleProjectCreation(projectName, options);
  });

program
  .command("dev")
  .description("Start the development server")
  .action(() => runViteCommand("dev"));

program
  .command("build")
  .description("Build the project for production")
  .action(() => runViteCommand("build"));

program
  .command("preview")
  .description("Preview the production build")
  .action(() => runViteCommand("preview"));

program.parse(process.argv);
