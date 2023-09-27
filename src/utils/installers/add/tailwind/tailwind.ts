import { validateRelativePath } from "@/utils/helpers/strings/general";
import { printHelpers } from "@/utils/helpers/print-tools";
import { addTailwindConfig, addTailwindDeps, addTailwindPostcssConfig } from "#/src/utils/installers/add/tailwind/config_tw";
import { addBaseTWcss } from "#/src/utils/installers/add/tailwind/add-base-css";
import { TBonitaOptions } from "@/utils/config/bonita";
import { TBonitaConfigSchema } from "#/src/utils/config/bonita";
import { promptForTWConfig } from "#/src/utils/config/prompts/tailwind";


export interface IInstallTailwin{
  bonita_config: TBonitaConfigSchema;
  options: TBonitaOptions
}

export async function installTailwind({bonita_config,options}:IInstallTailwin) {
try {
    const config = await promptForTWConfig(bonita_config,options);
    const root_styles = validateRelativePath(config.root_styles);
    await addBaseTWcss(root_styles)
    await addTailwindConfig(config,options);
    await addTailwindPostcssConfig();
    await addTailwindDeps(config)


    } catch (error: any) {
    // tailwind_spinners.fail("main");
    printHelpers.error("Error installing Tailwind  :\n" + error.message);
   // process.exit(1);
  }
}
