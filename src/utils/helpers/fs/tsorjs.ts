import { existsSync } from "fs";


export function tsorjsFileExtension(path: string) {
if(existsSync(path+".ts")){
    return path+".ts";
}
if(existsSync(path+".js")){
    return path+".js";
}
if(existsSync(path+".tsx")){
    return path+".tsx";
}
if(existsSync(path+".jsx")){
    return path+".jsx";
}
else{
    return path+".js";
}

}
