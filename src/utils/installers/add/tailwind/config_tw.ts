import { writeFile } from "fs/promises";
import { postcss_templlate, tailwind_config_template, updateTwPlugins } from "./templates";
import { safeJSONParse } from "@/utils/helpers/json/json";
import { printHelpers } from "@/utils/helpers/print-tools";
import { IPackageJson } from "@/utils/helpers/pkg-manager/types";
import { getPkgJson } from "@/utils/helpers/pkg-json";
import { merge } from "remeda";
import { validateRelativePath } from "@/utils/helpers/strings/general";
import { TBonitaConfigSchema } from "@/utils/config/config";
import { promptForTWConfig } from "../../../config/prompts/tailwind";
import { checkFramework } from "@/utils/helpers/framework/whatFramework";
import depsjson from "#/deps.json"
import { loadingSpinner } from "@/utils/helpers/clack/spinner";
import { filterObjectWithArray } from "../../../helpers/objects/filter";






export async function getPkgJsonTailwindDeps() {
  const spinnie = loadingSpinner();
  spinnie.add("fetching", { text: "checking latest tailwind versions" });
  const url = `https://github.com/tailwindlabs/tailwindcss.com/raw/master/package.json`;
  const headers = {
    Accept: "application/json",
  };
  return fetch(url, { headers })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.text();
    })
    .then((data) => {
      spinnie.succeed("fetching", { text: "latest tailwind versions" });
      const pkg_json = safeJSONParse<IPackageJson>(data);
      return pkg_json;
    })
    .catch((error) => {
      spinnie.fail("fetching", { text: error.message });
      printHelpers.error(error);
      throw error;
    });
}




export async function addTailwindDeps(config: TBonitaConfigSchema) {
  const spinnies = loadingSpinner();
  spinnies.add("adding_deps", { text: "adding tailwind deps" });
  try {
    const pkg_json = await getPkgJson();
    // console.log("deps.json in addTailwindDeps === ",depsjson)
    const tw_deps_json = depsjson.tailwind
    const default_tailwind_dependancies = ["autoprefixer", "postcss", "tailwindcss"]
    const all_dependancies = [config.tailwind?.tw_plugins!, default_tailwind_dependancies].flat()

    const main_deps = filterObjectWithArray(tw_deps_json.main, all_dependancies)
    const dev_deps = filterObjectWithArray(tw_deps_json.dev, all_dependancies)

    const new_deps = merge(pkg_json.dependencies, main_deps)
    const new_dev_deps = merge(pkg_json.devDependencies, dev_deps)

    pkg_json.dependencies = new_deps;
    pkg_json.devDependencies = new_dev_deps
    
    await writeFile("./package.json", JSON.stringify(pkg_json, null, 2), "utf8");
    spinnies.succeed("adding_deps", { text: "added tailwind deps \n " +
     "  rememnder to import your css into your root file: " + config.root_file });
  } catch (error: any) {
    spinnies.fail("adding_deps",{ text: error.message });
    throw new Error("error adding tailwind deps \n"+error.message);
  }
}



export async function addTailwindConfig(bonita_config: TBonitaConfigSchema){
 const spinner= loadingSpinner();

  try {
  const config = await promptForTWConfig(bonita_config);
  const tw_config_path = validateRelativePath(config.tailwind?.tw_config);
  const tw_plugins = config.tailwind?.tw_plugins;
  spinner.add("tw_config",{text: "adding tailwind config..."});


  if (tw_plugins && tw_plugins?.length > 0) {
    const tw_config_with_plugins = updateTwPlugins(tw_plugins);
      await writeFile(tw_config_path, tw_config_with_plugins)
    } else {
    await writeFile(tw_config_path, tailwind_config_template)
    
  }

    spinner.succeed("tw_config",{text: "added tailwind config"});
  // tailwind_init_config_spinners.succeed("tw_config");
  } catch (error:any) {
  // tailwind_init_config_spinners.fail("tw_config",{text: error.message});
    spinner.fail("tw_config", { text: error.message });
  throw new Error("Error adding tailwind config:\n" + error.message)
}
}

export async function addTailwindPostcssConfig() {
  const tailwind_config_spinners = loadingSpinner();
  tailwind_config_spinners.add("postcss_config", { text: "adding postcss config"});
try {
  const post_css_path = await checkFramework() === "RedWood" ? "postcss.config.mjs" :"postcss.config.js";
  await writeFile(post_css_path, postcss_templlate)
  tailwind_config_spinners.succeed("postcss_config", { text: "added postcss config" });
} catch (error:any) {
  tailwind_config_spinners.fail("postcss_config", { text: error.message });
  printHelpers.error("Error adding tw postcss config  :\n" + error.message);
  printHelpers.info("try adding manually and try again");
  printHelpers.info(postcss_templlate);
  throw new Error("Error adding postcss.config :\n" + error.message)
}
}



// export async function tailwindInit(bonita_config:TBonitaConfigSchema){
// try {
//   // await addTailwindConfig(bonita_config);
//   await addTailwindPostcssConfig();

// } catch (error: any) {
// throw new Error("Error running tailwind init :\n" + error.message)
// }
// }
