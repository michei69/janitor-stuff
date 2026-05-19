import { createRoot } from "react-dom/client"
import PortalManager from "./custom/PortalManager"

export async function patchUI() {
    if (document.getElementById("doggy-portal")) return
    const div = document.createElement("div")
    div.id = "doggy-portal"
    document.body.append(div)

    while (typeof wnd.Janitor == "undefined" || typeof wnd.Janitor.ReactDOM == "undefined" || !wnd.Janitor.ReactDOM) await new Promise(resolve => setTimeout(resolve, 100))
    const root = createRoot(div)
    root.render(<PortalManager />)
}