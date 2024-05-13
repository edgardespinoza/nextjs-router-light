# create a new project

## configure prisma

```js
npx create-next-app@latest .
```

- install prisma

```js
npm i -D ts-node prisma
```

- create schema prisma

```js
npx prisma init --datasource-provider postgresql
```

- create database to server

```js
npx prisma migrate dev --name init
```

- pull and push database

```js
npx prisma db pull
npx prisma db push
```

## configure Nextjs with Tailwind

- To choose default, slate and yes

```js
npx shadcn-ui@latest init
```

- Go to `https://ui.shadcn.com/docs/installation/next`
  use Vercel to deploy `https://vercel.com/`
