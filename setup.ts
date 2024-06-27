import { cors } from "@elysiajs/cors";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";

export const setup = new Elysia()
  .use(staticPlugin({
    prefix: '/',
    noCache: true,
  }))
  .use(cors())
  .use(html())
