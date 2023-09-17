import fs from "fs";
import kleur from "kleur";
import { printHelpers } from "@/utils/helpers/print-tools";
import { TBonitaConfigSchema } from "@/utils/config/config";
import { promptForTanstackConfig } from "@/utils/config/prompts/vite-tanstack";

import { removeDirectory } from "@/utils/helpers/fs/directories";
import {
  tanstackRouteConfigTempalte,
  tanstackRouteLayoutTempalte,
  tanstackRoutePageTempalte,
  updatetanstackConfig,
} from "./templates";
import { confirmPrompt } from "@/utils/helpers/clack/prompts";


export async function addNewtanstackPage(
  pages: string[],
  bonita_config: TBonitaConfigSchema,
) {
  try {
    if (!pages[0]) {
      throw new Error("Page name is missing!");
    }
    const config = await promptForTanstackConfig(bonita_config);
    const dir_name = pages[0].toLowerCase();
    printHelpers.info("dir name ", dir_name);

    const dir_path = config.vite_tanstack.pages_dir_path + `/${dir_name}`;
    
    if (fs.existsSync(dir_path)) {
      printHelpers.warning(
        kleur.red(`Error: directory ${dir_name} already exists!`),
      );
      const overwrite_consent = await confirmPrompt({
        message: "Do you want to overwrite it?",
        initialValue: true,
      });

      if (!overwrite_consent) {
        // process.exit(1);
        return
      }
      await removeDirectory(dir_path);
    }
    // create directory
    fs.mkdirSync(dir_path);
    // await removeDirectory(dir_path)
    await tanstackRouteLayoutTempalte(dir_name, dir_path);
    await tanstackRoutePageTempalte(dir_name, dir_path);
    await tanstackRouteConfigTempalte(dir_name, dir_path);
    await updatetanstackConfig(bonita_config, dir_name);
  } catch (error: any) {
    printHelpers.error("error creating page " + error.message);
    throw error;
  }
}
