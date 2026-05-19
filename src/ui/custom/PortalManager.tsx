import ChatMenuUIManager from "./ChatMenuUIManager";
import ChatMessagesUIManager from "./ChatMessagesUIManager";

export default function PortalManager() {
    return <>
        <ChatMessagesUIManager />
        <ChatMenuUIManager />
    </>
}