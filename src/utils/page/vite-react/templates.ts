import { writeFile } from "fs/promises";
import { pascal } from "radash";
import fs from "fs";
import { TBonitaConfigSchema } from "@/utils/config/config";
import { promptForTanstackConfig } from "@/utils/config/prompts/vite-tanstack";
import { loadingSpinner } from "../../helpers/clack/spinner";

export async function tanstackRouteLayoutTempalte(
  dir_name: string,
  dir_path: string,
) {
  const dirName = pascal(dir_name);
  const spinnies = loadingSpinner();
  spinnies.add("config", {
    text: `Adding ${dirName}Layout` + dirName,
  });
  const layoutContent = `import { Outlet, Link } from "@tanstack/router";

interface ${dirName}LayoutProps {}

export function ${dirName}Layout({}: ${dirName}LayoutProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Outlet />
    </div>
  );
}`;
  try {
    await writeFile(`${dir_path}/${dirName}Layout.tsx`, layoutContent, {
      encoding: "utf-8",
    });
    spinnies.succeed("config", { text: "added " + dirName + "Layout" });
    return {
      dirName,
      layoutContent,
    };
  } catch (error: any) {
    spinnies.fail("config", { text: error.message });
    throw error;
  }
}
export async function tanstackRoutePageTempalte(
  dir_name: string,
  dir_path: string,
) {
  const dirName = pascal(dir_name);
  const spinnies = loadingSpinner();
  spinnies.add("config", {
    text: `Adding ${dirName} page` + dirName,
  });
  const routeContent = `interface ${dirName}Props {}

export function ${dirName}({}: ${dirName}Props) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-[30%]">${dirName}</div>
    </div>
  );
}`;
  try {
    await writeFile(`${dir_path}/${dirName}.tsx`, routeContent, {
      encoding: "utf-8",
    });
    spinnies.succeed("config", { text: "added " + dirName });
    return {
      dirName,
      routeContent,
    };
  } catch (error: any) {
    spinnies.fail("config", { text: error.message });
    throw error;
  }
}

export async function tanstackRouteConfigTempalte(
  dir_name: string,
  dir_path: string,
) {
  const dirName = pascal(dir_name);
  const spinnies = loadingSpinner();
  spinnies.add("config", {
    text: "updating config for " + dirName});
  const configContent = `import { rootLayout } from "@/main";;
import { Route } from "@tanstack/router";
import { ${dirName} } from "./${dirName}";
import { ${dirName}Layout } from "./${dirName}Layout";

//${dirName} route layout
const ${dirName}RouteLayout = new Route({
    getParentRoute: () => rootLayout,
    path: "/${dirName}",
    component: ${dirName}Layout,
});

//${dirName} default route
const ${dirName}IndexRoute = new Route({
    getParentRoute: () => ${dirName}RouteLayout,
    path: "/",
    component: ${dirName},
});


export const ${dir_name.toLowerCase()}Route = ${dirName}RouteLayout.addChildren([
    ${dirName}IndexRoute,
])`;
  try {
    await writeFile(`${dir_path}/config.ts`, configContent);
    spinnies.succeed("config", { text: "updated config for " + dirName });
    return {
      dirName,
      configContent,
    };
  } catch (error: any) {
    spinnies.fail("config", { text: error.message });
    throw error;
  }
}

export async function updatetanstackConfig(
  bonita_config: TBonitaConfigSchema,
  dir_name: string,
) {
  const lowercase_dirName = dir_name.toLowerCase();
  const spinnies = loadingSpinner();
  spinnies.add("updating", { text: `updating ${dir_name} path config` });
  try {
    const config = await promptForTanstackConfig(bonita_config);
    const tanstack_config = config.vite_tanstack;
    const filePath = tanstack_config.routes_path;
    const targetLine = "// ADD NEW IMPORT HERE";
    const newLine = `import { ${lowercase_dirName}Route } from "@/pages/${lowercase_dirName}/config";`;
    const targetArrayLine = "export const routes = [";
    const newArrayLine = `${lowercase_dirName}Route,`;

    fs.readFile(filePath, "utf-8", (err, content) => {
      if (err) throw err;

      const lines = content.split("\n");

      const targetIndex = lines.findIndex((line) => line.includes(targetLine));
      if (targetIndex === -1) {
        console.error(`Target line '${targetLine}' not found`);
        return;
      }

      // add route import statement
      lines.splice(targetIndex, 0, newLine);

      // check for routes array
      const targetArrayIndex = lines.findIndex((line) =>
        line.includes(targetArrayLine),
      );
      if (targetArrayIndex === -1) {
        console.error(`Target line '${targetArrayLine}' not found`);
        return;
      }
      // add new route into array
      lines.splice(targetArrayIndex + 1, 0, newArrayLine);

      const finalContent = lines.join("\n");

      fs.writeFile(filePath, finalContent, "utf-8", (err) => {
        if (err) throw err;
        // console.log(
        //   `Added new line '${newLine}' above line '${targetLine}' in file '${filePath}'`
        // );
      });
      spinnies.succeed("updating", { text: `updated ${dir_name} path config` });
    });
  } catch (error: any) {
    spinnies.fail("updating", { text: error.message });
    throw error;
  }
}
