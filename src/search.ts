export default async function patchSearch(parentStore: ParentStore) {
    while (typeof parentStore.getCharacters != "function") await new Promise(resolve => setTimeout(resolve, 100));
    if ((parentStore as any).getCharacters.patched) return

    if (typeof (parentStore as any).getCharacters_ORIGINAL == "undefined") {
        (parentStore as any).getCharacters_ORIGINAL = parentStore.getCharacters
    }
    parentStore.getCharacters = async ({ page, ...args }: { page: number } & CharacterListParams) => {
        if (args.special_mode == "hidden_gems") {
            args.proxyenabled = true
            args.tokens = 500
            args.tokens_mode = "gte"
            args.tag_id = wnd.Janitor.HiddenGemsFurryFilter ? [1, 53] : [1]
        }

        const result = await (parentStore as any).getCharacters_ORIGINAL({ page, ...args })
        parentStore.characters = parentStore.characters
            .filter((v) => v.is_proxy_enabled && v.avatar != "placeholder-nsfw.webp") // remove non-proxy and no-pfp
            .sort((v1, v2) => v2.total_tokens - v1.total_tokens) // sort by token count in descending order
            
        console.warn("filtered characters", parentStore.characters.length)
        return result
    };
    (parentStore as any).getCharacters.patched = true

    console.log("patched search")
}