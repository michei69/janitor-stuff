import fs from "fs"

export default function userscriptHeaderPlugin() {
    return {
        name: 'userscript-header',
        setup(build: any) {
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const dev = build.initialOptions.outfile.includes("-dev");

            const header = 
`// ==UserScript==
// @name         janitor stuff
// @namespace    https://github.com/michei69/janitor-stuff
// @version      ${today}
// @description  fixes and qol for janitor ai
// @author       michei69
// @match        *://janitorai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=janitorai.com
// @grant        GM.xmlHttpRequest
// @sandbox      MAIN_WORLD
// @run-at       document-start${!dev ? "" : `
// @require      file://${process.cwd().replaceAll("\\", "/")}/${build.initialOptions.outfile}`}
// @downloadURL  https://raw.githubusercontent.com/michei69/janitor-stuff/refs/heads/master/${build.initialOptions.outfile}
// @updateURL    https://raw.githubusercontent.com/michei69/janitor-stuff/refs/heads/master/${build.initialOptions.outfile}
// @supportURL   https://github.com/michei69/janitor-stuff
// @homepage     https://github.com/michei69/janitor-stuff
// ==/UserScript==

`;

            build.onStart(async () => {
                console.log('Building...');
            });

            build.onEnd(async (_: any) => {
                fs.readdirSync("dist").forEach(file => {
                    if (file.endsWith(".user.js")) {
                        const content = fs.readFileSync(`dist/${file}`, "utf-8");
                        if (content.startsWith("// ==UserScript==")) return

                        fs.writeFileSync(`dist/${file}`, header + fs.readFileSync(`dist/${file}`));
                    }
                });
            });
        }
    };
}