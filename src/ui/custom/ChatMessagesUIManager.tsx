import { Fragment, useEffect, useState } from "react"
import { getRootDiv, selectAll, wait } from "../../util"
import { createPortal } from "react-dom"
import { processText } from "../../chat"
import ChatMessageButton from "../components/ChatMessageButton"
import IconMagic from "../components/icons/IconMagic"

export default function ChatMessagesUIManager() {
    const [nodes, setNodes] = useState([] as HTMLDivElement[])
    const [beautifyContainers, setBeautifyContainers] = useState([] as HTMLDivElement[])

    const refreshNodes = () => {
        const nodes = selectAll<HTMLDivElement>("main[class^='_messagesMain_'] div[data-index]")
        setNodes(nodes)
        setBeautifyContainers(nodes.map(node => {
            const existing = node.querySelector<HTMLDivElement>("div[data-doggy]")
            if (existing) return existing
            const ctrl = node.querySelector<HTMLButtonElement>("button[class^='_controlPanelButton_']")
            const div = document.createElement("div")
            div.setAttribute("data-index", node.getAttribute("data-index") || "0")
            div.setAttribute("data-doggy", "true")
            ctrl?.after(div)
            return div
        }))
    }
    useEffect(() => {
        refreshNodes()

        const getMessagesList = () => document.querySelector<HTMLDivElement>("main[class^='_messagesMain_'] > div[data-virtuoso-scroller] > div[data-viewport-type] > div[data-testid]")

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type != "childList") continue
                if (mutation.addedNodes.length < 1 && mutation.removedNodes.length < 1) continue
                let refresh = false;
                for (const node of mutation.addedNodes as any) {
                    if (node.nodeType != 1) continue;
                    if (
                        node.parentElement == getMessagesList() ||
                        node.classList.value.startsWith("_controlPanel_")
                    ) {
                        refresh = true;
                        break;
                    }
                }
                for (const node of mutation.removedNodes as any) {
                    if (node.nodeType != 1) continue
                    if (node.getAttribute("data-doggy") == "true") {
                        refresh = true;
                        break;
                    }
                }
                if (refresh) refreshNodes()
            }
        });

        (async () => {
            let list = getRootDiv()
            while (!list) {
                await wait(100)
                list = getRootDiv()
            }
            observer.observe(list, {
                childList: true,
                subtree: true
            })
        })()

        return () => observer.disconnect()
    }, [])

    return <>
        {beautifyContainers.map((target, _) => {
            const id = parseInt(target.getAttribute("data-index") as string)
            const onClick = () => {
                const messages = (wnd.Janitor.Stores.chatStore as ChatStore).messagesStore.messages
                const msg = messages[id]
                if (!msg) return
                const newMessage = processText(msg.message);
                (wnd.Janitor.Stores.chatStore as ChatStore).messagesStore.editMessage(msg, newMessage)
            }
            if (!target || !target.parentElement) {
                refreshNodes()
                return <></>
            }
            return createPortal(
                <ChatMessageButton color="rgb(255,255,255)" label="test" className="DOGGY_rwm" onClick={onClick}>
                    <IconMagic />
                </ChatMessageButton>,
                target,
                id
            )
        })}
    </>
}