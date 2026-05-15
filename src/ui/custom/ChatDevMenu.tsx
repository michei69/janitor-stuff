import { useCallback, useState } from "react";
import ChatBurgerButton from "../components/ChatBurgerButton";
import { HTMLClasses } from "../../classes";
import ChatPanel from "../components/ChatPanel";
import { createPortal } from "react-dom";
import ChatPanelSection from "../components/ChatPanelSection";
import ChatPanelToggle from "../components/ChatPanelToggle";

export default function ChatDevMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [dev, setDev] = useState(wnd.Janitor.Settings.Dev)
    const [randTemp, setRandTemp] = useState(wnd.Janitor.Settings.RandomizeTemperature)
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

    return (
        <>
            <ChatBurgerButton
                disabled={false}
                className="DOGGY_dev"
                onClick={() => {
                    setIsOpen(!isOpen);
                }}
            >
                Doggo Menu
            </ChatBurgerButton>
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
                    </ChatPanelSection>
                </ChatPanel>,
                document.body)
            }
        </>
    );
}