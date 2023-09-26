import depsjson from "#/deps.json"
import { loadingSpinner } from "../clack/spinner";
import { printHelpers } from "../print-tools";
import { filterObjectWithArray } from "../objects/filter";


interface IPackageJson {
    pkg:keyof typeof depsjson
}
export async function mergeDependancies({pkg}:IPackageJson){
    // const config = await getBonitaConfig();
    const spinnies = loadingSpinner();
    spinnies.add("adding_deps", { text: `adding ${pkg} deps` });
    try {
        // const pkg_json = await getPkgJson();
        // console.log("deps.json in addTailwindDeps === ",depsjson)
        const default_tailwind_dependancies = ["autoprefixer", "postcss", "tailwindcss"]
        const tw_deps_json = depsjson["tailwind"]
        printHelpers.info("tw_deps",tw_deps_json)
        
        const tw_deps = filterObjectWithArray(tw_deps_json.dev, default_tailwind_dependancies)
        printHelpers.info("tw_deps",tw_deps)
        // const all_deps = Object.entries(tw_deps_json).flatMap(([key, value]) => {
        //     return Object.keys(value)
        // })
        // printHelpers.info("all_deps",all_deps)
        // await multiselectPrompt({
        //     message: "Which dependencies do you want to add ?",
        //     options: all_deps
        // })
        //  TODO: prompt user to pick deps 
        // const new_deps = merge(pkg_json.dependencies, tw_deps_json.main)
        // const new_dev_deps = merge(pkg_json.devDependencies, tw_deps_json.dev)

        // pkg_json.dependencies = new_deps;
        // pkg_json.devDependencies = new_dev_deps

        // await writeFile("./package.json", JSON.stringify(pkg_json, null, 2), "utf8");
        spinnies.succeed("adding_deps", { text: `added ${pkg} deps` });
    } catch (error: any) {
        spinnies.fail("adding_deps", { text: error.message });
        throw new Error(`error adding ${pkg} deps \n` + error.message);
    }
}
