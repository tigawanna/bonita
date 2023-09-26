import fs from "fs";
import fsp from "fs/promises";
import { routeTemplates } from "./routeTemplates";
import { apiRoutesTemplate } from "./apiTemplte";
import {  insertIntoFile } from "./readFile";
import { camel } from "radash";
import { removeDirectory } from "#/src/utils/helpers/fs/directories";


export async function getAllModels() {
  try {
    const schema_string = await fsp.readFile("prisma/schema.prisma", {
      encoding: "utf8",
    });
    return extractModelNames(schema_string);
  } catch (error) {
    throw new Error("error getting model names \n" + error);
  }
}


function extractModelNames(schema: string) {
  const regex = /model\s+(\w+)\s+/g;
  const matches = schema.match(regex);
  const models = [];

  if (matches) {
    for (const match of matches) {
      // @ts-expect-error
      const modelName = match.match(/\bmodel\s+(\w+)\s+/)[1];
      models.push(modelName);
    }
  }

  return models as string[];
}


export async function isModelExists(model: string) {
  try {
    const exiting_models = await getAllModels();
    const valid_model = exiting_models.find(
      (item) => item.toLowerCase() === model.toLowerCase()
    );
    if (!valid_model || (valid_model && valid_model.length === 0)) {
      throw new Error(
        `model ${model} not found , existing models = ${JSON.stringify(
          await getAllModels()
        )}`
      );
    }
    return valid_model;
  } catch (error) {
    throw error;
  }
}


function createAppRoutesFromModels(route_file_dir_path: string, routes: {
  [x: string]: string;
  "index.tsx": string;
  "new.tsx": string;
}) {
  fs.mkdirSync(route_file_dir_path.toLowerCase(), { recursive: true });
  //  recursively add route files
  Object.entries(routes).forEach(([key, value]) => {
    // fsp.appendFile(`${route_file_dir_path}/${key}`, value)
    console.log("writing routes ", `${route_file_dir_path}/${key}`);
    fs.appendFileSync(`${route_file_dir_path}/${key}`, value, {
      encoding: "utf8",
    });
  });
}

export async function generateRoutesFromModel(
  route_path = "src/pages",
  api_path = "src/server/api/routers"
) {
  try {
    //  read model as args
    const model = process.argv[2];
    if (!model) throw new Error("model not provided");
    const verified_model = await isModelExists(model);
    if (!verified_model)
      throw new Error(
        `model ${model} not found , kindly refer to your prisma schema`
      );

    const routes = routeTemplates(model);
    const route_file_dir_path = `${route_path}/${model}`;
    // add routes

    // create route directory
    if (fs.existsSync(route_file_dir_path)) {
      removeDirectory(route_file_dir_path);
    }
    createAppRoutesFromModels(route_file_dir_path, routes); 

    const api_route_path = `${api_path}/${model.toLowerCase()}.ts`;
    if (!fs.existsSync(api_route_path)) {
      //  add api end points
      console.log("writing api route", api_route_path);
      fs.appendFileSync(api_route_path, apiRoutesTemplate(model).route, {
        encoding: "utf8",
      });
    } else {
      console.log(api_route_path, " already exist");
    }

    const route_new_items = `${model.toLowerCase()}:${camel(model)}Router,`;
    const route_break_point = "// add new route below";

    const impport_break_point = "// add new import below";
    const import_new_item = `import { ${camel(
      model
    )}Router } from "./routers/${model.toLowerCase()}";`;
    insertIntoFile({
      path: "src/server/api/root.ts",
      points: [
        { break_point: impport_break_point, new_item: import_new_item },
        { break_point: route_break_point, new_item: route_new_items },
      ],
    });
    if (!(fs.existsSync(api_route_path) && fs.existsSync("src/server/api/root.ts"))) {
      console.log({api_route_path}, "routes not generated");
      
    }
    


  } catch (error) {
    throw error;
  }
}

generateRoutesFromModel("src/pages/profile").catch(console.error);
