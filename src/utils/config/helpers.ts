import { writeFile } from "fs/promises";
import { printHelpers } from "@/utils/helpers/print-tools";
import { loadingSpinner } from "@/utils//helpers/clack/spinner";
import { TBonitaConfigSchema, TBonitaOptions, getSavedbonitaConfig } from "@/utils/config/bonita";

import { outro } from "@clack/prompts";
import { confirmPrompt } from "@/utils/helpers/clack/prompts";
import { installPackages } from "@/utils/helpers/pkg-manager/package-managers";


// const frameworkEnums = ["React+Vite", "Nextjs"] as const;




export async function saveConfig(config: TBonitaConfigSchema) {
  const save_config_loader = loadingSpinner();
  save_config_loader.add("saved config", { text: "saving config" });
  writeFile("./bonita.config.json", JSON.stringify(config, null, 2)).catch(
    (err) => {
      printHelpers.error("error saving config ", err.message);
      printHelpers.warning("config :", config);
      save_config_loader.fail("saved config",{text:"error saving config " + err.message});
    },
  );

  save_config_loader.succeed("saved config", { text: "saved config" });
}


export async function promptToInstall(options?: TBonitaOptions) {

  try {
    if (!options?.yes) {
      const consent = await confirmPrompt({
        message: "Do you want to install the dependencies now ?",
        initialValue: true,
      })
      if (!consent) {
        outro("stay bonita");
        process.exit(1)
      }
    }

    await installPackages([""]);

  } catch (error: any) {
    return
  }
}



