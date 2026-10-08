import inquirer from "inquirer";

export default async function askForShadcnSetup(): Promise<boolean> {
  const { useShadcn } = await inquirer.prompt([
    {
      type: "confirm",
      name: "useShadcn",
      message: "Would you like to set up shadcn/ui?",
      default: true,
    },
  ]);
  return useShadcn;
}