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

export async function bootstrap() {
    let moduleName = ""

    //@ts-ignore
    for (let sc of document.querySelectorAll("script")) 
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