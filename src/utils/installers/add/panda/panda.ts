import { validateRelativePath } from "@/utils/helpers/strings/general";
import { z } from "zod";
import { printHelpers } from "@/utils/helpers/print-tools";
import { addBasePandacss, addPandaDeps, pandaInit } from "./config_panda";
import { promptForPandaConfig } from "#/src/utils/config/prompts/panda";
import { TBonitaConfigSchema, TBonitaOptions } from "#/src/utils/config/bonita";



// Define the tailwind schema
export const pandaSchema = z.object({
  panda_config_path: z.string().default("panda.config.ts").optional(),
});

export type TPandaConfigSchema = z.infer<typeof pandaSchema>;

export interface IInstallPanda {
  bonita_config: TBonitaConfigSchema;
  options:TBonitaOptions
}

export async function installPanda({bonita_config,options}:IInstallPanda) {

  try {
    const config = await promptForPandaConfig(bonita_config,options);
    if(!config?.root_styles){
      throw new Error("root_styles path not found")
    }
    const root_styles = validateRelativePath(config?.root_styles);
  await pandaInit(bonita_config)
    await addBasePandacss(root_styles)
    await addPandaDeps()
  } catch (error: any) {
      printHelpers.error("Error installing pandacss  :\n" + error.message);
      // throw error;
    // process.exit(1);
  }
}
