import { HTMLClasses } from "../classes"
import { patchChatLinks } from "../hiddengems"
import { fetchClassesFromJSAwait } from "../loader"
import { patchChatUI } from "./ChatUIStuff"
import { patchSearchUI } from "./SearchUIStuff"

function createElement(...args: any) {
    //@ts-ignore
    const res = wnd.Janitor.Hooks.ReactCreateElement.apply(this, args)
    document.querySelectorAll("[class]").forEach(a => HTMLClasses.getInstance().add(a.classList))
    fetchClassesFromJSAwait()

    patchChatUI()
    patchChatLinks()
    patchSearchUI()

    return res
}

export async function hookReactCreateElement() {
    wnd.Janitor.React.default.createElement = createElement
    console.log("hooked react createElement")
}