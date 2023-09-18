import { TBonitaConfigSchema, getBonitaConfig } from "@/utils/config/config";
import { Command } from "commander";
import { installTailwind } from "#/src/utils/installers/add/tailwind/tailwind";
import { installPanda } from "#/src/utils/installers/add/panda/panda";
import { TAddArgs, TAddOptions, add_command_args, add_command_options } from "./add-commnad-args";
import { installTanstack } from "@/utils/installers/tanstack/tanstack";
import { multiselectPrompt } from "#/src/utils/helpers/clack/prompts";
import { promptToInstall } from "#/src/utils/config/prompts/install";


const program = new Command();

export const addCommand = program
  .command("add")
  .description("add packages to your project")
  .argument("[inputs...]", "string to split")
  .option('-y, --yes', 'Accept all defaults', false)
  .action(async (args,options) => {
    const config = await getBonitaConfig();
    

    if (args.length === 0) {
      return listAddablePackages(config,options);
    }
    const packages = await add_command_args(args);
    const parsed_options = await add_command_options(options);

    if (packages.includes("tailwind")) {
      await installTailwind(config);
    }
    if (packages.includes("panda")) {
      await installPanda(config);
    }
    if (packages.includes("tanstack")) {
      await installTanstack(config);
    }
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
      await installTailwind(config);
    }
    if (packages.includes("panda")) {
      await installPanda(config);
    }
    if (packages.includes("tanstack")) {
      await installTanstack(config,add_options);
    }
    await promptToInstall(add_options)
  }
}
