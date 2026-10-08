import fs from "fs-extra";

interface UpdatePackageOptions {
  useTailwind?: boolean;
  useShadcn?: boolean;
}

const SHADCN_DEPENDENCIES = {
  clsx: "^2.1.0",
  "tailwind-merge": "^2.2.0",
  "lucide-react": "^0.344.0",
  "class-variance-authority": "^0.7.0",
  "@radix-ui/react-slot": "^1.0.2",
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "@radix-ui/react-label": "^2.0.2",
  "@radix-ui/react-select": "^2.0.0",
  "@radix-ui/react-separator": "^1.0.3",
  "@radix-ui/react-toast": "^1.1.5",
  "@radix-ui/react-tooltip": "^1.0.7",
};

export async function updatePackageJson(
  filePath: string,
  projectName: string,
  options: UpdatePackageOptions = {},
) {
  const packageJson = await fs.readJson(filePath);
  packageJson.name = projectName;
  packageJson.type = "module";
  packageJson.dependencies = {
    ...packageJson.dependencies,
    revine: "latest",
  };

  if (options.useTailwind) {
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      tailwindcss: "^4.0.0",
      "@tailwindcss/vite": "^4.0.0",
    };
  }

  if (options.useShadcn) {
    packageJson.dependencies = {
      ...packageJson.dependencies,
      ...SHADCN_DEPENDENCIES,
    };
  }
  await fs.writeJson(filePath, packageJson, { spaces: 2 });
}
