export default function ChatBurgerButton({ children, onClick, disabled, icon, className }: { children: any, onClick: () => void, disabled: boolean, icon?: string, className?: string }) {
    return <button className={`_menuItem_162rw_45 ${disabled ? "_disabled_162rw_66" : ""} ${className}`} onClick={() => {!disabled && onClick && onClick()}} disabled={disabled} type="button">
        {icon && <span className="_menuItemIcon_162rw_81">{icon}</span>}
        <span className="_menuItemContent_162rw_96">
            {children}
        </span>
    </button>
}