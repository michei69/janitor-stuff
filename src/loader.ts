import { HTMLClasses } from "./classes"

function search(obj: any, query: string) {
    if (typeof obj != "object" || !obj) return
    for (let o of Object.values(obj)) {
        if (typeof o != "object" || !o) continue
        if (query in o && typeof (o as any)[query] != "undefined") return o
    }
}
function loadReact() {
    wnd.Janitor.ReactDOM = search(wnd.Janitor.MainModule, "createRoot")
    // wnd.Janitor.ReactJSX = search(wnd.Janitor.MainModule, "jsx")
}

const classRegex = /\.(_[a-zA-Z0-9_]+)/gm
const loaded: string[] = []
let pr: Promise<void>
export async function fetchClassesFromCSS() {
    const sheets = [...document.styleSheets as any as CSSStyleSheet[]]
        .filter(a =>
            a.href &&
            a.href.startsWith("http") && // ignore extensions
            a.href.includes("assets.janitorai.com") // only website styles
        )
        .filter(a => !loaded.includes(a.href!.split("/").pop() as string))

    if (sheets.length == 0) return;
    loaded.push(...sheets.map(sheet => sheet.href!.split("/").pop() as string))

    const hrefs = sheets.map(sheet => sheet.href) as string[]
    const promises: Promise<void>[] = []
    for (const href of hrefs) {
        // ugly ass shit cuz csp
        promises.push(new Promise(resolve => GM.xmlHttpRequest({
            method: "GET",
            url: href,
            onload: (res: any) => {
                const content = res.responseText

                const mod = href.split("/").pop() as string
                const classList = new Set<string>()

                for (const match of content.matchAll(classRegex)) {
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
export async function setUpClassFetching() {
    if (pr) await pr
    pr = fetchClassesFromCSS()
    await pr
    const observer = new MutationObserver(async (mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length < 1) return
            for (const node of mutation.addedNodes as any) {
                if (!node.href || !node.href.endsWith(".css") || !node.href.includes("assets.janitorai.com")) return
                if (pr) await pr
                pr = fetchClassesFromCSS()
                break;
            }
        }
    })
    observer.observe(
        document.head,
        {
            childList: true
        }
    )
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