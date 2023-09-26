import { writeFile } from "fs/promises";
import { pascal } from "radash";
import { loadingSpinner } from "@/utils/helpers/clack/spinner";

export async function rakkasRouteLayoutTempalte(dir_name: string,dir_path: string) {
    const dirName = pascal(dir_name);

    const spinnies = loadingSpinner();
    spinnies.add("config", {
        text: `Adding ${dirName}Layout` + dirName,
    });
    const layoutContent = `
import { LayoutProps } from "rakkasjs";
export default function ${dirName}Layout({ children }: LayoutProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
    {children}
    </div>
  );
}`;
    try {
        await writeFile(`${dir_path}/layout.tsx`, layoutContent, {
            encoding: "utf-8",
        });
        spinnies.succeed("config", { text: "added " + dirName + "Layout" });
        return {
            dirName,
            layoutContent,
        };
    } catch (error: any) {
        spinnies.fail("config", { text: error.message });
        // throw error;
        return 
    }
}

export async function rakkasRoutePageTempalte(dir_name: string,dir_path: string) {
    const dirName = pascal(dir_name);
    const spinnies = loadingSpinner();
    spinnies.add("config", {
        text: `Adding ${dirName} page` + dirName,
    });
    const routeContent = `
import React from "react";
import { Head,PageProps}  from "rakkasjs";
export default function ${dirName}Page({}: PageProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
    <Head title="${dirName}" />
      <div className="w-[30%]">${dirName}</div>
    </div>
  );
}`;
    try {
        await writeFile(`${dir_path}/index.page.tsx`, routeContent, {
            encoding: "utf-8",
        });
        spinnies.succeed("config", { text: "added " + dirName + "page"});
        return {
            dirName,
            routeContent,
        };
    } catch (error: any) {
        spinnies.fail("config", { text: error.message });
        // throw error;
        return
    }
}
export async function rakkasRouteDynamicPageTempalte(dir_name: string,dir_path: string) {
    const dirName = pascal(dir_name);
    const spinnies = loadingSpinner();
    spinnies.add("config", {
        text: `Adding ${dirName} page` + dirName,
    });
const routeContent = `
import React from "react";
import { Head,PageProps}  from "rakkasjs";
export default function One${dirName}Page({params}: PageProps) {
const page_id = params.id;
  return (
    <div className="w-full h-full flex items-center justify-center">
    <Head title="${dirName}" />
      <div className="w-[30%]">
        <h2>User {page_id}</h2>
        </div>
    </div>
  );
}
`;
    try {
        await writeFile(`${dir_path}/[id].page.tsx`, routeContent, {
            encoding: "utf-8",
        });
        spinnies.succeed("config", { text: "added " + dirName + "page"});
        return {
            dirName,
            routeContent,
        };
    } catch (error: any) {
        spinnies.fail("config", { text: error.message });
        // throw error;
        return
    }
}
