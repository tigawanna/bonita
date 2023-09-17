import { destr, safeDestr } from "destr";
import { jsonrepair } from "jsonrepair";

export async function safeJSONParse<T>(item: string) {
  try {
    try {
      return safeDestr<T>(item);
    } catch (error) {
      return safeDestr<T>(await jsonrepair(item));
    }
  } catch (error: any) {
    throw error.message;
  }
}
