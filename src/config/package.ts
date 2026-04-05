import fs from "fs-extra";

interface UpdatePackageOptions {
  useTailwind?: boolean;
}

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
  await fs.writeJson(filePath, packageJson, { spaces: 2 });
}
