import { TPandaConfigSchema } from "#/src/utils/installers/add/panda/panda";
import { textPrompt } from "@/utils/helpers/clack/prompts";
import { TBonitaConfigSchema } from "@/utils/config/bonita"
import { saveConfig } from "@/utils/config/helpers"
import { TBonitaOptions } from "#/src/utils/config/bonita";

export async function promptForPandaConfig(config: TBonitaConfigSchema,options?:TBonitaOptions) {
  try {
    if (config && config.panda && "panda_config_path" in config.panda) {
      return {
        ...config,
        panda: {
          panda_config_path: config.panda.panda_config_path,
        },
      };
    }

    const answers: TPandaConfigSchema = {
      panda_config_path:options?.pandaConfig??
        (await textPrompt({
          message: "Where do you want to add your panda config file",
          initialValue: "panda.config.ts",
        })),
    };
    const new_config = {
      ...config,
      panda: answers,
    };
    saveConfig(new_config);
    return new_config;
  } catch (error: any) {
    throw new Error("error prompting for panda config " + error.message);
  }
}
