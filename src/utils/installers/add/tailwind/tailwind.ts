import { TBonitaConfigSchema } from "@/utils/config/config";
import {  addTailwindDeps, addTailwindPostcssConfig } from "#/src/utils/installers/add/tailwind/config_tw";
import { validateRelativePath } from "@/utils/helpers/strings/general";
import { promptForTWConfig } from "../../../config/prompts/tailwind";
import { z } from "zod";
import { printHelpers } from "@/utils/helpers/print-tools";
import { addBaseTWcss } from "./add-base-css";


// Define the tailwind schema
export const tailwindSchema = z.object({
  tw_config: z.string().default("tailwind.config.js"),
  tw_plugins: z.array(z.string()).default([]),
});

export type TTailwindConfigSchema = z.infer<typeof tailwindSchema>;


export async function installTailwind(bonita_config: TBonitaConfigSchema) {
try {
    const config = await promptForTWConfig(bonita_config);
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
