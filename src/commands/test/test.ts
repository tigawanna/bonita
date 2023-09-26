import { mergeDependancies } from "#/src/utils/helpers/pkg-manager/mergeDependancies";
import { Command } from "commander";

const program = new Command();
export const testCommand = program.command("test")

  .description("test commnands")
  .argument("[inputs...]", "string to split")
  .option('-y, --yes', 'Accept all defaults', false)
 
  // .option('-y, --yes', 'Accept all defaults', true)
  // .allowUnknownOption()
  .action(async(args) => {
    await mergeDependancies({ pkg:"tailwind"})

  });

