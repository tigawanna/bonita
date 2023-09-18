import { existsSync, readFileSync } from "fs";
import { z } from "zod";
import { tailwindSchema } from "../installers/add/tailwind/tailwind";
import { pandaSchema } from "../installers/add/panda/panda";
import { supportedFrameworks } from "../helpers/framework/whatFramework";
import { writeFile } from "fs/promises";
import { printHelpers } from "../helpers/print-tools";
import { tanstackViteReactSchema } from "../installers/tanstack/vite/vite-spa";
import { removeDirectory } from "../helpers/fs/directories";
import { nextjsReactSchema } from "../installers/tanstack/nextjs/next";
import { promptForConfig } from "./prompts/main";
import { loadingSpinner } from "../helpers/clack/spinner";

// const frameworkEnums = ["React+Vite", "Nextjs"] as const;

export const bonitaConfigSchema = z.object({
  root_dir: z.string().default("./src"),
  root_styles: z.string().default("./src/index.css"),
  root_file: z.string().default("./src/main.ts"),
  state: z.string().default("./src/state"),
  components: z.string().default("./src/components"),
  framework: z.enum(supportedFrameworks),
  tailwind: tailwindSchema.optional(),
  panda: pandaSchema.optional(),
  vite_tanstack: tanstackViteReactSchema.optional(),
  next_config: nextjsReactSchema.optional(),
});

export type TBonitaConfigSchema = z.infer<typeof bonitaConfigSchema>;

export async function getBonitaConfig() {
  try {
    if (existsSync("./bonita.config.json")) {
      const bonita_config_file = JSON.parse(
        readFileSync("./bonita.config.json").toString(),
      );
      const bonita_config = bonitaConfigSchema.parse(bonita_config_file);
      if (bonita_config) {
        return bonita_config;
      } else {
        return await promptForConfig();
      }
    } else {
      return await promptForConfig();
    }
  } catch (error) {
    printHelpers.warning("corrupt bonita config attempting to reset");
    await removeDirectory("./bonita.config.json");
    printHelpers.error("error getting bonita config , try again");
    process.exit(1);
  }
}

export async function saveConfig(config: TBonitaConfigSchema) {
  const save_config_loader = loadingSpinner();
  save_config_loader.add("saved config", { text: "saving config" });
  writeFile("./bonita.config.json", JSON.stringify(config, null, 2)).catch(
    (err) => {
      printHelpers.error("error saving config ", err.message);
      printHelpers.warning("Bonita config :", config);
      save_config_loader.fail("saved config",{text:"error saving config " + err.message});
    },
  );

  save_config_loader.succeed("saved config", { text: "saved config" });
}
