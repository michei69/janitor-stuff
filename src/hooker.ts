// haha
// hooker!
// ...get it?

function patchMessagesStore(store: any) {
    // Force all messages to be deletable
    store.canBeDeleted = (_: any) => true;

    // Force initial message to be editable
    if (typeof store.canEditMessage_ORIGINAL == "undefined")
        store.canEditMessage_ORIGINAL = store.canEditMessage
    store.canEditMessage = (s: any) => {
        if (s.id == (store.messages.at(0).id ?? 0)) {
            let resp = store.canEditMessage_ORIGINAL.call(store, {
                ...s,
                id: 1
            })
            return resp
        }
        return store.canEditMessage_ORIGINAL.call(store, s)
    }
    if (typeof store.chatStore != "undefined") {
        if (typeof store.chatStore.bufferedMessageStore != "undefined") {
            if (typeof store.chatStore.bufferedMessageStore.pauseBufferedStreaming != "undefined" && typeof store.chatStore.bufferedMessageStore.unpauseBufferedStreaming != "undefined") {
                //* Disabling the buffered streaming cause its ugly AF
                store.chatStore.bufferedMessageStore.pauseBufferedStreaming = store.chatStore.bufferedMessageStore.unpauseBufferedStreaming
            }
        }
    }
}

//* search and capture stores
export const isStore = (name: string) => name.toLowerCase().endsWith("store")
export async function searchForStores(obj: any) {
    if (typeof obj != "object") return
    if (!obj) return
    for (let key of Object.keys(obj)) {
        try {
            if (wnd.Janitor.Stores[key]) continue
            if (key == "displayMessage") {
                //* Save the toastify thing
                wnd.Janitor.Toastify = obj[key]
                continue
            }
            if (!isStore(key)) continue
            if (!obj[key]) continue;

            const split = key.split("-") // split the store name
            wnd.Janitor.Stores[split[split.length-1]!!] = obj[key]
            await searchForStores(obj[key])
        } catch {
            continue
        }
    }
}

//* patches store props for char search n shi
async function patchStoreProps() {
    if (typeof wnd.Janitor.StoreProps.getCharacters == "undefined") return
    if (typeof wnd.Janitor.StoreProps.getCharacters_ORIGINAL == "undefined")
        wnd.Janitor.StoreProps.getCharacters_ORIGINAL = wnd.Janitor.StoreProps.getCharacters

    wnd.Janitor.StoreProps.getCharacters = ({ page, ...args }: any) => {
        // makes the hidden gems tab actually useful
        if (args.special_mode == "hidden_gems") {
            args.proxyenabled = true
            args.tokens = 500
            args.tokens_mode = "gte"
            args.tag_id = wnd.Janitor.HiddenGemsFurryFilter ? [1, 53] : [1]
        }
        return wnd.Janitor.StoreProps.getCharacters_ORIGINAL({ page: page, ...args })
    }
}

//* process define prop
export default function processDefineProp(obj: any, prop: any, descriptor: PropertyDescriptor & ThisType<any>) {
    // console.log(prop)
    if (typeof prop == "string") {
        if (prop.includes("createElement"))
            wnd.Janitor.React = obj
        else if (prop.includes("__esModule")) {
            wnd.Janitor.esModules.push(obj)
        }
    }
    if (descriptor.value == "Module") {
        // console.log(obj, prop, descriptor)
        wnd.Janitor.esModules.push(obj)
    }
    if (typeof obj != "object") return
    for (let key of Object.keys(obj)) {
        if (key.trim() == "messagesStore") {
            patchMessagesStore(obj[key])
        }
        if (key.toLowerCase().includes("store") || (typeof prop == "string" && prop.toLowerCase().includes("store"))) {
            if (key.toLowerCase().includes("storeprops")) {
                wnd.Janitor.StoreProps = obj
                patchStoreProps()
                continue
            }
            
            searchForStores(obj[key])
            break
        }
    }
}

export function processHasOwnProp(tsObj: any, prop: PropertyKey) {
    // if (prop.toString().toLowerCase().includes("default") || prop.toString().includes("__"))
    //     console.log(tsObj, prop)
}