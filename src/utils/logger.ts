import chalk from "chalk";
import boxen from "boxen";
import os from "os";

export function logInfo(message: string) {
  console.log(chalk.cyan(message));
}

export function logError(message: string, error?: any) {
  console.error(chalk.red(message), error || "");
}

export function logStep(message: string) {
  console.log(`${chalk.cyan("⚡")} ${message}`);
}

export function logSuccess(message: string) {
  console.log(`${chalk.green("✔")} ${message}`);
}

export function printDevServerInfo(version: string, port: number, startTime: number) {
  const duration = Date.now() - startTime;
  const localUrl = `http://localhost:${port}/`;
  
  const networkInterfaces = os.networkInterfaces();
  const networkUrls: string[] = [];
  
  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    if (interfaces) {
      for (const iface of interfaces) {
        if (iface.family === "IPv4" && !iface.internal) {
          networkUrls.push(`http://${iface.address}:${port}/`);
        }
      }
    }
  }

  const content = [
    `${chalk.bold.cyan("REVINE")} ${chalk.dim(`v${version}`)}`,
    "",
    `${chalk.white("➜")}  ${chalk.bold("Local:")}   ${chalk.cyan(localUrl)}`,
    ...networkUrls.map(url => `${chalk.white("➜")}  ${chalk.bold("Network:")} ${chalk.cyan(url)}`),
    "",
    `${chalk.dim("Ready in")} ${chalk.bold.white(duration)}${chalk.dim("ms")}`,
  ].join("\n");

  const boxed = boxen(content, {
    padding: 1,
    margin: { top: 1, bottom: 1, left: 0, right: 0 },
    borderStyle: "round",
    borderColor: "dim",
    title: chalk.bold.white(" DEV SERVER "),
    titleAlignment: "left",
  });

  console.log("\n" + boxed + "\n");
}
