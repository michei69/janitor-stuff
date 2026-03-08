import { useState } from "react";
import Switch from "./switch";

export default function ChatMenuSwitch({label, initialState, onChange, className}: {label: string, initialState: boolean, onChange: any, className?: string}) {
    const [state, setState] = useState(initialState)

    return <>
    <span className={`_menuItemLabel_hs488_111 ${className}`}>
        {label}
    </span>
    <Switch isChecked={state} onChange={() => {
        setState(!state)
        onChange(!state)
    }} size="sm"/>
    </>
}