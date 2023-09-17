import { frameworkDefaults } from "@/utils/helpers/framework/framework";
import { checkFramework } from "@/utils/helpers/framework/whatFramework";
import { TBonitaConfigSchema, saveConfig } from "../config";
import { selectPrompt, textPrompt } from "@/utils/helpers/clack/prompts";

export async function promptForConfig() {
  try {
    const framework_type = await checkFramework();
    const { root_dir, root_styles, state, components,root_file } = frameworkDefaults(framework_type);
    const answers: TBonitaConfigSchema = {
      root_dir:(await textPrompt({ message: "root directory ?", defaultValue: root_dir,initialValue: root_dir})),
      root_file:(await textPrompt({ message: "root/entry file ?", defaultValue: root_file,initialValue: root_file})),
      root_styles:(await textPrompt({ message: "Main css file ?",defaultValue: root_styles,initialValue: root_styles})),
      framework:
        framework_type ??
        (await selectPrompt({
          message: "Framework ?",
          options: [
            { value: "React+Vite", label: "React+Vite" },
            { value: "Nextjs", label: "Nextjs" },
          ],
        })),
      state:(await textPrompt({ message: "state directory ?", defaultValue: state,initialValue: state})),
      components:(await textPrompt({
          message: "components directory ?",
          defaultValue: components,
          initialValue: components
        })),
    };

    saveConfig(answers);
    return answers;
  } catch (error: any) {
    throw new Error("error prompting for config" + error.message);
  }
}
