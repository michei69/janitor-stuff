import { useEffect, useRef } from "react";
import { HTMLClasses } from "../../classes";
import { createPortal } from "react-dom";

export default function ChatAlertDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmButtonColor = 'purple'
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonColor?: 'red' | 'purple';
}) {
    const overlayRef = useRef<HTMLDivElement>(null)
    const cancelButtonRef = useRef<HTMLButtonElement>(null)
    const cls = HTMLClasses.getInstance()

    useEffect(() => {
        function keyHandler(e: KeyboardEvent) {
            if (e.key === "Escape" && isOpen) {
                onClose()
            }
        }
        function mouseHandler(e: MouseEvent) {
            if (e.target === overlayRef.current) {
                onClose()
            }
        }
        window.addEventListener("keydown", keyHandler)
        window.addEventListener("click", mouseHandler)
        document.body.style.overflow = "hidden"
        setTimeout(() => {
            cancelButtonRef.current?.focus()
        }, 100)

        return () => {
            window.removeEventListener("keydown", keyHandler)
            window.removeEventListener("click", mouseHandler)
            document.body.style.overflow = ""
        }
    }, [isOpen, onClose])

    return isOpen ? createPortal(
        <div
            className={cls.findFirstInFile("AlertDialog-", "_alertOverlay_")}
            ref={overlayRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <div className={cls.findFirstInFile("AlertDialog-", "_alertContainer_")}>
                <div className={cls.findFirstInFile("AlertDialog-", "_alertContent_")}>
                    <div className={cls.findFirstInFile("AlertDialog-", "_alertHeader_")}>
                        <h2 id="alert-dialog-title" className={cls.findFirstInFile("AlertDialog-", "_alertTitle_")}>
                            {title}
                        </h2>
                    </div>
                    <div id="alert-dialog-description" className={cls.findFirstInFile("AlertDialog-", "_alertBody_")}>
                        {message}
                    </div>
                    <div className={cls.findFirstInFile("AlertDialog-", "_alertFooter_")}>
                        <button
                            ref={cancelButtonRef}
                            type="button"
                            onClick={onClose}
                            className={`${cls.findFirstInFile("AlertDialog-", "_alertButton_")} ${cls.findFirstInFile("AlertDialog-", "_cancel_")}`}
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className={`${cls.findFirstInFile("AlertDialog-", "_alertButton_")} ${cls.findFirstInFile("AlertDialog-", "_confirm_")}`}
                            style={
                                confirmButtonColor === "red"
                                    ? { background: "#ef4444" }
                                    : undefined
                            }
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    ) : null
}
