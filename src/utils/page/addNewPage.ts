import { TBonitaConfigSchema } from "../config/config";
import { printHelpers } from "../helpers/print-tools";
import { promptForTanstackConfig } from "../config/prompts/vite-tanstack";
import { addNewtanstackPage } from "./vite-react/react-vite";

export async function addNewPage(
  page: string[],
  bonita_config: TBonitaConfigSchema,
) {
  try {
    if (bonita_config.framework === "React+Vite") {
      const config = await promptForTanstackConfig(bonita_config);
      await addNewtanstackPage(page, config);
    }
    printHelpers.warning(bonita_config.framework+"  not yet supported");
  } catch (error: any) {
    printHelpers.error("error creating file " + error.message);
    throw error;
  }
}
