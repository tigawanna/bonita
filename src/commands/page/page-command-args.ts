import { printHelpers } from "@/utils/helpers/print-tools";
import { z } from "zod";

const pageOptionsArgsSchema = z.array(z.string());
export type TPageOptionsArgs = z.infer<typeof pageOptionsArgsSchema>;

export async function page_command_args(args: any) {
  try {
    const parsed_args = await pageOptionsArgsSchema.parse(args);
    return parsed_args;
  } catch (error: any) {
    printHelpers.error("invalid arguments: " + error.message);
    process.exit(1);
  }
}

const pageOptionsShema = z.object({
  yes: z.boolean().default(false),
});
export type TPageOptions = z.infer<typeof pageOptionsShema>;
export async function page_command_options(options: any) {
  try {
    const parsed_options = await pageOptionsShema.parse(options);
    return parsed_options;
  } catch (error: any) {
    printHelpers.error("invalid arguments: " + error.message);
    return
    // process.exit(1);
  }
}
