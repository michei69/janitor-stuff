import { HTMLClasses } from "../../classes"

export default function ChatBurgerButton({ children, onClick, disabled, icon, className, hidden = false, id }: { children: any, onClick: () => void, disabled: boolean, icon?: string, className?: string, hidden?: boolean, id?: string }) {
    const cls = HTMLClasses.getInstance()
    return <button className={`${cls.findFirstInFile("SkeletonLoader", "_menuItem_")} ${disabled ? cls.findFirstAfterFirstInFile("SkeletonLoader", "_menuItem_", "_disabled_") : ""} ${className}`} style={hidden ? { opacity: 0 } : {}} onClick={() => { !disabled && onClick && onClick() }} disabled={disabled} type="button" id={id}>
        {icon && <span className={cls.findFirstInFile("SkeletonLoader", "_menuItemIcon_")}>{icon}</span>}
        <span className={cls.findFirstInFile("SkeletonLoader", "_menuItemContent_")}>
            {children}
        </span>
    </button>
}