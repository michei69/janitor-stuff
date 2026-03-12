import { patchChatLinks } from "../hiddengems"
import { patchChatUI } from "./ChatUIStuff"
import { patchSearchUI } from "./SearchUIStuff"

function createElement(...args: any) {
    //@ts-ignore
    const res = wnd.Janitor.Hooks.ReactCreateElement.apply(this, args)

    patchChatUI()
    patchChatLinks()
    patchSearchUI()

    return res
}

export async function hookReactCreateElement() {
    wnd.Janitor.React.default.createElement = createElement
    console.log("hooked react createElement")
}