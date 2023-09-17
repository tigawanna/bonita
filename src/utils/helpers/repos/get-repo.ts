import { execa } from "execa";
import { cwd } from "process";

export async function cloneRepository(url: string, alist: string) {
  try {
    await execa("git", ["clone", url, alist]);
    return cwd();
  } catch (error: any) {
    throw new Error("error cloning repository " + error.message);
  }
}
