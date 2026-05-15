import { createRoot } from "react-dom/client"
import ChatBurgerButton from "./components/ChatBurgerButton"
import IconMagic from "./components/icons/IconMagic"
import ChatMessageButton from "./components/ChatMessageButton"
import { processText } from "../chat"
import ChatMenuSwitch from "./components/ChatMenuSwitch"
import ChatDevMenu from "./custom/ChatDevMenu"
import GenerationSettingsSwitch from "./components/GenerationSettingsSwitch"
import { getFullClassNameFromElement } from "../util"

var menuButtonsTimeout: NodeJS.Timeout
function patchMenuButtons() {
    if (document.querySelector(".DOGGY_cwb") && document.querySelector(".DOGGY_dev")) return
    clearTimeout(menuButtonsTimeout)
    const chatMenuButton = document.querySelector(`div[class^="_menuList_"] > button:last-of-type`)
    if (!chatMenuButton) {
        menuButtonsTimeout = setTimeout(patchMenuButtons, 50)
        return
    }

    if (!document.querySelector(".DOGGY_cwb")) {
        const divChatMenu = document.createElement("div")
        chatMenuButton.after(divChatMenu)

        const rootChatMenu = createRoot(divChatMenu)
        rootChatMenu.render(<ChatBurgerButton disabled={false} className="DOGGY_cwb" onClick={() => {
            const msgs = (wnd.Janitor.Stores.chatStore as ChatStore).messagesStore.messages
            const count = msgs.map(v => v.message.split(" ").length).filter(v => v).reduce((v1, v2) => v1 + v2, 0)
            wnd.Janitor.Toastify.showInfo(`${count} words in this chat (${msgs.length} messages)`)
        }}>
            Show Word Count
        </ChatBurgerButton>)
    }
    if (!document.querySelector(".DOGGY_dev")) {
        const divChatMenu = document.createElement("div")
        chatMenuButton.after(divChatMenu)


        const rootChatMenu = createRoot(divChatMenu)
        rootChatMenu.render(
            <ChatDevMenu />
        )
    }
}
var menuSwitchesTimeout: NodeJS.Timeout
function patchMenuSwitches() {
    if (document.querySelector(".DOGGY_tts")) return
    clearTimeout(menuSwitchesTimeout)
    const chatMenuButton = document.querySelector(`div[class^="_menuList_"] > [class^="_menuItemSwitch_"]:last-of-type`)
    if (!chatMenuButton) {
        menuSwitchesTimeout = setTimeout(patchMenuSwitches, 50)
        return
    }
    const menuListClass = getFullClassNameFromElement(chatMenuButton, "_menuItemSwitch_")
    if (!menuListClass) return;

    const divChatMenu = document.createElement("div")
    divChatMenu.classList.add(menuListClass)
    chatMenuButton.after(divChatMenu)

    const rootChatMenu = createRoot(divChatMenu)
    rootChatMenu.render(<ChatMenuSwitch label="TTS Enabled" initialState={wnd.Janitor.Settings.TTSEnabled} onChange={(state: boolean) => { wnd.Janitor.Settings.TTSEnabled = state }} className="DOGGY_tts" />)
}

var messagesTimeout: NodeJS.Timeout
function patchMessage(div: HTMLDivElement) {
    if (div.querySelector(".DOGGY_rwm")) return
    const chatMessageButton = div.querySelector(`div[class^="_controlPanel_"] > button[class^="_controlPanelButton_"]`)
    if (!chatMessageButton) {
        clearTimeout(messagesTimeout)
        messagesTimeout = setTimeout(patchMessages, 50)
        return
    }

    const divChatMessage = document.createElement("div")
    chatMessageButton.after(divChatMessage)

    const rootChatMessage = createRoot(divChatMessage)
    rootChatMessage.render(<ChatMessageButton color="rgb(255,255,255)" label="test" className="DOGGY_rwm" onClick={() => {
        const message = parseInt(div.getAttribute("data-index") as string)
        const msgs = (wnd.Janitor.Stores.chatStore as ChatStore).messagesStore.messages
        const msg = msgs[message]
        if (!msg) return
        const newMessage = processText(msg.message);
        (wnd.Janitor.Stores.chatStore as ChatStore).messagesStore.editMessage(msg, newMessage)
    }}>
        <IconMagic />
    </ChatMessageButton>)
}

function patchMessages() {
    clearTimeout(messagesTimeout)
    const chatMessages = document.querySelectorAll<HTMLDivElement>(`main[class^="_messagesMain_"] div[data-index]`)
    chatMessages.forEach(patchMessage)
}


var generationSettingsTimeout: NodeJS.Timeout
function patchGenerationSettings() {
    // TODO: rewrite for new panel
    if (document.querySelector(".DOGGY_rng")) return
    clearTimeout(generationSettingsTimeout)
    const generationThinkingButton = document.querySelector(`div[class^="_settingsContainer_"] > div[class^="_container_"]`)
    if (!generationThinkingButton) {
        generationSettingsTimeout = setTimeout(patchGenerationSettings, 50)
        return
    }
    const settingsContainerContainer = getFullClassNameFromElement(generationThinkingButton, "_settingsContainer_")
    if (!settingsContainerContainer) return;

    const divGenerationButton = document.createElement("div")
    divGenerationButton.classList.add(settingsContainerContainer)
    divGenerationButton.classList.add("DOGGY_rng")
    generationThinkingButton.after(divGenerationButton)

    const rootGenerationButton = createRoot(divGenerationButton)
    rootGenerationButton.render(<GenerationSettingsSwitch label="Randomize Temperature" state={wnd.Janitor.Settings.RandomizeTemperature} onChange={(state: boolean) => { wnd.Janitor.Settings.RandomizeTemperature = state }}>
        <strong>What is Randomize Temperature?</strong>
        <p>When enabled, the model's temperature will be changed by a random amount, between -0.2 and 0.2. This allows for more diversity in the generated text.</p>
        <p>Disable this if you prefer a more deterministic and consistent output.</p>
    </GenerationSettingsSwitch>)
}

var lastRun = 0
export function patchChatUI() {
    if (!wnd.Janitor.ReactDOM) return
    if (!window.location.href.includes("/chat")) return
    if (new Date().getTime() - lastRun < 10) return
    lastRun = new Date().getTime()

    patchMenuButtons()
    patchMessages()
    patchMenuSwitches()
    patchGenerationSettings()
}