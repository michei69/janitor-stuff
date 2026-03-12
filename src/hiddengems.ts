var patchingChatLinks = false
export async function patchChatLinks() {
    if (patchingChatLinks) return
    patchingChatLinks = true
    document.querySelectorAll("a[target=\"_blank\"]").forEach((node) => {
        if ((node as HTMLLinkElement).href.includes("/chats")) {
            (node as HTMLLinkElement).removeAttribute("target")
        }
    })
    patchingChatLinks = false
}