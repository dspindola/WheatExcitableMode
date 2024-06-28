import { cors } from "@elysiajs/cors";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import { Elysia, type Context } from "elysia";
import { createRouter } from "./router";
import type { BunFile, MatchedRoute } from "bun";

export const setup = new Elysia()
  .use(staticPlugin({
    prefix: '/',
    noCache: true,
  }))
  .use(cors())
  .use(html())

export async function transform(templateFile: BunFile, response: Response) {
  return new HTMLRewriter().on('div[id="root"]', {
    async element(el) {
      el.setInnerContent(await response.text(), {
        html: true
      })
    }
  }).transform(new Response(templateFile))
}


export async function handleRequest({ request, path }: Context) {
  const skip = [
    "/favicon.svg",
    "/robots.txt",
    "/sitemap.xml"
  ]


  if (skip.includes(path)) {
    return {
      response: new Response(Bun.file(`public/${path}`)),
    }
  }

  const router = createRouter()

  router.reload()

  const route = router.match(request);

  if (!route) {
    return {
      response: new Response("Not found", {
        status: 404
      }),
    }
  }

  return { response: new Response(Bun.file(route.filePath)), }
}

export async function handleResponse(ctx: Context) {
  const { response } = await handleRequest(ctx)

  return (await transform(Bun.file('app/template.html'), response)).text()
}