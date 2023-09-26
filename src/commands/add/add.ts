
import { Command } from "commander";
import { installPanda } from "#/src/commands/add/installers/panda/panda";
import { TAddArgs, TAddOptions, add_command_args, add_command_options } from "./add-commnad-args";

import { multiselectPrompt } from "#/src/utils/helpers/clack/prompts";
import { TBonitaConfigSchema, getBonitaConfig } from "#/src/utils/config/bonita";
import { promptToInstall } from "#/src/utils/config/helpers";
import { installTailwind } from "@/commands/add/installers/tailwind/tailwind";


const program = new Command();

export const addCommand = program
  .command("add")
  .description("add packages to your project")
  .argument("[inputs...]", "string to split")
  .option("-d, --root-dir <root_dir>", "Root directory")
  .option("-s, --root-styles <root_styles>", "Root styles file")
  .option("-f, --root-file <root_file>", "Root file",)
  .option("-tw, --tw-config <tw_config>", "tailwind config path",)
  .option("-panda, --panda-config <panda_config>", "panda config path",)
  .option("-p, --plugins <plugins...>", "Plugins")
  .option('-y, --yes', 'Accept all defaults', false)
  .action(async (args,options) => {
    const config = await getBonitaConfig(options);
    

    if (args.length === 0) {
      return listAddablePackages(config,options);
    }
    const packages = await add_command_args(args);
    const parsed_options = await add_command_options(options);

    if (packages.includes("tailwind")) {
      await installTailwind({bonita_config:config,options});
    }
    if (packages.includes("panda")) {
      await installPanda({bonita_config:config,options});
    }
    // if (packages.includes("tanstack")) {
    //   await installTanstack(config);
    // }
    await promptToInstall(parsed_options)
  });


  export async function listAddablePackages(config: TBonitaConfigSchema,add_options?:TAddOptions) {
  const result = await multiselectPrompt<TAddArgs[number]>({
    /* REQUIRED OPTIONS */
    message: "Which packages would you like to add?", // The message that the user will read
    options: [
      { label: "TailwindCSS", value: "tailwind" },
      { label: "PandaCSS", value: "panda" },
      { label: "Tanstack", value: "tanstack" },
    ]
  });

  const packages = result && result;
  if (packages) {
    if (packages.includes("tailwind")) {
      await installTailwind({ bonita_config: config, options:add_options });
    }
    if (packages.includes("panda")) {
      await installPanda({ bonita_config: config, options:add_options });
    }
    // if (packages.includes("tanstack")) {
    //   await installTanstack(config,add_options);
    // }
    await promptToInstall(add_options)
  }
}
