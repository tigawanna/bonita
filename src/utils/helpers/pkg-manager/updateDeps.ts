import { getNpmPackageVersion } from "@/utils/helpers/pkg-manager/npm";
import { loadingSpinner } from "../clack/spinner";


/**
 * Updates the inner dependencies. takes in  key value pair , 
 * check sthe latest dependanies then matches it back to it's key
 * There's also a check to match beta deps tothe latest beta deps and not the latest
 *
 * @param {string} name - The name of the dependency.
 * @param {Object} deps_json - A JSON object containing the dependencies.
 * @return {Object} - A JSON object with the updated dependencies.
 */

export async function updateInnerDeps(name: string, deps_json: { [key: string]: string }) {
  try {
    const deps_arr = Object.entries(deps_json).map(([name, version]) => {
      return getNpmPackageVersion(name, version);
    });

    const updated_deps = await (
      await Promise.allSettled(deps_arr)
    ).reduce<{ [key: string]: string }>((acc, res) => {
      if (res.status === "fulfilled" && res.value) {
        if (res.value?.curr_version.includes("beta")) {
          acc[res.value.name] = res.value.version.beta;
        } else if (res.value?.curr_version.includes("alpha")) {
          acc[res.value.name] = res.value.version?.alpha ?? res.value.curr_version;
        } else {
          acc[res.value.name] = res.value?.version.latest;
        }
      }
      return acc;
    }, {});

    const deps = {};
    // @ts-expect-error
    deps[name] = updated_deps;
    return deps;
  } catch (error: any) {
    throw error;
  }
}

/**
 * A function that checks the latest dependencies for a given name.
 *
 * @param {string} name - The name of the dependency.
 * 
 * @param {Object} deps - An object representing the dependencies
 * @example ```json
 * 
 *     "dev": {
      "autoprefixer": "10.4.15",
      "daisyui": "3.5.1",
      "postcss": "8.4.27",
      "tailwind-scrollbar": "3.0.5",
      "tailwindcss": "3.3.3",
      "tailwindcss-animate": "1.0.6",
      "tailwindcss-elevation": "2.0.0"
    },
    "main": {
      "tailwind-merge": "^1.14.0"
    }
 * ```
  * loop over it and return an updated object of each entry 
  * then pair it to the name and return that key value pair
  * sample response:
  * @example ```json
  *   "tailwind": {
    "dev": {
      "autoprefixer": "10.4.15",
      "daisyui": "3.5.1",
      "postcss": "8.4.27",
      "tailwind-scrollbar": "3.0.5",
      "tailwindcss": "3.3.3",
      "tailwindcss-animate": "1.0.6",
      "tailwindcss-elevation": "2.0.0"
    },
    "main": {
      "tailwind-merge": "^1.14.0"
    }
  },
  * ```
 * @return {Promise<Object>} An object containing the latest dependencies for the given name.
 */
export async function dependancyType(
  name: string,
  deps: { [key: string]: { [key: string]: string } }
) {
  const spinnies = loadingSpinner();
  try {
    spinnies.add("main", { text: `checking latest ${name} deps` });
    const inner_deps = Object.entries(deps).map(([key, val]) => {
      return updateInnerDeps(key, val);
    });
    const result = await (
      await Promise.allSettled(inner_deps)
    ).reduce((acc, res) => {
      if (res.status === "fulfilled" && res.value) {
        return { ...acc, ...res.value };
      }
      return acc;
    }, {});
    spinnies.succeed("main", { text: `latest ${name} deps` });
    return { [name]: result };
  } catch (error: any) {
    spinnies.fail("main", { text: error.message });
    throw error;
  }
}

/**
 * Updates the dependencies in deps.json used  for the templates.
 * this script will fetch and update the latest version numbers from npm
 * 
 *
 * @return {Promise<object>} The updated dependencies.
 */
export async function updateDependencies() {
  const spinnies = loadingSpinner();
  try {
    spinnies.add("main", { text: "checking latest deps" });
    const deps_file = await import("#/deps.json");
    const deps_json = deps_file.default;

    const updates = Object.entries(deps_json).map(async ([name, dep_type]) => {
      return dependancyType(name, dep_type);
    });

    const new_deps = await (
      await Promise.allSettled(updates)
    ).reduce((acc, res) => {
      if (res.status === "fulfilled" && res.value) {
        return { ...acc, ...res.value };
      }
      return acc;
    }, {});

    const result = new_deps;
    // spinnies.update("main", { text: "updating deps" });
    // await writeFile("./deps.json", JSON.stringify(new_deps, null, 2), "utf8");
    spinnies.succeed("main", { text: "updated deps" });
    return result;
  } catch (error: any) {
    spinnies.fail("main", { text: error.message });
  }
}

updateDependencies()
  .then((data) => {
    console.log("update deps retirn type", data);
  })
  .catch((error) => {
    console.log("error getting package.json", error);
  });
