import { printHelpers } from "@/utils/helpers/print-tools";
import { z } from "zod";
const create_args = ["rakkas-t3-app"] as const;
const createArgsShema = z.array(z.enum(create_args));
export type TCreateArgs = z.infer<typeof createArgsShema>;

export async function create_command_args(args: any) {
  try {
    const parsed_args = await createArgsShema.parse(args);
    return parsed_args;
  } catch (error: any) {
    printHelpers.error("invalid arguments: " + error.message);
    process.exit(1);
  }
}

const createOptionsShema = z.object({
  yes:z.boolean().default(false),
});
export type TCreateOptions = z.infer<typeof createOptionsShema>;
export async function create_command_options(options: any) {
  try {
    const parsed_options = await createOptionsShema.parse(options);
    return parsed_options;
  } catch (error: any) {
    printHelpers.error("invalid arguments: " + error.message);
    return
    // process.exit(1);
  }
}
