import { useEffect, useState } from "react"
import { getRootDiv, selectAll, wait } from "../../util"
import { createPortal } from "react-dom"
import IgnoreButton from "../components/IgnoreButton"

export default function SearchCharacterUIManager() {
    const [nodes, setNodes] = useState([] as HTMLDivElement[])
    const [beautifyContainers, setBeautifyContainers] = useState([] as HTMLDivElement[])

    const refreshNodes = () => {
        const nodes = selectAll<HTMLDivElement>("div.profile-character-card-wrapper")
        setNodes(nodes)
        setBeautifyContainers(nodes.map(node => {
            const existing = node.querySelector<HTMLDivElement>("div[data-doggy]")
            if (existing) return existing
            const ctrl = node.querySelector<HTMLDivElement>("div.profile-character-card-stack-link-component-box")
            const div = document.createElement("div")
            div.setAttribute("data-doggy", "true")
            div.setAttribute("data-id", (ctrl!.parentElement! as HTMLAnchorElement).href.split("/").pop()!.split("_")[0] as string)
            div.style.marginLeft = "auto"
            div.style.transform = "translate(0, -4px)"
            div.style.color = "red"
            ctrl?.append(div)
            return div
        }))
    }
    useEffect(() => {
        refreshNodes()

        const getCharactersList = () => document.querySelector<HTMLDivElement>("div.pp-cc-list-container")

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type != "childList") continue
                if (mutation.addedNodes.length < 1 && mutation.removedNodes.length < 1) continue
                let refresh = false;
                for (const node of mutation.addedNodes as any) {
                    if (node.nodeType != 1) continue;
                    if (
                        node.parentElement == getCharactersList() ||
                        node.classList.value.startsWith("pp-cc-wrapper")
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
            const id = target.getAttribute("data-id") as string
            const onClick = () => {
                const frame = target.parentElement!.parentElement!.parentElement!
                if (!frame) return; // shouldnt fire
                if (wnd.Janitor.Settings.IgnoredBots.has(id)) {
                    frame.style.filter = "grayscale(100%) brightness(5%)"
                    frame.style.opacity = "75%"
                } else {
                    frame.style.filter = ""
                    frame.style.opacity = ""
                }
            }
            if (!target || !target.parentElement) {
                refreshNodes()
                return <></>
            }
            return createPortal(
                <IgnoreButton characterId={id} callback={onClick} />,
                target,
                id
            )
        })}
    </>
}