import { TFrameworkType, supportedFrameworks } from "./whatFramework";
import { nextJSFileStructure } from "./nextjsFileStructure";


export type TSupprtedFrameworks = TFrameworkType;

export const supportedFrameworklist = supportedFrameworks.filter(
  (framework) => framework !== "Others",
);

const frames: TSupprtedFrameworks = "Nextjs";
export type FrameWorkDefaults={
  root_dir: string;
  root_styles: string;
  root_file: string;
  state: string;
  components: string;
  framework: string;
  tailwind: {
    tw_config: string;
    tw_plugins: never[];
  };
}

export function frameworkDefaults(framework: TSupprtedFrameworks):FrameWorkDefaults {
  if (framework === "Nextjs") {
    return nextJSFileStructure();
  }
  if (framework === "RedWood") {
    return {
      root_dir: "./web/src",
      root_styles: "./web/src/index.css",
      root_file: "./web/src/layout.tsx",
      state: "./web/src/state",
      components: "./web/src/components",
      framework: "RedWood",
      tailwind: {
        tw_config: "./web/tailwind.config.js",
        tw_plugins: [],
      },
    };
  }
  if (framework === "Rakkasjs") {
    return {
      root_dir: "./src",
      root_styles: "./src/routes/index.css",
      root_file: "./src/routes/layout.tsx",
      state: "./src/state",
      components: "./src/components",
      framework: "Rakkasjs",
      tailwind: {
        tw_config: "./tailwind.config.js",
        tw_plugins: [],
      },
    };
  }
  return {
    root_dir: "./src",
    root_styles: "./src/index.css",
    root_file: "./src/main.tsx",
    state: "./src/state",
    components: "./src/components",
    framework,
    tailwind: {
      tw_config: "tailwind.config.js",
      tw_plugins: [],
    },
  };
}
