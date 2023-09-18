import { TBonitaConfigSchema, getBonitaConfig } from "@/utils/config/config";
import { Command } from "commander";
import { multiselectPrompt } from "#/src/utils/helpers/clack/prompts";
import { promptToInstall } from "#/src/utils/config/prompts/install";
import { gen_command_args, gen_command_options, TGenOptions, genSubCommandEnum } from "./gen-commnad-args";


const program = new Command();

export const genCommand = program
  .command("gen")
  .description("gen packages to your project")
  .argument("[inputs...]", "string to split")
  .option('-y, --yes', 'Accept all defaults', false)
  .action(async (args,options) => {
    const config = await getBonitaConfig();
    

    if (args.length === 0) {
      return listgenablePackages(config,options);
    }
    
    const parsed_args = await gen_command_args(args);
    const parsed_options = await gen_command_options(options);


    await promptToInstall(parsed_options)
  });


  export async function listgenablePackages(config: TBonitaConfigSchema,gen_options?:TGenOptions) {
    const result = await multiselectPrompt<typeof genSubCommandEnum[number]>({
    /* REQUIRED OPTIONS */
    message: "What would you like to generate?", // The message that the user will read
    options: [
      { label: "Prisma Model", value: "model" },
      { label: "New Page", value: "page" },
    ]
  });

  const packages = result && result;
  if (packages) {

    await promptToInstall(gen_options)
  }
}
