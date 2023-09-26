import { multiselectPrompt } from "#/src/utils/helpers/clack/prompts";
import { TCreateArgs, TCreateOptions, create_command_args } from "./create-commnad-args";
import { installT3Rakkas } from "#/src/utils/installers/create/t3/installT3Rakkas";
import { bonitaRootCommand } from "#/src/utils/config/bonita";




export const createCommand = bonitaRootCommand({
  name: "create",
  description: "create new projects"
})
.argument("[inputs...]", "arguments")
.action(async (args,options) => {

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
