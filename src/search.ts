export default async function patchSearch() {
    if (typeof wnd.Janitor.StoreProps == "undefined" || typeof wnd.Janitor.StoreProps.getCharacters == "undefined") return
    if (wnd.Janitor.StoreProps.getCharacters.patched) return

    if (typeof wnd.Janitor.StoreProps.getCharacters_ORIGINAL == "undefined") {
        wnd.Janitor.StoreProps.getCharacters_ORIGINAL = wnd.Janitor.StoreProps.getCharacters
    }
    wnd.Janitor.StoreProps.getCharacters = async (...args: any[]) => {
        let result = await wnd.Janitor.StoreProps.getCharacters_ORIGINAL(...args)
        wnd.Janitor.StoreProps.characters = wnd.Janitor.StoreProps.characters
            .filter((v: any) => v.is_proxy_enabled && v.avatar != "placeholder-nsfw.webp") // remove non-proxy and no-pfp
            .sort((v1: any, v2: any) => v1.total_tokens < v2.total_tokens) // sort by token count
            
        console.warn("filtered characters", wnd.Janitor.StoreProps.characters.length)
        return result
    }
    wnd.Janitor.StoreProps.getCharacters.patched = true
}