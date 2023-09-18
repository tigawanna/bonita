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


