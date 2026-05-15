import { useState } from "react"
import { HTMLClasses } from "../../classes"

export default function ChatPanelToggle({
    title,
    setOn,
    on
}: {
    title: string,
    setOn: (val: boolean) => void,
    on: boolean
}) {
    const cls = HTMLClasses.getInstance()

    return <div className={cls.findFirstInFile("SkeletonLoader", "_genToggleRow_")}>
        <div className={cls.findFirstInFile("SkeletonLoader", "_genToggleLabel_")}>
            {/* ICON */}
            <span>{title}</span>
        </div>
        <button className={`${cls.findFirstInFile("SkeletonLoader", "_genToggle_")} ${on ? cls.findFirstInFile("SkeletonLoader", "_genToggleOn_") : ""}`} type="button" onClick={() => setOn(!on)}>
            <div className={cls.findFirstInFile("SkeletonLoader", "_genToggleKnob_")} />
        </button>
    </div>
}