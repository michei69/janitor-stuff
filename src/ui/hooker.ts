import { patchChatUI } from "./ChatUIStuff"

function createElement(...args: any) {
    //@ts-ignore
    const res = wnd.Janitor.Hooks.ReactCreateElement.apply(this, args)

    patchChatUI()

    return res
}

export async function hookReactCreateElement() {
    wnd.Janitor.React.default.createElement = createElement
    console.log("hooked react createElement")
}