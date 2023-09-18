import { printHelpers } from "@/utils/helpers/print-tools";
import { z } from "zod";


export const genSubCommandEnum = ["page", "route" ,"model",] as const

export const genArgsShema = z.array(z.union([z.enum(genSubCommandEnum), z.string()]))
  .refine((value) => value.length > 0 && z.enum(genSubCommandEnum).safeParse(value[0]).success, {
    message: "Misiing subcommand",
  });


// const genArgsShema = z.array(z.string());
export type TGenArgs = z.infer<typeof genArgsShema>;

export async function gen_command_args(args: any) {
  try {
    const parsed_args = await genArgsShema.parse(args);
    return parsed_args;
  } catch (error: any) {
    printHelpers.error("invalid arguments: " + error.message);
    process.exit(1);
  }
}
export async function gen_sub_command(args:string[]) {
  try {
    const parsed_args = await genArgsShema.parse(args);
    return parsed_args;
  } catch (error: any) {
    printHelpers.error("invalid arguments: " + error.message);
    process.exit(1);
  }
}

const genOptionsShema = z.object({
  yes:z.boolean().default(false),
});
export type TGenOptions = z.infer<typeof genOptionsShema>;
export async function gen_command_options(options: any) {
  try {
    const parsed_options = await genOptionsShema.parse(options);
    return parsed_options;
  } catch (error: any) {
    printHelpers.error("invalid arguments: " + error.message);
    return
    // process.exit(1);
  }
}
