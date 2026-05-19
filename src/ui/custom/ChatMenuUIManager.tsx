import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import ChatBurgerButton from "../components/ChatBurgerButton"
import { HTMLClasses } from "../../classes"
import ChatMenuSwitch from "../components/ChatMenuSwitch"
import ChatPanel from "../components/ChatPanel"
import ChatPanelSection from "../components/ChatPanelSection"
import ChatPanelToggle from "../components/ChatPanelToggle"
import ChatPanelTextArea from "../components/ChatPanelTextArea"

export default function ChatMenuUIManager() {
    const [menuList, setMenuList] = useState(null as HTMLDivElement | null)
    const [menuDivider, setMenuDivider] = useState(null as HTMLDivElement | null)

    // this is ugly, but button refs dont work for some reason
    const [firstButton, setFirstButton] = useState(null as HTMLButtonElement | null)
    const [secondButton, setSecondButton] = useState(null as HTMLButtonElement | null)

    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [dev, setDev] = useState(wnd.Janitor.Settings.Dev)
    const [randTemp, setRandTemp] = useState(wnd.Janitor.Settings.RandomizeTemperature)
    const [sysPrompt, setSysPrompt] = useState("")
    const cls = HTMLClasses.getInstance()

    const exportMessages = useCallback(() => {
        const messages = (wnd.Janitor.Stores.chatStore as ChatStore).messagesStore.messages
        const json = JSON.stringify(messages)
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'messages.json';
        link.click();
        URL.revokeObjectURL(url);
    }, [])

    const importMessages = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = () => {
            const file = input.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async () => {
                    const data = JSON.parse(reader.result as string);
                    if (data && Array.isArray(data) && data.every(m => "message" in m && typeof m.message == "string" && "is_bot" in m && "is_main" in m)) {
                        const chatStore: ChatStore = wnd.Janitor.Stores.chatStore;
                        const chatId = (wnd.Janitor.Stores.chatStore as ChatStore).chatId;
                        await chatStore.messagesStore.deleteMessage(0);
                        const messages = await chatStore.settingsStore.endpoints.api.chat.createMessages({
                            data: data.map((m: ChatMessage) => ({ ...m, chat_id: chatId })),
                            urlParams: { chatId }
                        })
                        chatStore.messagesStore.setMessages(messages)
                        wnd.Janitor.Toastify.showSuccess("Messages imported")
                    } else {
                        wnd.Janitor.Toastify.showError("Invalid JSON")
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }, [])

    const resetChat = useCallback(() => {
        const chatStore: ChatStore = wnd.Janitor.Stores.chatStore;
        const chatId = (wnd.Janitor.Stores.chatStore as ChatStore).chatId;
        chatStore.messagesStore.deleteMessage(0);
        chatStore.settingsStore.endpoints.api.chat.createMessages({
            data: chatStore.chatInfo.character.first_messages.map((m: string) => ({
                message: m,
                is_bot: true,
                is_main: true,
                chat_id: chatId
            })),
            urlParams: { chatId }
        }).then((messages) => {
            chatStore.messagesStore.setMessages(messages)
            wnd.Janitor.Toastify.showSuccess("Messages reset")
        })
    }, [])

    const closeCb = useCallback(() => {
        if (!isOpen) return;
        setIsClosing(true)
        setTimeout(() => {
            setIsOpen(false)
            setIsClosing(false)
        }, 1000)
    }, [isOpen])

    const showWordCount = useCallback(() => {
        const msgs = (wnd.Janitor.Stores.chatStore as ChatStore).messagesStore.messages
        const count = msgs.map(v => v.message.split(" ").length).filter(v => v).reduce((v1, v2) => v1 + v2, 0)
        wnd.Janitor.Toastify.showInfo(`${count} words in this chat (${msgs.length} messages)`)
    }, [])

    // set up
    const refreshNodes = () => {
        const menuDivider = document.querySelector<HTMLDivElement>("div[class^='_menuDivider_']")
        setMenuDivider(menuDivider)
        setMenuList(document.querySelector<HTMLDivElement>("div[class^='_menuList_']"))
        if (menuDivider) {
            const first = document.getElementById("doggy-btn1")
            const second = document.getElementById("doggy-btn2")
            if (first) {
                setFirstButton(first as HTMLButtonElement)
            }
            if (second) {
                setSecondButton(second as HTMLButtonElement)
            }
        }
    }

    useEffect(() => {
        if (!menuDivider) return
        if (firstButton)
            menuDivider.before(firstButton)
        if (secondButton)
            menuDivider.before(secondButton)
    }, [menuDivider, firstButton, secondButton])

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type != "childList") continue
                if (mutation.addedNodes.length < 1) continue
                let refresh = false;
                for (const node of mutation.addedNodes as any) {
                    if (node.nodeType != 1) continue;
                    if (
                        node.classList.value.startsWith("_menuList_")
                    ) {
                        refresh = true;
                        break;
                    }
                }
                if (refresh) refreshNodes()
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        })

        return () => observer.disconnect()
    }, [])

    return <>
        {createPortal(<ChatBurgerButton
            id="doggy-btn1"
            disabled={false}
            className="DOGGY_dev"
            onClick={() => {
                setIsOpen(!isOpen);
            }}
            hidden={!menuDivider}
        >
            Doggo Menu
        </ChatBurgerButton>, document.body)}
        {createPortal(<ChatBurgerButton id="doggy-btn2" disabled={false} className="DOGGY_cwb" onClick={showWordCount} hidden={!menuDivider}>
            Show Word Count
        </ChatBurgerButton>, document.body)}
        {menuList && createPortal(<ChatMenuSwitch label="TTS Enabled" initialState={wnd.Janitor.Settings.TTSEnabled} onChange={(state: boolean) => { wnd.Janitor.Settings.TTSEnabled = state }} className="DOGGY_tts" />, menuList)}
        {isOpen && createPortal(
            <ChatPanel
                title="Doggo Menu"
                footer={<></>}
                close={closeCb}
                isClosing={isClosing}
                isBlurred={false}
                className="DOGGY_devmenu"
            >
                <ChatPanelSection title="Messages stuff" defaultOpen={true}>
                    <div className={cls.findFirstInFile("SkeletonLoader", "_formGroup_")}>
                        <button className={cls.findFirstInFile("SkeletonLoader", "_inlineButton_")} onClick={resetChat}>Reset</button>
                        <button className={cls.findFirstInFile("SkeletonLoader", "_inlineButton_")} onClick={importMessages}>Import</button>
                        <button className={cls.findFirstInFile("SkeletonLoader", "_inlineButton_")} onClick={exportMessages}>Export</button>
                    </div>
                    <ChatPanelToggle title="Developer mode" on={dev} setOn={(val: boolean) => {
                        setDev(val)
                        wnd.Janitor.Settings.Dev = val
                    }} />
                    <ChatPanelToggle title="Randomize temperature" on={randTemp} setOn={(val: boolean) => {
                        setRandTemp(val)
                        wnd.Janitor.Settings.RandomizeTemperature = val
                    }} />

                    <div className={cls.findFirstInFile("SkeletonLoader", "_formGroup_")}>
                        <ChatPanelTextArea placeholder="System prompt..." content={sysPrompt} setContent={setSysPrompt} />
                        <button className={cls.findFirstInFile("SkeletonLoader", "_inlineButton_")} onClick={() => wnd.Janitor.Helpers.fetchSystemMessage().then(d => setSysPrompt(d || ""))}>Fetch system prompt</button>
                    </div>
                </ChatPanelSection>
            </ChatPanel>,
            document.body)
        }
    </>
}