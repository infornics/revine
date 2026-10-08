import path from "path";
import fs from "fs-extra";
import { logInfo } from "../utils/logger.js";

const COMPONENTS_JSON = {
  $schema: "https://ui.shadcn.com/schema.json",
  style: "new-york",
  rsc: false,
  tsx: true,
  tailwind: {
    config: "",
    css: "src/styles/global.css",
    baseColor: "slate",
    cssVariables: true,
    prefix: "",
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
    ui: "@/components/ui",
    lib: "@/lib",
    hooks: "@/hooks",
  },
};

const UTILS_TS = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

const GLOBAL_CSS = `@import "tailwindcss";

@plugin "@tailwindcss/typography";

@theme {
  /* shadcn/ui CSS Variables - New York style with slate base color */
  --color-background: 0 0% 100%;
  --color-foreground: 222.2 84% 4.9%;

  --color-card: 0 0% 100%;
  --color-card-foreground: 222.2 84% 4.9%;

  --color-popover: 0 0% 100%;
  --color-popover-foreground: 222.2 84% 4.9%;

  --color-primary: 221.2 83.2% 53.3%;
  --color-primary-foreground: 210 40% 98%;

  --color-secondary: 210 40% 96.1%;
  --color-secondary-foreground: 222.2 47.4% 11.2%;

  --color-muted: 210 40% 96.1%;
  --color-muted-foreground: 215.4 16.3% 46.9%;

  --color-accent: 210 40% 96.1%;
  --color-accent-foreground: 222.2 47.4% 11.2%;

  --color-destructive: 0 84.2% 60.2%;
  --color-destructive-foreground: 210 40% 98%;

  --color-border: 214.3 31.8% 91.4%;
  --color-input: 214.3 31.8% 91.4%;
  --color-ring: 221.2 83.2% 53.3%;

  --radius: 0.5rem;

  /* Radius scale */
  --radius-xs: calc(var(--radius) - 4px);
  --radius-sm: calc(var(--radius) - 2px);
  --radius-md: var(--radius);
  --radius-lg: calc(var(--radius) + 2px);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`;

export async function setupShadcn(projectDir: string) {
  logInfo("\nSetting up shadcn/ui...");

  // Create components.json
  const componentsJsonPath = path.join(projectDir, "components.json");
  await fs.writeJson(componentsJsonPath, COMPONENTS_JSON, { spaces: 2 });
  logInfo("Created components.json");

  // Create lib directory and utils.ts
  const libDir = path.join(projectDir, "src", "lib");
  await fs.ensureDir(libDir);
  const utilsPath = path.join(libDir, "utils.ts");
  await fs.writeFile(utilsPath, UTILS_TS);
  logInfo("Created src/lib/utils.ts");

  // Create components/ui directory
  const componentsUiDir = path.join(projectDir, "src", "components", "ui");
  await fs.ensureDir(componentsUiDir);
  logInfo("Created src/components/ui/ directory");

  // Update global.css with shadcn/ui CSS variables
  const cssFile = path.join(projectDir, "src", "styles", "global.css");
  await fs.writeFile(cssFile, GLOBAL_CSS);
  logInfo("Updated src/styles/global.css with shadcn/ui CSS variables");

  logInfo("shadcn/ui setup complete!");
}