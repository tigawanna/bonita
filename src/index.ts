#!/usr/bin/env node

import { Command } from "commander";
import { addCommand } from "./commands/add/add";
import { getPkgJson } from "@/utils/helpers/pkg-json";
import { printHelpers } from "@/utils/helpers/print-tools";
import { testCommand } from "./commands/test/test";
import { createCommand } from "./commands/create/create";
import { genCommand } from "./commands/gen/gen";

const program = new Command();

program.name("bonita").description("cli toolkit for frontend development");
program.hook("preSubcommand", async(_) => {
const pkg_json = await getPkgJson();
  if (!pkg_json) {
    return
  }
if(pkg_json.workspaces){
    printHelpers.warning("You appear to be in a workspace , \n consider running this command in your web project's root directory");
    process.exit(1)
  }
})
program.addCommand(addCommand);
program.addCommand(genCommand);
program.addCommand(createCommand);
program.addCommand(testCommand);

// program.addCommand(defaultCommand);
program.command('404', { isDefault: true })
    .description("catch all command")
    .argument('[args...]', 'Catch all arguments/flags provided.')
    .allowUnknownOption()
    .action(() => {
        program.help();
     });


program.parse();
