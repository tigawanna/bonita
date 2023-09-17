
import { confirmPrompt } from "@/utils/helpers/clack/prompts";
import { installPackages } from "@/utils/helpers/pkg-manager/package-managers";
import { TAddOptions } from "@/commands/add/add-commnad-args";
import { outro } from '@clack/prompts';


export async function promptToInstall(options?:TAddOptions){

try {
    if(!options?.yes){
        const consent = await confirmPrompt({
            message: "Do you want to install the dependencies now ?",
            initialValue: true,
        })
        if (!consent) {
            outro("stay bonita");
            process.exit(1)
        }
    }
  
    await installPackages([""]);

} catch (error:any) {
    return
}
}
