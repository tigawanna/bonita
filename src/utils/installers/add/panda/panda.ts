import { TBonitaConfigSchema } from "@/utils/config/config";
import { validateRelativePath } from "@/utils/helpers/strings/general";
import { promptForPandaConfig } from "../../../config/prompts/panda";
import { z } from "zod";
import { printHelpers } from "@/utils/helpers/print-tools";
import { addBasePandacss, addPandaDeps, pandaInit } from "./config_panda";


// Define the tailwind schema
export const pandaSchema = z.object({
  panda_config_path: z.string().default("panda.config.ts"),
});

export type TPandaConfigSchema = z.infer<typeof pandaSchema>;

export async function installPanda(bonita_config: TBonitaConfigSchema) {

  try {
    const config = await promptForPandaConfig(bonita_config);
    const root_styles = validateRelativePath(config.root_styles);

    await pandaInit(bonita_config)
    await addBasePandacss(root_styles)
    await addPandaDeps()
  } catch (error: any) {
      printHelpers.error("Error installing pandacss  :\n" + error.message);
      // throw error;
    // process.exit(1);
  }
}
