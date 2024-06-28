import { Elysia, redirect, t, type Context } from "elysia";
import { handleResponse, setup } from "./entry.server";

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
    })
}

export default setup.get('*', handleResponse)
  .use(api())