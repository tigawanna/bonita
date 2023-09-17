import { generateCode, loadFile, parseModule } from "magicast";
import { addVitePlugin, getDefaultExportOptions } from "magicast/helpers";
import { UserConfig } from "vite";
import fg from "fast-glob";
import { readFile, writeFile } from "fs/promises";
import { pathExists } from "../fs/files";
import { addTsconfigPathAlias } from "../json/json-configs";
import { printHelpers } from "../print-tools";
import { loadingSpinner } from "../clack/spinner";


export async function updateViteOptions(options: UserConfig) {
  try {
    const vite_path = pathExists(await fg(["vite.config.*"], {}));
    if (!vite_path) {
      return "no vite config found";
    }
    const vite_config = await readFile(vite_path, { encoding: "utf-8" });
    const mod = await loadFile(vite_path);
    const default_config = (await getDefaultExportOptions(mod)) as UserConfig;

    Object.entries(options).forEach(([key, value]) => {
      // @ts-expect-error
      default_config[key] = { ...default_config[key], value };
    });
    const vite_config_mod = parseModule(vite_config);
    //  update the defaultConfig options
    vite_config_mod.exports.default.$args[0] = default_config;
    const { code } = generateCode(vite_config_mod);
    await writeFile(vite_path, code, {
      encoding: "utf-8",
    });
  } catch (err: any) {
    throw err;
  }
}

export async function getViteConfig() {
  try {
    const vite_config_file_path = pathExists([
      "./vite.config.js",
      "./vite.config.ts",
    ]);
    if (!vite_config_file_path) {
      return "no vite config file found, added a generic one in vite.config.ts";
    }
    const vite_config_mod = await loadFile(vite_config_file_path);
    const { code } = generateCode(vite_config_mod);
    printHelpers.info("mod", code);
  } catch (err: any) {
    throw err;
  }
}

export async function addViteTSPathAlias() {
  const vite_aliases = loadingSpinner();
  vite_aliases.add("main", { text: "adding typescript path aliases" });
  try {
    const vite_config_file_path = pathExists([
      "./vite.config.ts",
      "./vite.config.js",
    ]);

    if (!vite_config_file_path) {
      const generis_vite_config = `
   import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'    
    import tsconfigPaths from "vite-tsconfig-paths"
    // https://vitejs.dev/config/
    export default defineConfig({
    server: {
        port: 3000,
        host: true
     },
    plugins: [react(), tsconfigPaths(),],
    })
`;
      await writeFile("vite.config.ts", generis_vite_config, {
        encoding: "utf-8",
      });
      await addTsconfigPathAlias();
      vite_aliases.succeed("main", {
        text: "no vite config file found, added a generic one in vite.config.ts",
      });
      return "no vite config file found, added a generic one in vite.config.ts";
    }
    const vite_config_file = await readFile(vite_config_file_path, {
      encoding: "utf-8",
    });
    if (vite_config_file.includes("import tsconfigPaths from")) {
      await addTsconfigPathAlias();
      vite_aliases.succeed("main", {
        text: "vite-tsconfig-paths already added",
      });
      return "vite-tsconfig-paths already added";
    } else {
      const mod = parseModule(vite_config_file);
      try {
        addVitePlugin(mod, {
          from: "vite-tsconfig-paths",
          constructor: "tsconfigPaths",
          imported: "default",
        });
      } catch (error: any) {
        if (
          !error.message.includes("Changing import name is not yet implemented")
        ) {
          vite_aliases.fail("main", { text: error.message });
          throw error;
        }
      }

      const { code } = generateCode(mod);
      await writeFile(vite_config_file_path, code, {
        encoding: "utf-8",
      });
      await addTsconfigPathAlias();
      vite_aliases.succeed("main", {
        text: "vite-tsconfig-paths added",
      });
      return "vite-tsconfig-paths added";
    }

  } catch (error: any) {
    vite_aliases.fail("main", { text: error.message });
    throw error;
  }
}

// addViteTSPathAlias().catch((error) => {
//   printHelpers.error("error adding vite-tsconfig-paths " + error.message);
//   throw error;
// });
// getViteConfig().catch((error) => {
//   printHelpers.error("error adding vite-tsconfig-paths " + error.message);
//   throw error;
// });
