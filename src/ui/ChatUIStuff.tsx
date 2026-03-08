import {createRoot} from "react-dom/client"
import ChatBurgerButton from "./components/chatBurgerButton"
import IconMagic from "./components/iconMagic"
import ChatMessageButton from "./components/chatMessageButton"
import { processText } from "../chat"
import ChatMenuSwitch from "./components/chatMenuSwitch"

var menuButtonsTimeout: NodeJS.Timeout
function patchMenuButtons() {
    if (document.querySelector(".DOGGY_cwb")) return
    clearTimeout(menuButtonsTimeout)
    const chatMenuButton = document.querySelector("div._menuList_162rw_8 > button:last-of-type")
    if (!chatMenuButton) {
        menuButtonsTimeout = setTimeout(patchMenuButtons, 50)
        return
    }
    
    const divChatMenu = document.createElement("div")
    chatMenuButton.after(divChatMenu)

    const rootChatMenu = createRoot(divChatMenu)
    rootChatMenu.render(<ChatBurgerButton disabled={false} className="DOGGY_cwb" onClick={() => {
        const msgs: any[] = wnd.Janitor.Stores.chatStore.messagesStore.messages
        const count = msgs.map(v => v.message.split(" ").length).filter(v => v).reduce((v1, v2) => v1 + v2, 0)
        wnd.Janitor.Toastify.showInfo(`${count} words in this chat (${msgs.length} messages)`)
    }}>
        Show Word Count
    </ChatBurgerButton>)
}
var menuSwitchesTimeout: NodeJS.Timeout
function patchMenuSwitches() {
    if (document.querySelector(".DOGGY_tts")) return
    clearTimeout(menuSwitchesTimeout)
    const chatMenuButton = document.querySelector("div._menuList_162rw_8 > ._menuItemSwitch_hs488_94:last-of-type")
    if (!chatMenuButton) {
        menuSwitchesTimeout = setTimeout(patchMenuSwitches, 50)
        return
    }
    
    const divChatMenu = document.createElement("div")
    divChatMenu.classList.add("_menuItemSwitch_hs488_94")
    chatMenuButton.after(divChatMenu)

    const rootChatMenu = createRoot(divChatMenu)
    rootChatMenu.render(<ChatMenuSwitch label="TTS Enabled" initialState={wnd.Janitor.TTSEnabled} onChange={(state: boolean) => {wnd.Janitor.TTSEnabled = state}} className="DOGGY_tts" />)
}

function patchMessage(div: HTMLDivElement) {
    if (div.querySelector(".DOGGY_rwm")) return
    const chatMessageButton = div.querySelector("div._controlPanel_1tfuc_2 > button._controlPanelButton_1tfuc_8")
    if (!chatMessageButton) return setTimeout(patchMessages, 1000)
    
    const divChatMessage = document.createElement("div")
    chatMessageButton.after(divChatMessage)

    const rootChatMessage = createRoot(divChatMessage)
    rootChatMessage.render(<ChatMessageButton color="rgb(255,255,255)" label="test" className="DOGGY_rwm" onClick={() => {
        const message = parseInt(div.getAttribute("data-index") as string)
        const msgs: any[] = wnd.Janitor.Stores.chatStore.messagesStore.messages
        const msg = msgs[message]
        msg.message = processText(msg.message)
    }}>
        <IconMagic/>
    </ChatMessageButton>)
}

function patchMessages() {
    const chatMessages = document.querySelectorAll<HTMLDivElement>("main._messagesMain_1swu7_10 div[data-index]")
    chatMessages.forEach(patchMessage)
}

var lastRun = 0
export function patchChatUI() {
    if (new Date().getTime() - lastRun < 10) return
    lastRun = new Date().getTime()
    
    patchMenuButtons()
    patchMessages()
    patchMenuSwitches()
}