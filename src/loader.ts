import { HTMLClasses } from "./classes"

function search(obj: any, query: string) {
    if (typeof obj != "object" || !obj) return
    for (let o of Object.values(obj)) {
        if (typeof o != "object" || !o) continue
        for (let key of Object.keys(o as any)) {
            if (key.includes(query)) return o
        }
    }
}
function loadReact() {
    wnd.Janitor.ReactDOM = search(wnd.Janitor.MainModule, "hydrateRoot")
    wnd.Janitor.ReactJSX = search(wnd.Janitor.MainModule, "jsx")
}

const loaded: string[] = []
let pr: Promise<any> | null = null
export async function fetchClassesFromJS() {
    // @ts-ignore
    const hrefs = [...document.querySelectorAll("link[as='script'][rel='modulepreload'][href]")]
        .map(el => el.href)
        .filter(lnk => {
            const mod = lnk.split("/").pop() as string
            return !mod.includes("Store") &&
                !HTMLClasses.getInstance().existsFile(mod.replace(".js", "")) &&
                !loaded.includes(lnk) //mod[0] == mod[0]?.toUpperCase() &&
        })

    if (!hrefs.length) return;
    loaded.push(...hrefs)

    const promises: Promise<void>[] = []
    for (const href of hrefs) {
        // ugly ass shit cuz csp
        promises.push(new Promise(resolve => GM.xmlHttpRequest({
            method: "GET",
            url: href,
            onload: (res: any) => {
                const content = res.responseText

                const mod = href.split("/").pop().replace(".js", "") as string
                const classList = new Set<string>()

                for (const match of content.matchAll(/"(_[^"]*_[^"]*)"/gm)) {
                    classList.add(match[1] as string)
                }

                HTMLClasses.getInstance().addFile(mod, classList)
                console.log(`loaded ${mod} (${classList.size})`)
                resolve(void 0)
            }
        })))
    }
    await Promise.allSettled(promises)
}
export async function fetchClassesFromJSAwait() {
    if (pr) await pr
    pr = fetchClassesFromJS()
    await pr
}

export async function bootstrap() {
    let moduleName = ""

    //@ts-ignore
    for (let sc of document.querySelectorAll("script[src]"))
        if (sc.src.includes("/index-")) {
            moduleName = sc.src
            break
        }

    const sc = document.createElement("script")
    sc.type = "module"

    const code =
        `import * as main from "${moduleName}";
(async () => {
    while (typeof window.Janitor == "undefined") await new Promise(resolve => setTimeout(resolve, 100));
    window.Janitor.MainModule = main
})()`


    sc.textContent = code
    document.body.appendChild(sc)
    while (typeof wnd.Janitor.MainModule == "undefined" || wnd.Janitor.MainModule == null) await new Promise(resolve => setTimeout(resolve, 100));
    document.body.removeChild(sc)

    loadReact()
}