import { useState } from "react";
import Switch from "./Switch";
import classes from "../../classes";

export default function ChatMenuSwitch({label, initialState, onChange, className}: {label: string, initialState: boolean, onChange: any, className?: string}) {
    const [state, setState] = useState(initialState)

    return <>
    <span className={`${classes.menuItemLabel} ${className}`}>
        {label}
    </span>
    <Switch isChecked={state} onChange={() => {
        setState(!state)
        onChange(!state)
    }} size="sm"/>
    </>
}