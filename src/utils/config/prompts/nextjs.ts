import { TBonitaConfigSchema, TBonitaOptions } from "@/utils/config/bonita"
import { saveConfig } from "@/utils/config/helpers"
import { confirmPrompt } from "@/utils/helpers/clack/prompts";
import { z } from "zod";

export const nextjsReactSchema = z.object({
  src_dir: z.boolean().default(true),
});

export type TNextjsReactConfigSchema = z.infer<typeof nextjsReactSchema>;

export async function promptForNextjsConfig(config: TBonitaConfigSchema,options:TBonitaOptions) {
  try {
    // if (config && config.next_config) {
    //   return {
    //     ...config,
    //     next_config: config.next_config,
    //   };
    // }
    const answers: TNextjsReactConfigSchema = {
      src_dir: config.next_config?.src_dir??await confirmPrompt({
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
