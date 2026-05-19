import { useLayoutEffect } from "react";

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

export const getRootDiv = () => document.getElementById("root") as HTMLDivElement
export const selectAll = <T>(selector: string) => [...document.querySelectorAll(selector) as any] as T[]

export const wait = (time = 100) => new Promise(resolve => setTimeout(resolve, time))
export const waitFor = async (obj: any, key: string) => {
    while (typeof obj[key] == "undefined" || !(key in obj) || !obj[key]) await wait(100)
}