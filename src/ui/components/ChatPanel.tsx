import { HTMLClasses } from "../../classes"
import IconClose from "./icons/IconClose"

export default function ChatPanel({
    title,
    children,
    footer,
    close,
    isClosing,
    isBlurred,
    className
}: {
    title: string,
    children: any,
    footer: any,
    close: () => void,
    isClosing: boolean,
    isBlurred: boolean
    className?: string
}) {
    const cls = HTMLClasses.getInstance()
    const panelCls = cls.findLastInFile("SkeletonLoader", "_panel_") as string

    return (
        <div className={`${panelCls} ${className} ${isClosing ? cls.findFirstAfterFirstInFile("SkeletonLoader", panelCls, "_panelClosing_") : ''}`}>
            <div className={`${cls.findFirstAfterFirstInFile("SkeletonLoader", panelCls, "_header_")} ${isBlurred ? cls.findFirstAfterFirstInFile("SkeletonLoader", panelCls, "_panelBlurred_") : ''}`}>
                <div className={cls.findFirstAfterFirstInFile("SkeletonLoader", panelCls, "_headerLeft_")}>
                    {/*<It />*/}
                    <h2 className={cls.findFirstAfterFirstInFile("SkeletonLoader", panelCls, "_title_")}>{title}</h2>
                </div>
                <div className={cls.findFirstAfterFirstInFile("SkeletonLoader", panelCls, "_headerActions_")}>
                    <button type="button" className={cls.findFirstAfterFirstInFile("SkeletonLoader", panelCls, "_iconButton_")} onClick={close} aria-label="Close panel">
                        {/*<At />*/}
                        <IconClose />
                    </button>
                </div>
            </div>

            <div className={cls.findFirstAfterFirstInFile("SkeletonLoader", panelCls, "_body_")}>
                {children}
            </div>

            <div className={`${cls.findFirstAfterFirstInFile("SkeletonLoader", panelCls, "_footer_")} ${isBlurred ? cls.findFirstAfterFirstInFile("SkeletonLoader", panelCls, "_panelBlurred_") : ''}`}>
                {footer}
            </div>
        </div>
    )
}