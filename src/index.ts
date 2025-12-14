import patchChat from "./chat";
import patchWhatever from "./hiddengems";
import processDefineProp, { isStore, searchForStores } from "./hooker";
import patchSearch from "./search";
import setupTTS, { ToggleDeltaTTS, ToggleTTS } from "./tts";

(async () => {
    // we js need a window object bruh
    const wnd: Window = typeof unsafeWindow != "undefined" ? unsafeWindow : window
    globalThis.wnd = wnd

    //* Setting up
    wnd.Janitor = {
        ToggleTTS: ToggleTTS,
        ToggleDeltaTTS: ToggleDeltaTTS,
        UseDeltaForTTS: localStorage.getItem("UseDeltaForTTS") == "true",
        Hooks: {
            Delta: (...args) => {},
            StopStream: (...args) => {},
            SaveMessage: (message) => {}
        },
        Toastify: null as any,
        Stores: {},
        StoreProps: {},
        TTSEnabled: localStorage.getItem("TTSEnabled") == "true",
        Generation: {},
        HiddenGemsFurryFilter: false,
        Navigate: (...args) => {},
        InitState: null
    }

    // hook stores n stuff
    const defineProperty = Object.defineProperty
    wnd.Object.defineProperty = (obj: any, prop: any, descriptor: PropertyDescriptor & ThisType<any>) => {
        const result = defineProperty(obj, prop, descriptor)
        if (document.body && document.body.innerText.includes("security verification")) return result
        processDefineProp(obj, prop, descriptor)
        return result
    }
    const mapHas = Map.prototype.has
    Map.prototype.has = function (...args) {
        for (let key of this.keys())
            if (typeof key == "string" && isStore(key)) {
                searchForStores(Object.fromEntries(this))
                break
            }
        
        return mapHas.call(this, ...args)
    }

    // setup tts
    if (wnd.Janitor.TTSEnabled) setupTTS();

    // Wait for the generation store for chat stuff
    (async () => {
        if (!window.location.href.includes("/chat")) return
        while (typeof wnd.Janitor.Stores.generationStore == "undefined") {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        await patchChat()
    })();

    // Wait for store props for search stuff
    (async () => {
        if (!window.location.href.includes("/search")) return
        while (typeof wnd.Janitor.StoreProps == "undefined" || typeof wnd.Janitor.StoreProps.getCharacters == "undefined") {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        await patchSearch()
    })();

    // react to nav changes
    (async () => {
        while (typeof wnd.Janitor.Stores.navigatorStore == "undefined" || typeof wnd.Janitor.Stores.navigatorStore.navigate == "undefined") {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        wnd.Janitor.Navigate = wnd.Janitor.Stores.navigatorStore.navigate // reactrouter

        var lastHref = window.location.href
        const observer = new MutationObserver(_ => {
            if (window.location.href != lastHref) {
                lastHref = window.location.href
                if (window.location.href.includes("/chat")) {
                    patchChat()
                } else if (window.location.href.includes("/search")) {
                    patchSearch()
                }
                patchWhatever()
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    })();

    console.log("Janitor qol n shi loaded!");

    // wait cuz SSR has to hydrate n shi
    // TODO: hook sth so i dont have to guess like this
    await new Promise(resolve => setTimeout(resolve, 5000));
    unsafeWindow.Janitor.Toastify.showInfo("Loaded!")
    patchWhatever()
})()