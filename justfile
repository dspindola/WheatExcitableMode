default:
    echo 'Hello, world!'

dev:
    bun run --port=8080 --smol --watch ./index.ts