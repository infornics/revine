import inquirer from "inquirer";
import type { RenderMode } from "../runtime/page-config.js";

export default async function askForRenderingMode(): Promise<RenderMode> {
  const { mode } = await inquirer.prompt([
    {
      type: "list",
      name: "mode",
      message: "Which default rendering mode would you like to use?",
      choices: [
        { name: "Client-Side Rendering (CSR)", value: "csr" },
        { name: "Server-Side Rendering (SSR)", value: "ssr" },
        { name: "Static Site Generation (SSG)", value: "ssg" },
      ],
      default: "csr",
    },
  ]);
  return mode;
}
