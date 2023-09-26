import { pascal } from 'radash'
import { camel } from 'radash'
import { getApiRouteSchema, } from './readFile'


export function apiRoutesTemplate(model:string) {
const pascal_case_model = pascal(model)
const camel_case_model = camel(model)
const schema_start = `export const ${pascal_case_model}Schema = z.object({`
const schema_end = `export type ${pascal_case_model} = z.infer<typeof ${pascal_case_model}Schema>`

const route_schema = getApiRouteSchema({
      schema_path: `prisma/generated/zod/index.ts`,
      points: {
        start_point: schema_start,
        end_point:schema_end,
      },
}) ?? `export const ${pascal_case_model}Schema = z.object({
  id: z.string().optional(),
  // createdAt: z.string().optional(),
  // updatedAt: z.string().optional(),
  // if you're seeing this you probably have not added zod-prisma-types
  //  you can delete this file and re-run the script after adding it  
 // or just add the schema manually
   
});
export type ${pascal_case_model} = z.infer<typeof ${pascal_case_model}Schema>;
`
  
const route= `
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


${route_schema}

export const ${camel_case_model}Router = createTRPCRouter({

  
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.${camel_case_model}.findMany();
  }),
  
  getOne: publicProcedure
  .input(z.object({ id: z.string() }))
  .query(({ ctx,input }) => {
    return ctx.prisma.${camel_case_model}.findUnique({ where: { id:input.id }});
  }),

  addNew: publicProcedure
    .input(${pascal_case_model}Schema)
  .mutation(({ ctx,input }) => {
    return ctx.prisma.${camel_case_model}.create({ data: input });
  }),

  updateOne: publicProcedure
    .input(${pascal_case_model}Schema)
  .mutation(({ ctx,input }) => {
    return ctx.prisma.${camel_case_model}.update({ where: { id:input.id }, data: input });
  }),

  removeOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.project.delete({ where: { id: input.id } });
  }),

  removeAll: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.project.deleteMany();
    })


});

`
return{
schema_start,
schema_end,
route
}

}
