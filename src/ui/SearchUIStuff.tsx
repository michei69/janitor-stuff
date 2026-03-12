import { createRoot } from "react-dom/client"
import classes from "../classes"
import SpecialSearchFilters from "./custom/SpecialSearchFilters"
import IgnoreButton from "./components/IgnoreButton"

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

var searchResultsTimeout: NodeJS.Timeout
function patchSearchResult(div: HTMLDivElement) {
    if (div.querySelector(".DOGGY_ign")) return
    const divBtn = document.createElement("div")
    divBtn.classList.add("DOGGY_ign")
    divBtn.style.marginLeft = "auto"
    divBtn.style.transform = "translate(0, -4px)"
    divBtn.style.color = "red"
    div.appendChild(divBtn)
    div.style.display = "flex"
    div.style.flexDirection = "row"

    const characterId = (div.parentElement?.getAttribute("href")?.split("/").pop() as string).split("_")[0]
    if (wnd.Janitor.Settings.IgnoredBots.has(characterId + "")) {
        div.parentElement!.parentElement!.parentElement!.style.filter = "grayscale(100%) brightness(5%)"
        div.parentElement!.parentElement!.parentElement!.style.opacity = "75%"
    }
    
    function onClick() {
        if (wnd.Janitor.Settings.IgnoredBots.has(characterId + "")) {
            div.parentElement!.parentElement!.parentElement!.style.filter = "grayscale(100%) brightness(5%)"
            div.parentElement!.parentElement!.parentElement!.style.opacity = "75%"
        }
        else {
            div.parentElement!.parentElement!.parentElement!.style.filter = ""
            div.parentElement!.parentElement!.parentElement!.style.opacity = ""
        }
    }
    
    const rootBtn = createRoot(divBtn)
    rootBtn.render(<IgnoreButton characterId={characterId || ""} callback={onClick}/>)
}
function patchSearchResults() {
    clearTimeout(searchResultsTimeout)
    const characters = document.querySelectorAll<HTMLDivElement>(".profile-character-card-stack-link-component-box")
    characters.forEach(patchSearchResult)
}

var lastRun = 0
export function patchSearchUI() {
    if (!wnd.Janitor.ReactDOM) return
    if (!window.location.href.includes("/search")) return
    if (new Date().getTime() - lastRun < 10) return
    lastRun = new Date().getTime()
    
    patchSearchFilters()
    patchSearchResults()
}