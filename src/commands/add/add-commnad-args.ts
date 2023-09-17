import { printHelpers } from "@/utils/helpers/print-tools";
import { z } from "zod";
const add_args = ["tailwind", "panda", "tanstack"] as const;
const addArgsShema = z.array(z.enum(add_args));
export type TAddArgs = z.infer<typeof addArgsShema>;

export async function add_command_args(args: any) {
  try {
    const parsed_args = await addArgsShema.parse(args);
    return parsed_args;
  } catch (error: any) {
    printHelpers.error("invalid arguments: " + error.message);
    process.exit(1);
  }
}

const addOptionsShema = z.object({
  yes:z.boolean().default(false),
});
export type TAddOptions = z.infer<typeof addOptionsShema>;
export async function add_command_options(options: any) {
  try {
    const parsed_options = await addOptionsShema.parse(options);
    return parsed_options;
  } catch (error: any) {
    printHelpers.error("invalid arguments: " + error.message);
    return
    // process.exit(1);
  }
}
