export function getAllByClassPrefix(prefix: string) {
    //@ts-ignore shush
    return [...document.querySelectorAll("[class]")].filter(el =>
        [...el.classList].some(cls => cls.startsWith(prefix))
    )
}
export function getByClassPrefix(prefix: string) {
    return getAllByClassPrefix(prefix)?.[0]
}