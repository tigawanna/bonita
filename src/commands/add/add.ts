
import { Command } from "commander";
import { installPanda } from "#/src/utils/installers/add/panda/panda";
import { TAddArgs,add_command_args } from "./add-commnad-args";

import { multiselectPrompt } from "#/src/utils/helpers/clack/prompts";
import { TBonitaConfigSchema, TBonitaOptions, add_command_options,bonitaRootCommand,getBonitaConfig } from "#/src/utils/config/bonita";
import { promptToInstall } from "#/src/utils/config/helpers";
import { installTailwind } from "#/src/utils/installers/add/tailwind/tailwind";



const program = new Command();

export const addCommand = bonitaRootCommand({
  name: "add",
  description: "add packages to your project"
})
  .argument("[inputs...]", " packages to add to the project")
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


  export async function listAddablePackages(config: TBonitaConfigSchema,add_options:TBonitaOptions) {
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
