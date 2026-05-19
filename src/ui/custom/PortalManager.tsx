import ChatMenuUIManager from "./ChatMenuUIManager";
import ChatMessagesUIManager from "./ChatMessagesUIManager";
import SearchCharacterUIManager from "./SearchCharacterUIManager";

export default function PortalManager() {
    return <>
        <ChatMessagesUIManager />
        <ChatMenuUIManager />
        <SearchCharacterUIManager />
    </>
}