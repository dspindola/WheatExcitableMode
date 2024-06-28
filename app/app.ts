import { Elysia, redirect, t, type Context } from "elysia";
import { handleResponse, setup } from "./entry.server";
import { Client } from "@replit/object-storage";

const client = new Client()

function api() {
  return new Elysia({ prefix: '/api' })
    .post('/auth/sign-in', ({ body }) => {
      console.log(body)
      return redirect('/')
    },
      {
        body: t.Object({
          email: t.String({ format: "email" }),
          password: t.String()
        })
      })
    .post('/upload', async ({ body }) => {
      console.log(body.name)
      const file = Bun.file(`.tmp/${body.name}`)
      await Bun.write(file, body.file)
      const res = await client.uploadFromBytes(body.name, Buffer.from(await file.arrayBuffer()))
      const out = await Bun.$`rm -rf ${file.name}`.text()
      console.log(out)

      return {
        ok: res?.ok,
        name: body.name,
        value: res?.value,
        error: res?.error
      }
    }, {
      body: t.Object({
        file: t.File(),
        name: t.String()
      })
    })
    .get('/list', async () => await client.list())
}

export default setup.get('*', handleResponse)
  .use(api())