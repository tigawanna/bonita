import { writeOrOverWriteFile } from "@/utils/helpers/fs/files";
import { safeJSONParse } from "@/utils/helpers/json/json";
import { IPackageJson } from "@/utils/helpers/pkg-manager/types";
import { readFile, writeFile } from "fs/promises";
import { merge } from "remeda";

import { promptForNextjsConfig } from "@/utils/config/prompts/nextjs";
import { TBonitaConfigSchema, TBonitaOptions } from "@/utils/config/bonita";
import { printHelpers } from "@/utils/helpers/print-tools";
import { loadingSpinner } from "#/src/utils/helpers/clack/spinner";

export async function getTanstckNextTemplateFile(file_name: string) {
  const spinnie = loadingSpinner();
  spinnie.add("fetching", { text: "fetching :" + file_name });
  const url = `https://github.com/TanStack/query/raw/beta/examples/react/nextjs-suspense-streaming/${file_name}`;
  const headers = {
    Accept: "application/json",
  };
  return fetch(url, { headers })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.text();
    })
    .then((data) => {
      spinnie.succeed("fetching", { text: "fetching :" + file_name });
      return data;
    })
    .catch((error) => {
      spinnie.fail("fetching", { text: error.message });
      printHelpers.error(error);
      throw error;
    });
}

export async function fetchNextjsTanstackTemplates() {
  try {
    const package_json = await safeJSONParse<IPackageJson>(
      await getTanstckNextTemplateFile("package.json"),
    );
    const providers = await getTanstckNextTemplateFile("src/app/providers.tsx");
    const root_layout = await getTanstckNextTemplateFile("src/app/layout.tsx");
    const root_page = await getTanstckNextTemplateFile("src//app/page.tsx");
    const api_rpute = await getTanstckNextTemplateFile(
      "src/app/api/wait/route.ts",
    );

    return {
      "package.json": package_json,
      "app/providers.tsx": providers,
      "app/layout.tsx": root_layout,
      "app/page.tsx": root_page,
      "app/api/wait/route.ts": api_rpute,
    };
  } catch (error) {
    throw error;
  }
}

export async function updateNextjsPkgJson(
  templates: Awaited<ReturnType<typeof fetchNextjsTanstackTemplates>>,
) {
  const pkg_spinnies = loadingSpinner();
  try {
    pkg_spinnies.add("main", { text: "updating pkg json" });
    const package_json = await readFile("package.json", { encoding: "utf8" });
    const incoming = templates["package.json"];
    const existing = await safeJSONParse<IPackageJson>(package_json);
    existing.dependencies = merge(existing.dependencies, incoming.dependencies);
    existing.devDependencies = merge(
      existing.devDependencies,
      incoming.devDependencies,
    );
    await writeFile("package.json", JSON.stringify(existing, null, 2), {});
    pkg_spinnies.succeed("main", { text: "updated pkg json" });
  } catch (error: any) {
    pkg_spinnies.fail("main", {
      text: "error updating pkg json" + error.message,
    });
  }
}

export type UpdateNextTemplates = Awaited<
  ReturnType<typeof fetchNextjsTanstackTemplates>
>;
export async function updateNextJsfilesWithTemplates(
  template: UpdateNextTemplates,
  bonita_config: TBonitaConfigSchema,
  bonita_options:TBonitaOptions,
) {
  const spinnies = loadingSpinner();
  const config = await promptForNextjsConfig(bonita_config, bonita_options);
  const next_config = config.next_config;
  try {
    for await (const key of Object.keys(template)) {
      if (key === "package.json") {
        continue;
      }
      spinnies.add("main", { text: "updating " + key });
      const path = next_config.src_dir ? "./src/" + key : key;
      // @ts-expect-error
      writeOrOverWriteFile(path, template[key]);
      spinnies.succeed("main", { text: "added " + path });
    }
  } catch (error: any) {
    spinnies.fail("main", { text: error.message });
  }
}
