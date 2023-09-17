import { readFile } from "fs";
import { IPackageJson } from "@/utils/helpers/pkg-manager/types";
import { writeFile } from "fs/promises";
import { printHelpers } from "@/utils/helpers/print-tools";
import { safeJSONParse } from "@/utils/helpers/json/json";

export const panda_base_css = `
@layer reset, base, tokens, recipes, utilities;
`;

export const panda_config_template = `
import { defineConfig } from "@pandacss/dev"
 
export default defineConfig({
 // Whether to use css reset
 preflight: true,
 
 // Where to look for your css declarations
 include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],
 
 // Files to exclude
 exclude: [],
 
 // The output directory for your css system
 outdir: "styled-system",
})
`;

export async function addPandaScript() {
  readFile("./package.json", "utf-8", async (_, data) => {
    if (data) {
      const pkg_json = await safeJSONParse<IPackageJson>(data);
      pkg_json.scripts["prepare"] = "panda codegen";
      const new_pkg_json = JSON.stringify(pkg_json, null, 2);
      writeFile("./package.json", new_pkg_json, { encoding: "utf-8" })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          printHelpers.debug(err, "error saving pkg json");
          throw err;
        });
    }
  });
}
