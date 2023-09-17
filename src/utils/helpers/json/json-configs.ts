import { readFile, writeFile } from "fs/promises";
import { safeJSONParse } from "./json";
import { ITSConfigMini } from "../pkg-manager/types";
import { execPackageManagerCommand } from "../pkg-manager/package-managers";
import { loadingSpinner } from "../clack/spinner";

export async function addTsconfigPathAlias() {
  const ts_config_aliases = loadingSpinner();
  ts_config_aliases.add("main", { text: "adding tsconfig path aliases" });
  try {
    const ts_config_file = await readFile("tsconfig.json", {
      encoding: "utf-8",
    });
    let ts_config_json = await safeJSONParse<Partial<ITSConfigMini>>(
      ts_config_file,
    );
    if (!ts_config_json) {
      ts_config_aliases.add("add", { text: "notsconfig found , adding new" });
      await execPackageManagerCommand(["tsc", "--init"])
        .then(async () => {
          ts_config_aliases.succeed("add", {
            text: "added tsconfig path aliases",
          });
          const new_ts_config_file = await readFile("tsconfig.json", {
            encoding: "utf-8",
          });
          ts_config_json = await safeJSONParse<Partial<ITSConfigMini>>(
            new_ts_config_file,
          );
        })
        .catch(() => {
          ts_config_aliases.fail("add", { text: "error adding new tsconfig" });
          ts_config_aliases.fail("main", { text: "tsconfig not found" });
          throw new Error("tsconfig not found");
        });
    }

    if (!ts_config_json.compilerOptions) {
      ts_config_json["compilerOptions"] = {
        paths: {
          "@/*": ["./src/*"],
        },
      };
    }

    if (
      ts_config_json.compilerOptions &&
      !ts_config_json.compilerOptions.paths
    ) {
      ts_config_json["compilerOptions"] = {
        ...ts_config_json["compilerOptions"],
        paths: {
          "@/*": ["./src/*"],
        },
      };
    }

    if (
      ts_config_json.compilerOptions &&
      ts_config_json.compilerOptions.paths
    ) {
      ts_config_json["compilerOptions"] = {
        ...ts_config_json["compilerOptions"],
        paths: {
          ...ts_config_json["compilerOptions"]["paths"],
          "@/*": ["./src/*"],
        },
      };
    }

    await writeFile("tsconfig.json", JSON.stringify(ts_config_json, null, 2), {
      encoding: "utf-8",
    });
    ts_config_aliases.succeed("main", { text: "added tsconfig path aliases" });
    return "Success: added tsconfig path aliases";
  } catch (error: any) {
    ts_config_aliases.fail("main", { text: error.message });
    throw error;
  }
}
