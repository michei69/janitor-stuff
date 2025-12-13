// todo: maybe like make this shit use a proper filter n not just a checkbox
export default async function patchWhatever() {
    //@ts-ignore this actually works so idgaf
    const hiddenGemsTab = [...document.querySelectorAll("div")].filter(el => el.innerHTML.includes("Hidden Gems")).pop()
    if (!hiddenGemsTab) return // prolly not on home
    const checkboxExists = hiddenGemsTab.querySelector("input[type=checkbox]")
    if (checkboxExists) return

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.style.marginLeft = "8px"
    checkbox.addEventListener("change", () => {
        wnd.Janitor.HiddenGemsFurryFilter = checkbox.checked
    })
    hiddenGemsTab.appendChild(checkbox)
}