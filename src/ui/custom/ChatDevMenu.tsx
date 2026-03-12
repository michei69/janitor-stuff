import { useCallback, useState } from "react";
import ChatBurgerButton from "../components/ChatBurgerButton";
import ChatModal, { ChatModalBody, ChatModalFooter, ChatModalHeader } from "../components/ChatModal";
import classes from "../../classes";

export default function ChatDevMenu() {
    const [isOpen, setIsOpen] = useState(false);

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
                            data: data.map((m: ChatMessage) => ({...m, chat_id: chatId})),
                            urlParams: {chatId}
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
            urlParams: {chatId}
        }).then((messages) => {
            chatStore.messagesStore.setMessages(messages)
            wnd.Janitor.Toastify.showSuccess("Messages reset")
        })
    }, [])

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
            <ChatModal
                isOpen={isOpen}
                onClose={() => {setIsOpen(false)}}
                size="md"
            >
                <ChatModalHeader onClose={() => {setIsOpen(false)}}>
                    <h2 className={classes.modalHeader}>Doggo Menu</h2>
                </ChatModalHeader>
                <ChatModalBody>
                    <div style={{display: "flex", flexDirection: "column", width:"100%", gap: "1rem"}}>
                        <h3 className={classes.modalHeader} style={{fontSize: "1rem"}}>Messages stuff</h3>
                        <div style={{display: "flex", flexDirection: "row", width:"100%", justifyContent: "space-around"}}>
                            <button className={classes.editButton} onClick={resetChat} type="button">Reset</button>
                            <button className={classes.editButton} onClick={importMessages} type="button">Import</button>
                            <button className={classes.editButton} onClick={exportMessages} type="button">Export</button>
                        </div>
                    </div>
                </ChatModalBody>
            </ChatModal>
        </>
    );
}
