
export const createRouter = () => new Bun.FileSystemRouter({
    dir: "app/routes",
    style: "nextjs",
    fileExtensions: [
        ".html"
    ],
    assetPrefix: "/",
    origin: 'https://fb69868b-214b-4e2e-8105-deeaa0bfe497-00-3eyhg0mk96rb5.picard.replit.dev'
});
