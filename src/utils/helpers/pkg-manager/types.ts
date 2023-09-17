export type KeyStringObject = { [key: string]: string };

export interface IPackageJson {
  name: string;
  private?: boolean;
  version: string;
  type?: string;
  scripts: KeyStringObject;
  dependencies: KeyStringObject;
  devDependencies: KeyStringObject;
  workspaces?: string[];
  [key: string]: any | undefined;
}

export interface ITSConfigMini {
  compilerOptions: {
    target?: string;
    lib?: string[];
    module?: string;
    skipLibCheck?: boolean;
    moduleResolution?: string;
    allowImportingTsExtensions?: boolean;
    resolveJsonModule?: boolean;
    isolatedModules?: boolean;
    noEmit?: boolean;
    strict?: boolean;
    noUnusedLocals?: boolean;
    noUnusedParameters?: boolean;
    noFallthroughCasesInSwitch?: boolean;
    paths?: {
      [key: string]: string[];
    };
  };
  include?: string[];
  exclude?: string[];
}


