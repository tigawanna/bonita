import fs, { existsSync } from "fs";

export interface insertIntoFileProps {
  path: string;
  points: {
    break_point: string;
    new_item: string;
  }[];
}
export function insertIntoFile({ path, points }: insertIntoFileProps) {
  const file = fs.readFileSync(path, { encoding: "utf8" });
  const lines = file.split("\n");

  points.forEach(({ break_point, new_item }) => {
    if (lines.includes(new_item)) return;
    const breakpoint_index = lines.findIndex((line) => {
      return line.includes(break_point);
    });
    lines.splice(breakpoint_index, 0, new_item);
  });
  console.log("new file === ", lines.join("\n"));
  // adding new item
  fs.writeFileSync(path, lines.join("\n"));
}

// "src/server/api/root.ts", "// ooga booga","// next route goes here"
// insertIntoFile({
//   path: "src/server/api/root.ts",
//   points: [
//       { new_item: "// ooga booga", break_point: "// add new route below" },
//       { new_item: "// import ooga from '~/utils/ooga'; booga", break_point: "// add new import below" },
//   ],
// });

export interface GetSnippetFromFileProps {
  path: {
    from: string;
    to: string;
  };
  points: {
    start_point: string;
    end_point: string;
  };
}
export function getSnippetFromFile({ path, points }: GetSnippetFromFileProps) {
  const file = fs.readFileSync(path.from, { encoding: "utf8" });
  const lines = file.split("\n");
  const end_index = lines.findIndex((line) => {
    return line.includes(points.end_point);
  });
  if (end_index === -1) {
    console.log(points.end_point, "not found ");
    return;
  }
  const start_index = lines.slice(0, end_index).findIndex((line) => {
    return line.includes(points.start_point);
  });
  if (start_index === -1) {
    console.log(points.start_point, "not found ");
    return;
  }
  const snippet = lines.slice(start_index, end_index + 1).join("\n");

  const to_file = fs.readFileSync(path.to, { encoding: "utf8" });
  const to_file_lines = to_file.split("\n");

  const to_file_end_index = to_file_lines.findIndex((to_file_line) => {
    return to_file_line.includes(points.end_point);
  });
  if (to_file_end_index === -1) {
    console.log(points.end_point, "not found ");
    return;
  }
  console.log({ to_file_end_index });

  const to_file_start_index = to_file_lines
    .slice(0, to_file_end_index)
    .findIndex((to_file_line) => {
      return to_file_line.includes(points.start_point);
    });
  if (to_file_start_index === -1) {
    console.log(points.start_point, "not found ");
    return;
  }
  console.log({ to_file_start_index });

  // splice in snippet to whre to_file indexstarts and stops

  const new_file = to_file_lines
    .slice(0, to_file_start_index)
    .concat(snippet)
    .concat(to_file_lines.slice(to_file_end_index + 1));
  // console.log("new file == ",new_file)
  fs.writeFileSync(path.to, new_file.join("\n"), { encoding: "utf8" });
  // return snippet
}


export interface GetApiRouteSchemaProps {
  schema_path: string;
  points: {
    start_point: string;
    end_point: string;
  };
}

export function getApiRouteSchema({points,schema_path}:GetApiRouteSchemaProps){
  if(existsSync(schema_path)){
    const file = fs.readFileSync(schema_path, { encoding: "utf8" });
    const lines = file.split("\n");
    const end_index = lines.findIndex((line) => {
      return line.includes(points.end_point);
    });
    if (end_index === -1) {
      console.log(points.end_point, "not found ");
      return;
    }
    const start_index = lines.slice(0, end_index).findIndex((line) => {
      return line.includes(points.start_point);
    });
    if (start_index === -1) {
      console.log(points.start_point, "not found ");
      return;
    }
    const snippet = lines.slice(start_index, end_index + 1).join("\n");
    return snippet;
  }

}



// getSnippetFromFile({
//   path: {
//     from: "prisma/generated/zod/index.ts",
//     to:"src/server/api/routers/resume.ts"
//   },
//   points: {
//     start_point: "export const ResumeSchema = z.object({",
//     end_point: "export type Resume = z.infer<typeof ResumeSchema>"
//   }
// })
