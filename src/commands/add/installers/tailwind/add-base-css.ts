import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { printHelpers } from "@/utils/helpers/print-tools";
import { tailwind_base_css } from "@/commands/add/installers/tailwind/templates";
import { loadingSpinner } from "@/utils/helpers/clack/spinner";

export async function addBaseTWcss(inde_styles_path: string) {
  const spinner = loadingSpinner();
  spinner.add("base-styles", { text: "adding base styles" });
  try {
    const index_css_exists = await existsSync(inde_styles_path);
    // if the index.css file  doesn't exist , create and add base styles
    if (!index_css_exists) {
      await writeFile(inde_styles_path, tailwind_base_css);
      spinner.succeed("base-styles", {});
      return;
    }

    const index_css = await readFile(inde_styles_path, { encoding: "utf-8" });
    // if can't read index.css , create and add base styles
    if (!index_css) {
      await writeFile(inde_styles_path, tailwind_base_css);
      spinner.succeed("base-styles", {
        text: "created " + inde_styles_path + "with tailwind base styles",
      });
      return;
    }

    //  if index.css exists but alreay cotains tailwind base styles
    const tailwindRegex = /@tailwind (base|components|utilities);/g;
    let matches = index_css.match(tailwindRegex);
    let containsAllDirectives = matches !== null && matches.length === 3;

    // check for partials and add missing base css directives
    if (matches !== null && matches.length !== 3) {
      const new_index_css = tailwind_base_css + "\n" + index_css.replace(tailwindRegex, "").trim();
      writeFile(inde_styles_path, new_index_css);
      spinner.succeed("base-styles", {
        text: "updating base css directives",
      });
      return;
    }
    // if all tailwind css directives exist return
    if (containsAllDirectives) {
      spinner.succeed("base-styles", {
        text: "all base css directives already exist",
      });
      return;
    }

    const new_base_css = tailwind_base_css + index_css;
    writeFile(inde_styles_path, new_base_css);
    spinner.succeed("base-styles", {
      text: "updated base css directives",
    });
  } catch (error: any) {
    spinner.fail("base-styles", {
      text: error.message,
    });
    printHelpers.info("try adding manually and try again");
    printHelpers.info(tailwind_base_css);
    printHelpers.info("\n into:" + inde_styles_path);
    throw new Error("Error running tailwind base css :\n" + error.message);
  }
}
