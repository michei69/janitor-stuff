import { HTMLClasses } from "../../classes";

export default function ChatMessageButton({ children, color, label, onClick, className }: { children: any, color: any, label: string, onClick: any, className?: string }) {
    const cls = HTMLClasses.getInstance()
    return <button className={`${cls.findFirstInFile("SkeletonLoader", "_controlPanelButton_")} ${className}`} style={{ color: color }} aria-label={label} onClick={onClick}>
        {children}
    </button>
}