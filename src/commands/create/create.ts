import { multiselectPrompt } from "#/src/utils/helpers/clack/prompts";
import { Command } from "commander";
import { TCreateArgs, TCreateOptions, create_command_args } from "./create-commnad-args";
import { printHelpers } from "#/src/utils/helpers/print-tools";
import { installT3Rakkas } from "#/src/utils/installers/create/t3/installT3Rakkas";




const program = new Command();

export const createCommand = program
  .command("create")
  .description("create new projects")
  .argument("[inputs...]", "arguments")
  .option('-y, --yes', 'Accept all defaults', false)
  .action(async (args,options) => {
  printHelpers.info("create command"),args;
    
    if (args.length === 0) {
    return listCreatablePackages(options);
    }
    const creatables = await create_command_args(args);
    // const parsed_options = await create_command_options(options);
    if(creatables.includes("rakkas-t3-app")){
      await installT3Rakkas();
    }

  });



export async function listCreatablePackages(options?: TCreateOptions) {
  const result = await multiselectPrompt<TCreateArgs[number]>({
    /* REQUIRED OPTIONS */
    message: "Which packages would you like to add?", // The message that the user will read
    options: [
      { label: "Rakkas-T3-App", value: "rakkas-t3-app" },
      ],

  });

  const packages = result && result;
  if (packages) {
    if (packages.includes("rakkas-t3-app")) {
      await installT3Rakkas();
    }
 
  }
}
