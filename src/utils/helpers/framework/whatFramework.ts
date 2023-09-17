import kleur from "kleur";
import { IPackageJson } from "../pkg-manager/types";
import { getPkgJson } from "../pkg-json";
import { loadingSpinner } from "../clack/spinner";

export const supportedFrameworks = [
  "React+Vite",
  "Rakkasjs",
  "Nextjs",
  "RedWood",
  "Others",
] as const;
export type TFrameworkType = (typeof supportedFrameworks)[number];

export function frameworkType(pkg: IPackageJson): TFrameworkType {
  if (pkg.devDependencies?.rakkasjs) {
    return "Rakkasjs";
  } else if (pkg.dependencies?.next) {
    return "Nextjs";
  } else if (pkg.devDependencies?.vite && pkg.dependencies?.react) {
    return "React+Vite";
  } else if (pkg.devDependencies?.["@redwoodjs/core"] || pkg.dependencies?.["@redwoodjs/web"] 
    || pkg.dependencies?.["@redwoodjs/router"] || pkg.dependencies?.["@redwoodjs/forms"]) {
    return "RedWood";
  }
  return "Others";
}

export async function checkFramework() {
  const spinner = loadingSpinner();
  try {
    spinner.add("main", { text: "checking framework" });
    const framework = frameworkType(await getPkgJson());
    spinner.succeed("main", { text:framework + " detected" });
    return framework;
  } catch (error:any) {
    spinner.fail("main", { text: error.message });
    throw error;
  }
}
