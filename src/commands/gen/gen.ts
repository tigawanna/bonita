import { TBonitaConfigSchema, getBonitaConfig } from "@/utils/config/config";
import { Command } from "commander";
import { multiselectPrompt } from "#/src/utils/helpers/clack/prompts";
import { gen_command_args, gen_command_options, genSubCommandEnum } from "./gen-commnad-args";
import { addNewRoute } from "#/src/utils/installers/gen/routes/addNewRoute";


const program = new Command();

export const genCommand = program
  .command("gen")
  .description("generate boilerplate for your project")
  .argument("[inputs...]", "string to split")
  .option('-y, --yes', 'Accept all defaults', false)
  .action(async (args,options) => {
    const config = await getBonitaConfig();
    
    if (args.length === 0) {
      return listgenablePackages(config);
    }

    const parsed_args = await gen_command_args(args);
    const sub_command = parsed_args[0] as typeof genSubCommandEnum[number]
    const parsed_options = await gen_command_options(options);
    // parsed_args.slice(1) =  [ 'user pilot about' ]
    const page_names = parsed_args.slice(1)[0]?.split(" ");
    //page_names = [ 'user', 'pilot', 'about' ]
    if (!sub_command) {
      return listgenablePackages(config);
    }

    if(sub_command === "route"){
     await addNewRoute(page_names, config);
    }
    
    if(sub_command === "model"){
      return
    }
});


  export async function listgenablePackages(config: TBonitaConfigSchema) {
    const result = await multiselectPrompt<typeof genSubCommandEnum[number]>({
    /* REQUIRED OPTIONS */
    message: "What would you like to generate?", // The message that the user will read
    options: [
      { label: "Prisma Model", value: "model" },
      { label: "New Route", value: "route" },
      { label: "New Page", value: "page" },
    ]
  });

  const sub_command = result && result;
  if (sub_command) {
  if (sub_command === "route") {
      await addNewRoute([],config);
    }

    if (sub_command === "model") {
      return
    }

  }
}
