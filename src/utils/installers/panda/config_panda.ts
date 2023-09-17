import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { addPandaScript, panda_base_css, panda_config_template } from "./templates";
import { getDepsJson, getPkgJson } from "@/utils/helpers/pkg-json";
import { merge } from "remeda";
import { printHelpers } from "@/utils/helpers/print-tools";
import { validateRelativePath } from "@/utils/helpers/strings/general";
import { TBonitaConfigSchema } from "@/utils/config/config";
import { promptForPandaConfig } from "@/utils/config/prompts/panda";
import { loadingSpinner } from "../../helpers/clack/spinner";



export async function addBasePandacss(inde_styles_path: string) {
  const panda_base_spinners = loadingSpinner();
  panda_base_spinners.add("base-styles", { text: "adding base styles" });
  try {
    const index_css_exists = await existsSync(inde_styles_path);
    if (!index_css_exists) {
      panda_base_spinners.succeed("base-styles", { text: "created "+inde_styles_path +" with base styles" });
      return await writeFile(inde_styles_path, panda_base_css);
    }
    const index_css = await readFile(inde_styles_path, { encoding: "utf-8" });
    if (!index_css) {
      panda_base_spinners.succeed("base-styles",{ text: "added base styles " });
      return await writeFile(inde_styles_path, panda_base_css);
    }
    const pandacssRegex = /@layer reset, base, tokens, recipes, utilities;/g;
    const matches = index_css.match(pandacssRegex);
    const containsDirective = matches !== null;
    if (!containsDirective) {
      const new_index_css = panda_base_css + "\n" + index_css;
      panda_base_spinners.succeed("base-styles",{ text: "updated base styles " });
      return writeFile(inde_styles_path, new_index_css);
    }
    panda_base_spinners.succeed("base-styles", { text: "updated base styles " });
    return;
  } catch (error:any) {
    panda_base_spinners.fail("base-styles", { text: error.message });
    throw new Error("Error adding panda base css :\n" + error.message)
  }
}



export async function pandaInit(bonita_config: TBonitaConfigSchema) {
  try{
    const config = bonita_config

    const panda_config_path = validateRelativePath(
      config.panda?.panda_config_path!,
      );
      const panda_prepare_spinners = loadingSpinner();
      panda_prepare_spinners.add("prepare", {
        text: "adding panda prepare script",
      });

    addPandaScript()
      .then(() => {
        panda_prepare_spinners.succeed("prepare", {
          text: "added panda prepare script",
        });
      })
      .catch((error) => {
        printHelpers.error(
          "Error adding panda prepare script  :\n" + error.message,
        );
        printHelpers.info(
          "try instalig them manually into the package.json scripts",
        );
        printHelpers.info(`"prepare": "panda codegen"`);
        panda_prepare_spinners.fail("prepare", { text: error.message });
        throw new Error("Error running panda init :\n" + error.message)
        // process.exit(1);
      });

    
      const panda_config_spinners = loadingSpinner();
    panda_config_spinners.add("config", { text: "adding panda config script" });
    await writeFile(panda_config_path, panda_config_template, "utf8")
      .then((res) => {
        panda_config_spinners.succeed("config", { text: "added panda config" });
        return res;
      })
      .catch((error) => {
        printHelpers.error("Error adding tw config  :\n" + error.message);
        printHelpers.info("try instalig them manually and try again");
        printHelpers.info(panda_config_template);
        panda_config_spinners.fail("config", { text: error.message });
        throw new Error("Error adding panda config :\n" + error.message)
        // process.exit(1);
      });

  }catch(error:any){
    throw new Error("Error running panda init :\n" + error.message)
  }
}





export async function addPandaDeps() {
  const spinnies = loadingSpinner();
  try {
    spinnies.add("main", { text: "adding panda deps" });
    const pkg_json = await getPkgJson();
    const tw_deps_json = await (await getDepsJson()).panda
    const new_deps = merge(pkg_json.dependencies, tw_deps_json.main)
    const new_dev_deps = merge(pkg_json.devDependencies, tw_deps_json.dev)
    // printHelpers.info("new deps ==", new_deps);
    // printHelpers.info("new dev deps ==", new_dev_deps);

    pkg_json.dependencies = new_deps;
    pkg_json.devDependencies = new_dev_deps

    await writeFile("./package.json", JSON.stringify(pkg_json, null, 2), "utf8");
    spinnies.succeed("main", { text: "added panda deps" });
  } catch (error:any) {
    spinnies.fail("main",{ text: error.message });
    throw new Error("Error running panda init :\n" + error.message)
  }
}

