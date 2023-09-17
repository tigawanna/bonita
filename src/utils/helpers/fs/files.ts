import { readFile, writeFile,mkdir } from "fs/promises";
import { printHelpers } from "../print-tools";
import { existsSync } from "fs";
import path from "path";

async function ensureFile(filePath:string) {
  const dir = path.dirname(filePath);
  await mkdir(dir, { recursive: true });
}
/**
 * Writes or overwrites a file with the given content.
 *
 * @param {string} content - The content to be written to the file. Can be either a file path or a string.
 * @param {string} path - The path of the file to be written or overwritten.
 * @return {Promise<{success: boolean, operation: string}>} - A promise that resolves to an object indicating the success of the operation and the type of write operation performed.
 */
export async function writeOrOverWriteFile(path: string, content: string) {
  try {
    if (!existsSync(path)) {
      await ensureFile(path);
      await writeFile(path, content).catch((error: any) => {
        printHelpers.error("error creating file " + error.message);
        throw error;
      });
      return {
        success: true,
        operation: "create file",
      };
    }
    // if conent is a valid filepath and nt string connets
    const is_file_path = existsSync(content);
    const write_content = is_file_path
      ? await readFile(content, { encoding: "utf8" })
      : content;
    await writeFile(path, write_content);
    return {
      success: true,
      operation: is_file_path ? "write file contents" : "write string value",
    };
  } catch (error: any) {
    printHelpers.error("error writing file " + error.message);
    throw error;
  }
}

/**
 * Checks if any of the given paths exist.
 *
 * @param {string[]} possible_paths - An array of paths to check.
 * @returns {string | null} - The first existing path, or null if none exist.
 */
export function pathExists(possible_paths: string[]) {
  try {
    for (const path_name of possible_paths) {
      if (existsSync(path_name)) {
        return path_name;
      }
    }
    return null;
  } catch (error: any) {
    throw error.message;
  }
}
