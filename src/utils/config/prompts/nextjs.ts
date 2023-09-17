import { TBonitaConfigSchema, saveConfig } from "@/utils/config/config";
import { TNextjsReactConfigSchema } from "@/utils/installers/tanstack/nextjs/next";
import { confirmPrompt } from "@/utils/helpers/clack/prompts";

export async function promptForNextjsConfig(config: TBonitaConfigSchema) {
  try {
    if (config && config.next_config) {
      return {
        ...config,
        next_config: config.next_config,
      };
    }
    const answers: TNextjsReactConfigSchema = {
      src_dir: await confirmPrompt({
          message: "Use src directory?",
          initialValue: true,
        }),
    };
    const new_config = {
      ...config,
      next_config: answers,
    };
    saveConfig(new_config);
    return new_config;
  } catch (error: any) {
    throw new Error("error prompting for panda config " + error.message);
  }
}
