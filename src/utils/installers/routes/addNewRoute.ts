import { TBonitaConfigSchema } from "@/utils/config/config";
import { printHelpers } from "@/utils/helpers/print-tools";
import { promptForTanstackConfig } from "@/utils/config/prompts/vite-tanstack";
import { addNewtanstackPage } from "./vite-react/react-vite";
import { addNewRakkasPage } from "./rakkas/add-page";
import { textPrompt } from "@/utils/helpers/clack/prompts";

export async function addNewRoute( pages: string[],bonita_config: TBonitaConfigSchema) {
  try {
    let page_names=pages
    if((!pages)||(pages&&pages.length===0)){
    const page_names_input = await textPrompt({ message: "Enter route name, comma separate for multiple",placeholder: "ex: NewPage,NewPage2",initialValue: "NewPage" });
    page_names= page_names_input.split(",");
    }
    if (bonita_config.framework === "React+Vite") {
      const config = await promptForTanstackConfig(bonita_config);
      const routes  = page_names.map((page) => {
        return addNewtanstackPage(page, config);
      });
      return await  Promise.allSettled(routes);
    }
    if (bonita_config.framework === "Rakkasjs") {
    const routes  = page_names.map((page) => {
        return addNewRakkasPage(page);
      });
      return await Promise.allSettled(routes);
    }

    printHelpers.warning(bonita_config.framework+"  not yet supported");
  } catch (error: any) {
    printHelpers.error("error creating file " + error.message);
    throw error;
  }
}
