import esbuild from "esbuild";
import userscriptHeaderPlugin from "./plugins/userscript";

(async () => {
    const watch = process.argv.includes('--watch');
    const data = {
        entryPoints: ['src/index.ts'],
        bundle: true,
        minify: !watch,
        outfile: watch ? "dist/index-dev.user.js" : "dist/index.user.js",
        plugins: [userscriptHeaderPlugin()]
    }

    if (watch) {
        const ctx = await esbuild.context(data)
        await ctx.watch()
    } else {
        await esbuild.build(data)
    }
})()