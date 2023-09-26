import { pascal } from 'radash'
import { camel } from 'radash'

export function routeTemplates(model: string) {

const pascal_case_model = pascal(model)
const camel_case_model = camel(model)
const dynamic_path = `[${model.toLowerCase()}].tsx`

const routes={
"index.tsx":` import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Link from "next/link";

interface ${pascal_case_model}PageProps {}

export default function ${pascal_case_model}Page({}: ${pascal_case_model}PageProps) {
 const user_id= useRouter().query.id as string
    const query = api.${camel_case_model}.getAll.useQuery();

   if (query.isLoading) {
    return (
      <div className="flex h-full  w-full items-center justify-center p-2 min-h-[300px]">
        <span className="loading loading-infinity loading-lg text-warning"></span>
      </div>
    );
  }
  if (query.isError) {
    return (
      <div className="flex h-full  w-full items-center justify-center p-2 min-h-[300px]">
        <div className="rounded-lg border p-2 text-error">
          {query.error.message}
        </div>
      </div>
    );
  }
  if(!query.data){
    return (
      <div className="flex h-full  min-h-[300px] w-full items-center justify-center p-2">
        <div className="flex  flex-col items-center justify-center gap-2 rounded-lg p-2  text-warning">
          <h2 className="text-2xl font-bold">No matches found</h2>

          <Link
            className="btn btn-outline text-accent"
            href={profile/{router.query.id}}>
                Go back
          < /Link>
      < /div>
      < /div>
    );
}

  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-2 relative">
      <div className="flex h-full w-full items-center justify-center">
        ${pascal_case_model}
         </div>
      </div>
  )
}
`,
"new.tsx":`
interface New${pascal_case_model}PageProps {}

export default function New${pascal_case_model}Page({}: New${pascal_case_model}PageProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex w-full  items-center justify-center">
        ${pascal_case_model}s
      </div>
    
    </div>
  );
}
`,
[dynamic_path]:`
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Link from "next/link";

interface ${pascal_case_model}PageProps {}

export default function ${pascal_case_model}Page({}: ${pascal_case_model}PageProps) {
  const router = useRouter();
  const ${model.toLowerCase()}_id = router.query.${model.toLowerCase() } as string;
//   change to ${pascal_case_model}
  const query = api.${camel_case_model}.getOne.useQuery({
    id:${model.toLowerCase()}_id,
  });

  if (query.isLoading) {
    return (
      <div className="flex h-full  w-full items-center justify-center p-2 min-h-[300px]">
        <span className="loading loading-infinity loading-lg text-warning"></span>
      </div>
    );
  }
  if (query.isError) {
    return (
      <div className="flex h-full  w-full items-center justify-center p-2 min-h-[300px]">
        <div className="rounded-lg border p-2 text-error">
          {query.error.message}
        </div>
      </div>
    );
  }
  if(!query.data){
    return (
      <div className="flex h-full  min-h-[300px] w-full items-center justify-center p-2">
        <div className="flex  flex-col items-center justify-center gap-2 rounded-lg p-2  text-warning">
          <h2 className="text-2xl font-bold">No matches found</h2>

          <Link
            className="btn btn-outline text-accent"
            href={profile/{router.query.id}}>
                Go back
          < /Link>
      < /div>
      < /div>
    );
}

return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex h-full w-full items-center justify-center">
        ${model} ID : {${model.toLowerCase}_id}
      </div>
    </div>
  );
}


`
}
return routes
    
} 
