import { cp, readdir, rm } from "fs/promises";
import AdmZip from "adm-zip";
import { existsSync } from "fs";
import { printHelpers } from "../print-tools";
import { loadingSpinner } from "../clack/spinner";


export async function readDirectories(directoryPath: string) {
  try {
    const files = await readdir(directoryPath, { withFileTypes: true });
    const directories = files
      .filter((file) => file.isDirectory())
      .map((file) => file.name);
    return directories;
  } catch (err) {
    throw err;
  }
}

export function unzipFile(zipFilePath: string, outputPath: string) {
  try {
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(outputPath, true);
    printHelpers.success("File unzipped successfully");
  } catch (error) {
    printHelpers.error("Error unzipping file:", error);
    throw error;
  }
}

export async function removeDirectory(directoryPath: string) {
  const delete_dir_spinner = loadingSpinner();
  delete_dir_spinner.add("main", { text: "removing directory" });
  const maxAttempts = 10;
  const delayTime = 1000;
  try {
    await rm(directoryPath, { recursive: true });
    // printHelpers.success(directoryPath + " removed successfully");
    delete_dir_spinner.succeed("main", {
      text: directoryPath + " removed successfully",
    });
  } catch (error: any) {
    // printHelpers.error(`Error removing ${directoryPath} directory:`, error);
    if (error.code === "EBUSY") {
      await delay(delayTime);
      await removeDirectory(directoryPath);
    } else {
      delete_dir_spinner.fail("main", {
        text: error.message + `try deleting ${directoryPath} manually`,
      });
      throw error;
    }
  
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mergeOrCreateDirs(
  originPath: string,
  destinationPath: string,
) {
  const merge_dir_spinner = loadingSpinner();
  merge_dir_spinner.add("main", {
    text: "merging files",
  });

  try {
    const origin_pages_dirs = await readDirectories(originPath);
    if (existsSync(destinationPath)) {
      // merge_dir_spinner.update("main", {
      //   text: destinationPath + " directory exists, merging files",
      // });
      // printHelpers.warning(destinationPath+" directory exists, merging files");
      const target_pages_dirs = await readDirectories(destinationPath);
      const pages_dirs_to_write = origin_pages_dirs.filter(
        (item) => !target_pages_dirs.includes(item),
      );

      await Promise.all(
        pages_dirs_to_write.map(async (pageDir) => {
          if (!target_pages_dirs.includes(pageDir)) {
            await cp(
              `${originPath}/${pageDir}`,
              `${destinationPath}/${pageDir}`,
              {
                recursive: true,
              },
            );
          }
        }),
      );
      merge_dir_spinner.succeed("main", {
        text: destinationPath + "directory merged successfully",
      });
      return {
        success: true,
        operation: "merge",
        files: {
          existing: target_pages_dirs,
          incoming: origin_pages_dirs,
          diff: pages_dirs_to_write,
        },
      };
    } else {
      // printHelpers.warning(destinationPath + "directory doesn't exist, creating new");
      // merge_dir_spinner.update("main", {
      //   text: destinationPath + "directory doesn't exist, creating new",
      // });
      await cp(originPath, destinationPath, {
        recursive: true,
      });
      // printHelpers.success(destinationPath + "directory created successfully");
      merge_dir_spinner.succeed("main", {
        text: destinationPath + "directory created successfully",
      });

      return {
        success: true,
        operation: "create",
        files: {
          existing: [],
          incoming: origin_pages_dirs,
          diff: [],
        },
      };
    }
  } catch (error: any) {
    merge_dir_spinner.fail("main", { text: error.message });
    throw error;
  }
}
