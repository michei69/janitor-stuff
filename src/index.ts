import patchChat, { patchMessagesStore } from "./chat";
import patchWhatever from "./hiddengems";
import processDefineProp from "./hooker";
import patchSearch from "./search";
import { bootstrap } from "./loader";
import setupTTS, { ToggleDeltaTTS, ToggleTTS } from "./tts";
import { disableEventLogger } from "./disableLogger";

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
            SaveMessage: (message) => {},
            ReactCreateElement: (...args) => {}
        },
        Toastify: null as any,
        Stores: {},
        TTSEnabled: localStorage.getItem("TTSEnabled") == "true",
        Generation: {},
        HiddenGemsFurryFilter: false,
        Navigate: (...args) => {},
        InitState: null,
        React: null,
        ReactDOM: null,
        ReactJSX: null,
        esModules: [],
        MainModule: null,
        Urls: new Set()
    }
    disableEventLogger()

    // hook stores n stuff
    const defineProperty = Object.defineProperty
    wnd.Object.defineProperty = (obj: any, prop: any, descriptor: PropertyDescriptor & ThisType<any>) => {
        const result = defineProperty(obj, prop, descriptor)
        if (document.body && document.body.innerText.includes("security verification")) return result
        processDefineProp(obj, prop, descriptor)
        return result
    }

    const processStore = (name: string, store: any) => {
        switch (name) {
            case "mainStore":
                wnd.Janitor.Toastify = store.displayMessage
                break;
            case "chatStore":
                patchChat(store)
                patchMessagesStore(store.messagesStore)
                break;
            case "parentStore":
                patchSearch(store)
                break;
        }
    }

    const arrayReduce = Array.prototype.reduce
    wnd.Array.prototype.reduce = function (...args: any) {
        const result: any = arrayReduce.apply(this, args)
        for (const arg of args) {
            if (typeof arg == "object" && "relativeStores" in arg) {
                for (const [key, val] of Object.entries(arg.relativeStores)) {
                    wnd.Janitor.Stores[key] = val
                    processStore(key, val)
                }
                for (const [key, val] of Object.entries(arg.globalStores)) {
                    wnd.Janitor.Stores[key] = val
                    processStore(key, val)
                }
                for (const [key, val] of Object.entries(arg.parentStores)) {
                    wnd.Janitor.Stores[key] = val
                    processStore(key, val)
                }
            }
        }
        if (typeof result == "object" && "urls" in result && result.urls) {
            for (const url of result.urls)
                wnd.Janitor.Urls.add(url)
        }
        return result
    }

    // setup tts
    if (wnd.Janitor.TTSEnabled) setupTTS();

    console.log("Janitor qol n shi loaded!");

    // wait for react to instantiate cuz SSR has to hydrate n shi
    while (
        typeof wnd.Janitor.React == "undefined" || 
        typeof wnd.Janitor.React?.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED == "undefined" ||
        typeof wnd.Janitor.React?.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.ReactCurrentDispatcher == "undefined" ||
        typeof wnd.Janitor.React?.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.ReactCurrentDispatcher?.current == "undefined"
    )
    {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log("load react")
    bootstrap()
    
    // toastify is never loaded istfg
    while (typeof wnd.Janitor.Toastify == "undefined" || typeof wnd.Janitor.Toastify?.showInfo == "undefined") {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    wnd.Janitor.Toastify.showInfo("Loaded!")
    patchWhatever()
})()