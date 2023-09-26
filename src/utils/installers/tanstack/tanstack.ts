import { TBonitaConfigSchema } from "@/utils/config/bonita";
import { checkFramework } from "@/utils/helpers/framework/whatFramework";
import { addTanstackToVite } from "./vite/vite-spa";
import { addNextjsTanstack } from "./nextjs/next";
import { printHelpers } from "@/utils/helpers/print-tools";
import { TBonitaOptions } from "#/src/utils/config/bonita";


export async function installTanstack(bonita_config: TBonitaConfigSchema,bonita_options:TBonitaOptions) {
  try {
    const framework = await checkFramework();
    if (framework === "React+Vite") {
      addTanstackToVite(bonita_config,bonita_options);
    }
    if (framework === "Nextjs") {
      addNextjsTanstack(bonita_config,bonita_options);
    }
  } catch (error: any) {
    // process.exit(1);
    printHelpers.error("Error installing Tanstack  :\n" + error.message);
  }
}
