import { redirect, t, type Context } from "elysia";
import { setup } from "./setup";

const router = new Bun.FileSystemRouter({
  dir: "routes",
  style: "nextjs",
  fileExtensions: [
    ".html"
  ],
  assetPrefix: "/",
  origin: 'https://fb69868b-214b-4e2e-8105-deeaa0bfe497-00-3eyhg0mk96rb5.picard.replit.dev'
});

const skip = [
  "/favicon.svg",
  "/robots.txt",
  "/sitemap.xml"
]

async function handle({ request, path }: Context) {
  if (skip.includes(path)) {
    return Bun.file(`public/${path}`)
  }

  const route = router.match(request);

  if (!route) {
    return new Response("Not found", {
      status: 404
    })
  }

  const html = new Response(Bun.file('template.html'))

  return new HTMLRewriter().on('div[id="root"]', {
    async element(el) {
      el.setInnerContent(await Bun.file(route.filePath).text(), {
        html: true
      })
    }
  }).transform(html).text()
}

const app = setup.get('*', handle)
  .group('/api', api => api.post('/auth/sign-in', ({ body }) => {
    console.log(body)
    return redirect('/')
  }, {
    body: t.Object({
      email: t.String({ format: "email" }),
      password: t.String()
    })
  }).post('/upload', async ({ body }) => {
    console.log(body.name)
    await Bun.write(`.tmp/${body.name}`, body.file)
    return {
      ok: true,
      data: {
        name: body.name
      }
    }
  }, {
    body: t.Object({
      file: t.File(),
      name: t.String()
    })
  }))
  .listen({
    hostname: "0.0.0.0",
    lowMemoryMode: true
  })