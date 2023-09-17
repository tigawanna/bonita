import { readFile } from "fs/promises";
import { IPackageJson } from "./pkg-manager/types";
import { safeJSONParse } from "./json/json";
import { DeepPartial } from "@/types";



export async function getPkgJson(path: string = "./package.json"): Promise<IPackageJson|undefined> {
  try {
    const pkg_json = await readFile(path, "utf-8");
    if (!pkg_json) {
      throw new Error("package.json not found");
    }
    const package_json = safeJSONParse<IPackageJson>(pkg_json);
    return package_json;
  } catch (error:any) {
    return
  }
}
export async function getDepsJson(){
  try {
    const deps_json = await import("#/deps.json")
    return deps_json
  } catch (error:any) {
   throw new Error("getDepsJson error:"+ error.message);
  }
}

type TGetDepsJsonReturn = Awaited<ReturnType<typeof getDepsJson>>


export async function allDepsArray(){
try {
  const deps = await getDepsJson()
   const all_deps = Object.entries(deps).reduce((acc, [_, value]) => {
      const arr = Object.entries(value).flatMap(([__, value]) => {
       return Object.keys(value)
     })

     return [...acc, ...arr]
   },[""])
   return all_deps
} catch (error) {
  
}
}

export async function filterAndIncludeDeps(
  dep_key: keyof TGetDepsJsonReturn["default"],
  include_deps: DeepPartial<TGetDepsJsonReturn["default"]>) {
  try {

    const saved_deps = await getDepsJson()
    const inner_dev_deps = include_deps[dep_key]?.dev
    const dev_deps = Object.entries(saved_deps[dep_key].dev).reduce((acc, [key, value]) => {
      // @ts-expect-error
      if (inner_dev_deps?.[key]) {
        // @ts-expect-error
        acc[key] = value
      }
      return acc
    }, {})
    const inner_main_deps = include_deps[dep_key]?.main
    const main_deps = Object.entries(saved_deps[dep_key].main).reduce((acc, [key, value]) => {
      // @ts-expect-error
      if (inner_main_deps?.[key]) {
        // @ts-expect-error
        acc[key] = value
      }
      return acc
    }, {})

    return {
      dev:dev_deps,
      main:main_deps
    }

  } catch (error: any) {
    throw error
  }
}


export async function filterAndIgnoreDeps(
  dep_key: keyof TGetDepsJsonReturn["default"],
  include_deps: DeepPartial<TGetDepsJsonReturn["default"]>){
  try {

    const saved_deps = await getDepsJson()
    const inner_dev_deps = include_deps[dep_key]?.dev
    const dev_deps = Object.entries(saved_deps[dep_key].dev).reduce((acc, [key, value]) => {
      // @ts-expect-error
      if(!inner_dev_deps?.[key]){
        // @ts-expect-error
        acc[key] = value
      }
      return acc
    },{})
    const inner_main_deps = include_deps[dep_key]?.main
    const main_deps = Object.entries(saved_deps[dep_key].main).reduce((acc, [key, value]) => {
      // @ts-expect-error
      if(!inner_main_deps?.[key]){
        // @ts-expect-error
        acc[key] = value
      }
      return acc
    },{})

    return {
      dev:dev_deps,
      main:main_deps
    }
    
  } catch (error:any) {
    throw error
  }
}

export async function addDepsToPackageJsons(deps: string[],dev_dep: boolean,pkg_json_path: string = "./package.json") {
  try {
    const pkgs_as_json = deps.reduce<{[key: string]: string }>((acc, dep) => {
      acc[dep] = "latest";
      return acc;
    }, {});
  const pkg_json = await getPkgJson(pkg_json_path);
  if(!pkg_json){
    return
  }
if(dev_dep){
  pkg_json.devDependencies = {...pkgs_as_json,...pkg_json.devDependencies};
}else{
  pkg_json.dependencies ={...pkgs_as_json,...pkg_json.dependencies};
}
// console.log("new package json ==",pkg_json);
  // await writeFile(pkg_json_path, JSON.stringify(pkg_json, null, 2), "utf8");
  } catch (error) {

  }
}


