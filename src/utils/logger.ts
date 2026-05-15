import chalk from "chalk";
import boxen from "boxen";
import os from "os";
import gradient from "gradient-string";

export function logInfo(message: string) {
  console.log(chalk.cyan(message));
}

export function logError(message: string, error?: any) {
  console.error(chalk.red(message), error || "");
}

const revineGradient = gradient(["#7c3aed", "#a78bfa", "#f472b6"]);

export function logBrand() {
  console.log(chalk.bold(revineGradient("\n  ◆ REVINE\n")));
}

export function getLogo() {
  return chalk.bold(revineGradient.multiline([
    "  ____  _______   _____ _   _  _____ ",
    " |  _ \\| ____\\ \\ / /_ _| \\ | || ____|",
    " | |_) |  _|  \\ V / | ||  \\| ||  _|  ",
    " |  _ <| |___  \\ /  | || |\\  || |___ ",
    " |_| \\_\\_____|  \\_/ |___|_| \\_||_____|"
  ].join("\n")));
}

export function logStep(message: string) {
  console.log(`${revineGradient("⚡")} ${message}`);
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

  const logo = getLogo();

  const content = [
    logo,
    "",
    `${chalk.dim("Framework Version:")} ${chalk.bold.white(`v${version}`)}`,
    "",
    `${chalk.cyan("➜")}  ${chalk.bold("Local:")}   ${chalk.blue(localUrl)}`,
    ...networkUrls.map(url => `${chalk.cyan("➜")}  ${chalk.bold("Network:")} ${chalk.blue(url)}`),
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
