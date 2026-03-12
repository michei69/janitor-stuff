import { useCallback } from "react"

export default function IgnoreButton({characterId, callback}: {characterId: string, callback: () => void}) {
    const cb = useCallback((e: any) => {
        e.preventDefault()
        wnd.Janitor.Search.IgnoreBot(characterId)
        callback()
    }, [characterId])
    return <button className="ignore-button" onClick={cb} style={{padding: "0px 4px"}} onMouseEnter={(e) => e.currentTarget.style.filter = "brightness(75%)"} onMouseLeave={(e) => e.currentTarget.style.filter = ""}>X</button>
}