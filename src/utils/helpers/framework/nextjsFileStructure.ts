import { existsSync } from "fs";
import { FrameWorkDefaults } from "./framework";

export function nextJSFileStructure(): FrameWorkDefaults {
// case app dir with src
    if (existsSync("./src/app")) {
        return {
            root_dir: "./src/app",
            root_file: "./src/app/layout.tsx",
            root_styles: "./src/app/globals.css",
            state: "./src/state",
            components: "./src/components",
            framework: "Nextjs",
            tailwind: {
                tw_config: "tailwind.config.js",
                tw_plugins: [],
            },
        };
}
// case app dir no src dir
    if (existsSync("./app")) {
        return {
            root_dir: "./app",
            root_styles: "./app/globals.css",
            root_file: "./app/layout.tsx",
            state: "./src/state",
            components: "./components",
            framework: "Nextjs",
            tailwind: {
                tw_config: "tailwind.config.js",
                tw_plugins: [],
            },
        };
}
// case pages dir with src
    if (existsSync("./src/pages")) {
        return {
            root_dir: "./src/pages",
            root_styles: "./src/styles/globals.css",
            root_file: "./src/pages/_app.tsx",
            state: "./src/state",
            components: "./src/components",
            framework: "Nextjs",
            tailwind: {
                tw_config: "tailwind.config.js",
                tw_plugins: [],
            },
        };
}
// case pages dir no src dir
    if (existsSync("./pages")) {
        return {
            root_dir: "./pages",
            root_styles: "./styles/globals.css",
            root_file: "./pages/_app.tsx",
            state: "./state",
            components: "./components",
            framework: "Nextjs",
            tailwind: {
                tw_config: "tailwind.config.js",
                tw_plugins: [],
            },
        };
}
    return {
        root_dir: "./src/app",
        root_styles: "./src/app/globals.css",
        root_file: "./src/app/layout.tsx",
        state: "./src/state",
        components: "./src/components",
        framework: "Nextjs",
        tailwind: {
            tw_config: "tailwind.config.js",
            tw_plugins: [],
        },
    };

}
