import { textPrompt } from "#/src/utils/helpers/clack/prompts";
import { loadingSpinner } from "#/src/utils/helpers/clack/spinner";
import { cloneRepository } from "#/src/utils/helpers/repos/get-repo";

export async function installT3Rakkas() {
    const spinner = loadingSpinner()
    try {
        const project_name = await textPrompt({ message: "What is the name of your project?",
         initialValue: "my-rakkas-ts" });
        spinner.add("clone", { text: "creating rakkas-t3-app " });
        const repo = await cloneRepository("https://github.com/tigawanna/trpc-rakkas.git", `./${project_name}`);
        spinner.succeed("clone", {
         text: `created rakkas-t3-app \n 
        now run cd ${project_name} \n 
        npm install `});
    } catch (error: any) {
        spinner.fail("clone", { text: error.message });
    }
}
