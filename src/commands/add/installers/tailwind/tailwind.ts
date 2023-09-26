import { validateRelativePath } from "@/utils/helpers/strings/general";
import { z } from "zod";
import { printHelpers } from "@/utils/helpers/print-tools";
import { addTailwindDeps, addTailwindPostcssConfig } from "@/commands/add/installers/tailwind/config_tw";
import { addBaseTWcss } from "@/commands/add/installers/tailwind/add-base-css";
import { TAddOptions } from "@/commands/add/add-commnad-args";
import { TBonitaConfigSchema } from "#/src/utils/config/bonita";
import { promptForTWConfig } from "#/src/utils/config/prompts/tailwind";


// Define the tailwind schema
export const tailwindSchema = z.object({
  tw_config: z.string().default("tailwind.config.js"),
  tw_plugins: z.array(z.string()).default([]),
});

export type TTailwindConfigSchema = z.infer<typeof tailwindSchema>;

export interface IInstallTailwin{
  bonita_config: TBonitaConfigSchema;
  options?: TAddOptions
}

export async function installTailwind({bonita_config,options}:IInstallTailwin) {
try {
    const config = await promptForTWConfig(bonita_config,options);
    const root_styles = validateRelativePath(config.root_styles);
    await addBaseTWcss(root_styles)
    await addTailwindPostcssConfig();
    await addTailwindDeps(config)


    } catch (error: any) {
    // tailwind_spinners.fail("main");
    printHelpers.error("Error installing Tailwind  :\n" + error.message);
   // process.exit(1);
  }
}
