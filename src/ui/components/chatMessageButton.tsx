export default function ChatMessageButton({children, color, label, onClick, className}: {children: any, color: any, label: string, onClick: any, className?: string}) {
    return <button className={`_controlPanelButton_1tfuc_8 ${className}`} style={{color: color}} aria-label={label} onClick={onClick}>
        {children}
    </button>
}