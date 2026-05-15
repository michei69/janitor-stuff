import { useState } from "react";
import Switch from "./Switch";
import { HTMLClasses } from "../../classes";

export default function ChatMenuSwitch({ label, initialState, onChange, className }: { label: string, initialState: boolean, onChange: any, className?: string }) {
    const [state, setState] = useState(initialState)
    const cls = HTMLClasses.getInstance()

    return <>
        <span className={`${cls.findFirstInFile("SkeletonLoader", "_menuItemLabel_")} ${className}`}>
            {label}
        </span>
        <Switch isChecked={state} onChange={() => {
            setState(!state)
            onChange(!state)
        }} size="sm" />
    </>
}