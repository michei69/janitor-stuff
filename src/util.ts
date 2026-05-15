export function getAllByClassPrefix(prefix: string) {
    //@ts-ignore shush
    return [...document.querySelectorAll("[class]")].filter(el =>
        [...el.classList].some(cls => cls.startsWith(prefix))
    )
}
export function getByClassPrefix(prefix: string) {
    return getAllByClassPrefix(prefix)?.[0]
}

export function getFullClassNameFromElement(element: Element, prefix: string) {
    return element?.classList.value.match(new RegExp(prefix + "[^\W]*", "gm"))?.[0]
}
export function getFullClassName(selector: string, prefix: string) {
    const el = document.querySelector(selector)
    return el ? getFullClassNameFromElement(el, prefix) : null;
}