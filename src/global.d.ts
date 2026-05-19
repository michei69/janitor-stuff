declare interface Window {
    Janitor: {
        Hooks: {
            Delta: (...args) => void,
            StopStream: (...args) => void,
            SaveMessage: (message) => void,

            ReactCreateElement: (...args) => void,
        },
        Toastify: Toastify,
        Stores: { [key: string]: any },
        Generation: { [key: string]: any },
        Navigate: (...args) => void,
        React: any,
        ReactDOM: any,
        ReactJSX: any,
        esModules: any[],
        MainModule: any,
        Urls: Set<string>,
        Settings: {
            TTSEnabled: boolean,
            UseDeltaForTTS: boolean,
            HiddenGemsFurryFilter: boolean,
            Dev: boolean,
            RandomizeTemperature: boolean,
            IgnoredBots: Set<string>,
            LoadOnlyInChat: boolean,
        },
        Search: {
            SpecialMode: "none" | "hidden_gems" | "trending" | "trending24" | "newcomer",
            IgnoreBot: (characterId: string) => void,
        },
        Helpers: {
            fetchSystemMessage: () => Promise<string | undefined>
        }
    },
    Object: ObjectConstructor,
    Array: ArrayConstructor,
    mbxM: any,
    __STATSIG__: any,
}

declare type Toastify = {
    showError: (message: string, sth1?, sth2?) => void,
    showInfo: (message: string) => void,
    showWarning: (message: string) => void,
    showSuccess: (message: string) => void
}