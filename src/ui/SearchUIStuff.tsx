import { createRoot } from "react-dom/client"
import classes from "../classes"
import SpecialSearchFilters from "./custom/SpecialSearchFilters"

var searchFilterTimeout: NodeJS.Timeout
function patchSearchFilters() {
    if (document.querySelector(".DOGGY_csf")) return
    clearTimeout(searchFilterTimeout)
    const filtersRadio = document.querySelector(`div.${classes.radio.radioInputs}:nth-child(2)`)
    if (!filtersRadio) {
        searchFilterTimeout = setTimeout(patchSearchFilters, 50)
        return
    }
    
    const divGenerationButton = document.createElement("div")
    divGenerationButton.classList.add("DOGGY_csf")
    filtersRadio.after(divGenerationButton)

    const rootGenerationButton = createRoot(divGenerationButton)
    rootGenerationButton.render(<SpecialSearchFilters/>)
}

var lastRun = 0
export function patchSearchUI() {
    if (!wnd.Janitor.ReactDOM) return
    if (!window.location.href.includes("/search")) return
    if (new Date().getTime() - lastRun < 10) return
    lastRun = new Date().getTime()
    
    patchSearchFilters()
}