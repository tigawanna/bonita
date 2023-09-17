import { detect } from "@antfu/ni";
import { execa } from "execa";
import { printHelpers } from "../print-tools";
import { loadingSpinner } from "../clack/spinner";
import { confirmPrompt, selectPrompt } from "../clack/prompts";



export async function getPackageManager(
  targetDir: string,
): Promise<"yarn" | "pnpm" | "bun" | "npm"> {
  const packageManager = await detect({ programmatic: true, cwd: targetDir });

  if (packageManager === "yarn@berry") return "yarn";
  if (packageManager === "pnpm@6") return "pnpm";
  if (packageManager === "bun") return "bun";

return packageManager ?? "npm";
}

export function packageExecCommand(
  packageManager: "yarn" | "pnpm" | "bun" | "npm",
) {
  switch (packageManager) {
    case "yarn":
      return "yarn";
    case "pnpm":
      return "pnpm dlx";
    case "bun":
      return "bunx";
    case "npm":
      return "npx";
  }
}

/**
 * Installs packages.
 *
 * @param {string[]} packages - The list of packages to install.
 * @example installPackages(["-D","tailwindcss","postcss","autoprefixer"]);
 * will run npm/pnpm/bun/yarn install -D tailwindcss, postcss and autoprefixer
 * @return {Promise<void>} A Promise that resolves when the installation is complete.
 */
export async function installPackages(packages: string[]) {
  try {
    const packageManager = await getPackageManager("./");
    const installing_pkgs_spinners = loadingSpinner();
    installing_pkgs_spinners.add("main", {
      text: packageManager + " install " + " " + packages.join(" "),
    });
    const install_package_list = packages.join(" ") === "" ? ["install"] : ["install", ...packages]
    await execa(packageManager, install_package_list)
      .then((res) => {
        installing_pkgs_spinners.succeed("main", { text: res.command });
        printHelpers.info(res.command);
        printHelpers.info(res.stdout);
      })
      .catch((error) => {
        installing_pkgs_spinners.fail("main", { text: error.message });
        // process.exit(1);
        throw new Error("error installing "+error.message);
      });
  } catch (error:any) {
    throw new Error("error installing " + error.message);
  }
}
/**
 * Executes a package manager command asynchronously.
 *
 * @param {string[]} input - An array of strings representing the command arguments.
 * @example execPackageManagerCommand(["tsc","--init"]);
 * will execute p/npm/yarn/bun tsc --init
 * @return {Promise<void>} - A promise that resolves when the command is executed successfully.
 */
export async function execPackageManagerCommand(input: string[]) {
  try {
    const packageManager = await getPackageManager("./");
    const executing_spinners = loadingSpinner();
    executing_spinners.add("main", {
      text: packageExecCommand(packageManager) + " " + input.join(" "),
    });
    await execa(packageExecCommand(packageManager), [...input])
      .then((res) => {
        executing_spinners.succeed("main", { text: res.command });
        printHelpers.info(res.command);
        printHelpers.info(res.stdout);
      })
      .catch((error) => {
        executing_spinners.fail("main", { text: error.message });
        // printHelpers.info(packageExecCommand(packageManager)+ input.join(""));
        process.exit(1);
      });
  } catch (error) {
    process.exit(1);
  }
}




