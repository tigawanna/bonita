import { getBonitaConfig } from "@/utils/config/config";
import { Command } from "commander";
import { page_command_args } from "./page-command-args";
import { addNewPage } from "@/utils/page/addNewPage";

const program = new Command();

export const pageCommand = program
  .command("page")
  .description("add new pages to your project")
  .argument("[inputs...]", "pages and options")
  .option('-y, --yes', 'Accept all defaults', false)
  .action(async (args) => {
    const config = await getBonitaConfig();
    const parsed_args = await page_command_args(args);

    await addNewPage(parsed_args, config);
  });
