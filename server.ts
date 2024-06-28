import app from "./app/app";

const isReplit = process.env.REPL_ID
const hostname = isReplit ? '0.0.0.0' : 'localhost'

app.listen({
    hostname,
}, ({ url }) => {
    console.log('%s', url)
})