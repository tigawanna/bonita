# BONITA CLI

Ultimate CLI tool for frontend frameworks

run 
```sh
npx/pnpm dlx/yarn bonita [add] or [page]
```
you can also add it asadev dependancy 

```sh
npm i -D bonita
yarn add -D bonita
pnpm i -D bonita
```


## options:
All the commands have the following options ,which can be passed in to avoid the prompts

```ts
    .option("-rd, --root-dir <root_dir>", "Root directory")
    .option("-rf, --root-file <root_file>", "Root file",)
    .option("-rs, --root-styles <root_styles>", "Root styles file")
  
    .option("-af, --app-file <app_file>", "App file")
    .option("-routes, --routes-dir <routes_dir>", "Routes dir")
  
    .option("-cd, --components <components>", "Compnents dir")
    .option("-sd, --state <state>", "State dir")
  
    .option("-tw, --tw-config <tw_config>", "tailwind config path",)
    .option("-panda, --panda-config <panda_config>", "panda config path",)
    .option("-p, --plugins <plugins...>", "Plugins")
  
    .option('-y, --yes', 'Accept all defaults', false)
```
ex:
```sh
npx bonita add tailwind -y --root-dir ./src --root-file ./src/main.tsx --root-styles ./src/index.css  --plugins daisyui --tw-config tailwind.config.js
```

passing in all the options a command requires will bypass the prompts , if a required option is missing it will propmpt for it

## commands 

### bonita add

- Adding tailwind 
```sh
npx bonita add tailwind
yarn bonita add tailwind
pnpm dlx bonita add tailwind
```



This command currently works for 
- tailwind
- pandacss
- tanstack


Options
- tailwind
  
```ts
    .option("-rd, --root-dir <root_dir>", "Root directory")
    .option("-rf, --root-file <root_file>", "Root file",)
    .option("-rs, --root-styles <root_styles>", "Root styles file")
    .option("-tw, --tw-config <tw_config>", "tailwind config path",)
    .option("-p, --plugins <plugins...>", "Plugins")

```
- pandacss

```ts
    .option("-rd, --root-dir <root_dir>", "Root directory")
    .option("-rf, --root-file <root_file>", "Root file",)
    .option("-rs, --root-styles <root_styles>", "Root styles file")
    .option("-panda, --panda-config <panda_config>", "panda config path",)
```
- tanstack
  
```ts
    .option("-rd, --root-dir <root_dir>", "Root directory")
    .option("-rf, --root-file <root_file>", "Root file",)
    .option("-rs, --root-styles <root_styles>", "Root styles file")
  
    .option("-af, --app-file <app_file>", "App file")
    .option("-routes, --routes-dir <routes_dir>", "Routes dir")
  
    .option("-cd, --components <components>", "Compnents dir")
    .option("-sd, --state <state>", "State dir")
  ```

Currently supported frameworks:
### React
    - Vite SPA
    - Next.js
    - Redwood
    - Rakkasjs






running 
```sh
bonita add tanstack
```
In Nextjs or rakkas will only add tanstack query ,and will add query + router in vite SPA

### bonita gen
 sub commands 
 - route : generate a route , which will create boilerplate for
   - The route directory
   - a layout file
   - a route file
   - a dynamic route file

```sh
bonita gen route Route1 Route2
```

example
```sh
pnpm bonita gen route user about
```
to generate the user and about routes



-  model: 🚧



### bonita create 🚧

Currentlt only supports rakkasjs 
- Rakkasjs will pull in a [trpc + prisma + tailwind + typescript template](https://github.com/tigawanna/trpc-rakkas.git) for now , fine grained choice might be added later


