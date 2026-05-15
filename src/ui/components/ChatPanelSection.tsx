import { useState } from "react";
import { HTMLClasses } from "../../classes";

export default function ChatPanelSection({
    title,
    defaultOpen = false,
    children
}: {
    title: string,
    defaultOpen?: boolean,
    children: any,
}) {
    const cls = HTMLClasses.getInstance()
    const [open, setOpen] = useState(defaultOpen)

    return <div className={cls.findFirstInFile("SkeletonLoader", "_section_")}>
        <button type="button" className={cls.findFirstInFile("SkeletonLoader", "_sectionHeader_")} onClick={() => setOpen(!open)} aria-expanded={open}>
            <span className={cls.findFirstInFile("SkeletonLoader", "_sectionTitle_")}>{title}</span>
            {/* TODO: animate & transition prop */}
            <span className={cls.findFirstInFile("SkeletonLoader", "_sectionChevron_")}>
                {/* TODO: icon */}
            </span>
        </button>
        {/* TODO: the actual proper body */}
        {open && <div className={cls.findFirstInFile("SkeletonLoader", "_sectionCollapse_")}>
            <div className={cls.findFirstInFile("SkeletonLoader", "_sectionContent_")}>
                {children}
            </div>
        </div>}
    </div>
}