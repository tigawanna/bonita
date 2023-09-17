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

You can also add new pages to your project using
```sh
bonita page [PageName]
```
example
```sh
pnpm bonita page about
```
adds the files 
- about/AboutLayout.tsx
- about/AboutPage.tsx
 > *In tanstack router it also adds the config file 
 and imports it into the main router definition*

Redwood and rakkas support is still a work in progress.
