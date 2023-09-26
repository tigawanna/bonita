import { z } from "zod";
import { promptForTanstackConfig } from "../../../config/prompts/vite-tanstack";
import { setUpRouterTemplate } from "../helpers";
import { addViteTSPathAlias } from "@/utils/helpers/config/vite";
import { removeDirectory } from "@/utils/helpers/fs/directories";
import { getDepsJson, getPkgJson } from "@/utils/helpers/pkg-json";
import { merge } from "remeda";
import { writeFile } from "fs/promises";
import { confirmPrompt } from "#/src/utils/helpers/clack/prompts";
import { loadingSpinner } from "#/src/utils/helpers/clack/spinner";
import { TBonitaConfigSchema } from "#/src/utils/config/bonita";
import { TBonitaOptions } from "#/src/utils/config/bonita";

// Define the tailwind schema
export const tanstackViteReactSchema = z.object({
  src_root_path: z.string().default("./src/main.tsx"),
  src_app_path: z.string().default("./src/App.tsx"),
  pages_dir_path: z.string().default("./src/pages"),
  routes_path: z.string().default("./src/pages/routes/routes.ts"),
});

export type TTanstckViteReactConfigSchema = z.infer<
  typeof tanstackViteReactSchema
>;

export async function addTanstackToVite(bonita_config: TBonitaConfigSchema,options?:TBonitaOptions) {
  try {
    //  install dependencies
    const config = await promptForTanstackConfig(bonita_config);
    if(!options?.yes){
    const consent = await confirmPrompt({
      message: `This will overwrite ${JSON.stringify(
        bonita_config.vite_tanstack,
      )} Do you want to continue?`,
      initialValue: true,
    });
if (!consent) {
     return
    }
  }
    await setUpRouterTemplate(config);
    await addViteTSPathAlias();
    await removeDirectory("./temp");
    await addTanstackViteReactDeps()

   
  } catch (error: any) {
    // process.exit(1);
    throw new Error("error adding tanstack to vite "+error.message);
  }
}


export async function addTanstackViteReactDeps() {
  const spinnies = loadingSpinner()
  try {
    spinnies.add("fetching", { text: "adding tanstack deps" });
    const pkg_json = await getPkgJson();
    if(!pkg_json){
      throw new Error("package.json not found")
    }
    const tan_deps_json = (await getDepsJson()).tanstack
    const new_deps = merge(pkg_json.dependencies, tan_deps_json.main)
    const new_dev_deps = merge(pkg_json.devDependencies, tan_deps_json.dev)
    pkg_json.dependencies = new_deps;
    pkg_json.devDependencies = new_dev_deps

    await writeFile("./package.json", JSON.stringify(pkg_json, null, 2), "utf8");
    spinnies.succeed("fetching", { text: "added tanstack deps" });
  } catch (error:any) {
    spinnies.fail("fetching", { text: error.message });
    throw error;
  }
}
