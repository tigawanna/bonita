import { generateCode, loadFile, parseModule } from "magicast";
import { getDefaultExportOptions } from "magicast/helpers";
import fg from "fast-glob";
import { readFile, writeFile } from "fs/promises";
import { pathExists } from "../fs/files";
import { Config } from "tailwindcss";
import { printHelpers } from "../print-tools";

export async function updateTWOptions(options: Omit<Config, "plugins">) {
  try {
    const tw_path = pathExists(await fg(["tailwind.config.*"], {}));
    if (!tw_path) {
      return "no tailwind config found";
    }
    const vite_config = await readFile(tw_path, { encoding: "utf-8" });
    const mod = await loadFile(tw_path);
    const default_config = (await getDefaultExportOptions(mod)) as any as Config;

    Object.entries(options).forEach(([key, value]) => {
      default_config[key] = { ...default_config[key], ...value };
    });
    const vite_config_mod = parseModule(vite_config);
    //  update the defaultConfig options
    vite_config_mod.exports.default = default_config;
    const { code } = generateCode(vite_config_mod);
    printHelpers.success(
      "tailwind boilerpate setup succefully successfully",
      code,
    );
    // await writeFile(tw_path, code, {
    //     encoding: "utf-8",
    // });
  } catch (err: any) {
    throw err;
  }
}

export async function updateTWPlugins(
  plugins: { name: string; config?: { [key: string]: string } }[],
) {
  try {
    const tw_path = pathExists(await fg(["tailwind.config.*"], {}));
    if (!tw_path) {
      return "no tailwind config found";
    }

    const mod = await loadFile(tw_path);
    const tw_plugins = plugins.map((plugin) => {
      if (plugin.config) {
        return `require('${plugin.name}')(${JSON.stringify(
          plugin.config,
          null,
          2,
        )})`;
      }
      return `require('${plugin.name}')`;
    });

    mod.exports.default.plugins = [
      ...mod.exports.default.plugins,
      ...tw_plugins,
    ];
    const { code } = generateCode(mod);
    printHelpers.success(
      "tailwind boilerpate setup succefully successfully",
      code,
    );
    await writeFile(tw_path, code, {
      encoding: "utf-8",
    });
  } catch (err: any) {
    throw err;
  }
}

updateTWPlugins([{ name: "daisyui", config: {} }]).catch((err) => {
  printHelpers.error("Error adding tailwind  :\n" + err.message);
  process.exit(1);
});
