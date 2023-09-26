import { printHelpers } from "@/utils/helpers/print-tools";
import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { cloneRepository } from "@/utils/helpers/repos/get-repo";
import { mergeOrCreateDirs } from "@/utils/helpers/fs/directories";
import { writeOrOverWriteFile } from "@/utils/helpers/fs/files";
import { TBonitaConfigSchema } from "@/utils/config/bonita";
import { IPackageJson } from "@/utils/helpers/pkg-manager/types";
import { merge } from "remeda";
import { safeJSONParse } from "@/utils/helpers/json/json";
import { loadingSpinner } from "@/utils/helpers/clack/spinner";


export async function setUpRouterTemplate(config: TBonitaConfigSchema) {
  const vite_tanstack_spinnies = loadingSpinner();
  vite_tanstack_spinnies.add("template", { text: "adding tanstack templates" });
  try {
    if (!existsSync("./temp")) {
      await getPagesTemplateDirectory();
    }
    const res = await addTemplateFiles(config);
    await mergePackageJSON();
    await vite_tanstack_spinnies.succeed("template", { text:"tanstack templates added" });

    return res;
  } catch (error: any) {
    await vite_tanstack_spinnies.fail("template", { text: error.message });
    throw new Error(error.message);
  }
}

export async function addTemplateFiles(config: TBonitaConfigSchema) {
  try {
    await mergeOrCreateDirs(
      "./temp/src/pages",
      config.vite_tanstack?.pages_dir_path ?? "./src/pages",
    );
    await mergeOrCreateDirs("./temp/src/state", config.state??"./src/state");
    await mergeOrCreateDirs("./temp/src/components", config.components??"./src/components");
    await writeOrOverWriteFile(
      config.vite_tanstack?.src_root_path ?? "./src/main.tsx",
      "./temp/src/main.tsx",
    );
    await writeOrOverWriteFile(
      config.vite_tanstack?.src_app_path ?? "./src/App.tsx",
      "./temp/src/App.tsx",
    );

    return "templates added";
  } catch (error: any) {
    printHelpers.error("error getting pages template " + error.message);
    throw error;
  }
}

export async function getPagesTemplateDirectory() {
  const vite_tanstack_spinnies = loadingSpinner();
  await vite_tanstack_spinnies.add("clone", {
    text: "cloning tanstack templates",
  });
  try {
    const template_dir = await cloneRepository(
      "https://github.com/tigawanna/tanstack-router-vite-react",
      "./temp",
    );
    await vite_tanstack_spinnies.succeed("clone", { text: template_dir });
    return template_dir;
  } catch (error: any) {
    await vite_tanstack_spinnies.succeed("clone", { text: error.message });
    throw error;
  }
}

export async function mergePackageJSON() {
  try {
    const temp_pkg_json = await safeJSONParse<IPackageJson>(
      await readFile("./temp/package.json", "utf-8"),
    );
    const project_pkg_json = await safeJSONParse<IPackageJson>(
      await readFile("./package.json", "utf-8"),
    );
    const new_pkg_json_deps = merge(
      project_pkg_json.dependencies,
      temp_pkg_json.dependencies,
    );
    const new_pkg_json_dev_deps = merge(
      project_pkg_json.devDependencies,
      temp_pkg_json.devDependencies,
    );
    const new_pkg_json = {
      ...project_pkg_json,
      dependencies: new_pkg_json_deps,
      devDependencies: new_pkg_json_dev_deps,
    };

    await writeFile("./package.json", JSON.stringify(new_pkg_json, null, 2), {
      encoding: "utf-8",
    });
    return new_pkg_json;
  } catch (error: any) {
    printHelpers.error("error merging package jsons " + error.message);
    throw error;
  }
}

// setUpPagesTemplate()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
