import { TTanstckViteReactConfigSchema } from "@/utils/installers/tanstack/vite/vite-spa";
import { textPrompt } from "@/utils/helpers/clack/prompts";
import { TBonitaConfigSchema, TBonitaOptions } from "@/utils/config/bonita";
import { saveConfig } from "@/utils/config/helpers";
export async function promptForTanstackConfig(config: TBonitaConfigSchema, options?:TBonitaOptions) {
    try {
        if (config && config.vite_tanstack) {
            return {
                ...config,
                vite_tanstack: config.vite_tanstack,
            };
        }
        const answers: TTanstckViteReactConfigSchema = {
            pages_dir_path:options?.rootDir??
                (await textPrompt({
                    message: "Where is your pages directory",
                    initialValue: "./src/pages",
                })),
            src_root_path:options?.rootFile??
                (await textPrompt({
                    message: "Where is your main.tsx",
                    initialValue: "./src/main.tsx",
                })),
            src_app_path:options?.rootAppFile??
                (await textPrompt({
                    message: "Where is youor App.tsx",
                    initialValue: "./src/App.tsx",
                })),
            routes_path:options?.routesDir??
                (await textPrompt({
                    message: "Where do you want to put your tanstack routes",
                    initialValue: "./src/pages/routes/routes.ts",
                })),
        };
        const new_config = {
            ...config,
            vite_tanstack: answers,
        };
        saveConfig(new_config);
        return new_config;
    } catch (error: any) {
        throw new Error("error prompting for tanstack router config " + error.message);
    }
}
