import kleur from "kleur";
import { confirmPrompt } from "@/utils/helpers/clack/prompts";
import { removeDirectory } from "@/utils/helpers/fs/directories";
import { printHelpers } from "@/utils/helpers/print-tools";
import { existsSync, mkdirSync } from "fs";
import { rakkasRouteDynamicPageTempalte, rakkasRouteLayoutTempalte, rakkasRoutePageTempalte } from "./template";

export async function addNewRakkasPage(page: string) {
    try {
        if (!page) {
            throw new Error("Page name is missing!");
        }
        // const config = await promptForTanstackConfig(bonita_config);
        const rakkas_pages_dir ="./src/routes"
        const dir_name = page.toLowerCase();
        printHelpers.info("dir name ", dir_name);

        const dir_path = rakkas_pages_dir + `/${dir_name}`;

        if (existsSync(dir_path)) {
            printHelpers.warning(
                kleur.red(`Error: directory ${dir_name} already exists!`),
            );
            const overwrite_consent = await confirmPrompt({
                message: "Do you want to overwrite it?",
                initialValue: true,
            });

            if (!overwrite_consent) {
                // process.exit(1);
                return
            }
            await removeDirectory(dir_path);
        }
        // create directory
        mkdirSync(dir_path);
        // await removeDirectory(dir_path)
        await rakkasRouteLayoutTempalte(dir_name, dir_path);
        await rakkasRoutePageTempalte(dir_name, dir_path);
        await rakkasRouteDynamicPageTempalte(dir_name, dir_path);
   
        
    } catch (error: any) {
        printHelpers.error("error creating page " + error.message);
        return
    }
}
