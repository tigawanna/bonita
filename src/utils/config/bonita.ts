import { TFrameWorkDefaults, frameworkDefaults } from "@/utils/helpers/framework/framework";
import {
  TFrameworkType,
  checkFramework,
  supportedFrameworks,
} from "@/utils/helpers/framework/whatFramework";
import { selectPrompt, textPrompt } from "@/utils/helpers/clack/prompts";
import { z } from "zod";
import { saveConfig } from "@/utils/config/helpers";
import { tailwindSchema } from "@/utils/config/prompts/tailwind";
import { TAddOptions } from "#/src/commands/add/add-commnad-args";
import { existsSync, readFileSync } from "fs";
import { removeDirectory } from "@/utils/helpers/fs/directories";
import { safeJSONParse } from "@/utils/helpers/json/json";
import { printHelpers } from "@/utils/helpers/print-tools";
import { pandaSchema } from "#/src/commands/add/installers/panda/panda";
import { nextjsReactSchema } from "@/utils/config/prompts/nextjs";




// this is the base bonita config , every other config ffile will be netedunder this 
export const bonitaConfigSchema = z.object({
  root_dir: z.string().default("./src"),
  root_styles: z.string().default("./src/index.css"),
  root_file: z.string().default("./src/main.ts"),
  framework: z.enum(supportedFrameworks),
  tailwind: tailwindSchema.optional(),
  panda: pandaSchema.optional(),
  next_config: nextjsReactSchema.optional(),
});

export type TBonitaConfigSchema = z.infer<typeof bonitaConfigSchema>;



/**
 * Retrieves the bonitaConfig object asynchronously.
 * This will either take the command options and if not present 
 * get the saved config or prompt a new config
 * it will also prompt for ant missing fields from the config
 *
 * @param {TAddOptions} config_options - Optional configuration options
 * @return {Promise<bonitaConfig>} The retrieved bonitaConfig object
 */
export async function getBonitaConfig(config_options?: TAddOptions) {
  try {
    const framework_type = await checkFramework();
    const fw_defaults = frameworkDefaults(framework_type);
    const a_config = config_options ? config_options : await getSavedbonitaConfig();
    const config = await getbonitaConfigOrPrompt({
      config_input: a_config,
      framework_type,
      fw_defaults,
    });
    if (config) {
      saveConfig(config);
    }
    return config;
  } catch (error: any) {
    throw new Error("error prompting for config" + error.message);
  }
}



export interface IGetBonitaConfigOrPromptprops {
  config_input: TAddOptions | TBonitaConfigSchema;
  framework_type?: TFrameworkType;
  fw_defaults?: TFrameWorkDefaults;
}

/**
 * Retrieves the OK CLI configuration object or 
 * prompts the user  if fields are missing.
 *
 * @param {IGetBonitaConfigOrPromptprops} {
 *   config_input,
 *   framework_type,
 *   fw_defaults,
 * } - The input parameters for the function:
 * - config_input: The input configuration object that may contain the OK CLI configuration details.
 * - framework_type: The type of framework.
 * - fw_defaults: The default framework details.
 *
 * @return {Promise<TBonitaConfigSchema>} The OK CLI configuration object.
 */
export async function getbonitaConfigOrPrompt({
  config_input,
  framework_type,
  fw_defaults,
}: IGetBonitaConfigOrPromptprops): Promise<TBonitaConfigSchema> {
  const { root_dir, root_file, root_styles } = fw_defaults || {};

  const config_partial =
    config_input && "root_dir" in config_input
      ? config_input
      : {
          root_dir: config_input?.rootDir,
          root_file: config_input?.rootFile,
          root_styles: config_input?.rootStyles,
          framework: framework_type,
        };
  return {
    root_dir: config_partial?.root_dir ?? await textPrompt({
      message: "root directory ?",
      // defaultValue: root_dir,
      initialValue: root_dir,
    }),
    root_file: config_partial?.root_file ?? await textPrompt({
      message: "root/entry file ?",
      // defaultValue: root_file,
      initialValue: root_file,
    }),
    root_styles: config_partial?.root_styles?? await textPrompt({
      message: "Main css file ?",
      // defaultValue: root_styles,
      initialValue: root_styles,
    }),
    framework: config_partial.framework ?? (await selectPrompt({
      message: "Framework ?",
      options: [
        { value: "React+Vite", label: "React+Vite" },
        { value: "Nextjs", label: "Nextjs" },
        { value: "RedWood", label: "RedWood" },
        { value: "Rakkasjs", label: "Rakkasjs" },
      ],
    })) as TFrameworkType
  };

  // return await getSavedbonitaConfig(config_partial);
}

/**
 * Generates prompts the user for  bonita config 
 * this is the root config where all the other configs will e nested.
 *
 * @return {Promise<TBonitaConfigSchema>} The user's configuration answers.
 * @throws {Error} If there is an error prompting for the configuration.
 */
export async function promptForbonitaConfig() {
  try {
    const framework_type = await checkFramework();
    const { root_dir, root_styles, root_file } = frameworkDefaults(framework_type);
    const answers: TBonitaConfigSchema = {
      root_dir: await textPrompt({
        message: "root directory ?",
        defaultValue: root_dir,
        initialValue: root_dir,
      }),
      root_file: await textPrompt({
        message: "root/entry file ?",
        defaultValue: root_file,
        initialValue: root_file,
      }),

      root_styles: await textPrompt({
        message: "Main css file ?",
        defaultValue: root_styles,
        initialValue: root_styles,
      }),
      framework:
        framework_type ??
        (await selectPrompt({
          message: "Framework ?",
          options: [
            { value: "React+Vite", label: "React+Vite" },
            { value: "Nextjs", label: "Nextjs" },
          ],
        })),
    };

    saveConfig(answers);
    return answers;
  } catch (error: any) {
    throw new Error("error prompting for config" + error.message);
  }
}


/**
 * Retrieves the saved bonita configuration or prompts fro a new one if missing
 *
 * @return {Promise<TBonitaConfigSchema>} The saved bonita configuration.
 */
export async function getSavedbonitaConfig() {
  try {
    if (existsSync("./bonita.config.json")) {
      const bonita_config_file = await safeJSONParse<TBonitaConfigSchema>(
        readFileSync("./bonita.config.json").toString()
      );
      const bonita_config = bonitaConfigSchema.parse(bonita_config_file);
      if (bonita_config) {
        return bonita_config;
      } else {
        return await promptForbonitaConfig();
      }
    } else {
      return await promptForbonitaConfig();
    }
  } catch (error) {
    printHelpers.warning("corrupt bonita config attempting to reset");
    await removeDirectory("./bonita.config.json");
    printHelpers.error("error getting bonita config , try again");
    process.exit(1);
  }
}
