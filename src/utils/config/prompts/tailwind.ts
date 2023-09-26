import { existsSync } from "fs";
import { textPrompt } from "@/utils/helpers/clack/prompts";
import { z } from "zod";
import { TBonitaOptions } from "@/utils/config/bonita";
import { TBonitaConfigSchema } from "@/utils/config/bonita";
import { saveConfig } from "@/utils/config/helpers";



// Define the tailwind schema
export const tailwindSchema = z.object({
  tw_config: z.string().default("tailwind.config.js"),
  tw_plugins: z.array(z.string()).default([]),
});

export type TTailwindConfigSchema = z.infer<typeof tailwindSchema>;

export async function promptForTWConfig(config: TBonitaConfigSchema,options?:TBonitaOptions) {
  try {
    if (config && config.tailwind && "tw_config" in config.tailwind) {
      return {
        ...config,
        tailwind: {
          tw_config: config.tailwind.tw_config ?? "tailwind.config.js",
          tw_plugins: config.tailwind.tw_plugins ?? [],
        },
      };
    }
    const answers: TTailwindConfigSchema = {
      tw_config:options?.twConfig??await textPrompt({
          message: "Where do you want to add your tailwind config file",
          initialValue: existsSync("tailwind.config.ts")?"tailwind.config.ts":"tailwind.config.js",
        }),
      tw_plugins:options?.plugins??await  textPrompt({
        message: "Want some plugins?",
        initialValue: "daisyui,tailwindcss-animate",
      }).then((value) => value.split(","))

    };

 
    
    const new_config = {
      ...config,
      tailwind: answers,
    };

    await saveConfig(new_config);
    // printHelpers.debug("new_config saved", new_config);
    return new_config;
  } catch (error: any) {
    throw new Error("error prompting for tailwind config " + error.message);
  }
}
