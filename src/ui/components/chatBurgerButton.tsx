import classes from "../../classes"

export default function ChatBurgerButton({ children, onClick, disabled, icon, className }: { children: any, onClick: () => void, disabled: boolean, icon?: string, className?: string }) {
    return <button className={`${classes.menuItem} ${disabled ? classes.disabled : ""} ${className}`} onClick={() => {!disabled && onClick && onClick()}} disabled={disabled} type="button">
        {icon && <span className={classes.menuItemIcon}>{icon}</span>}
        <span className={classes.menuItemContent}>
            {children}
        </span>
    </button>
}