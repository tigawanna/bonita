import { TBonitaConfigSchema } from "@/utils/config/config";
import { checkFramework } from "@/utils/helpers/framework/whatFramework";
import { addTanstackToVite } from "./vite/vite-spa";
import { addNextjsTanstack } from "./nextjs/next";
import { printHelpers } from "@/utils/helpers/print-tools";
import { TPageOptions } from "@/commands/page/page-command-args";

export async function installTanstack(config: TBonitaConfigSchema,options?:TPageOptions) {
  try {
    const framework = await checkFramework();
    if (framework === "React+Vite") {
      addTanstackToVite(config,options);
    }
    if (framework === "Nextjs") {
      addNextjsTanstack(config,options);
    }
  } catch (error: any) {
    // process.exit(1);
    printHelpers.error("Error installing Tanstack  :\n" + error.message);
  }
}
