import { useEffect, useRef } from "react";
import classes from "../../classes";
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
            className={classes.alertOverlay}
            ref={overlayRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <div className={classes.alertContainer}>
                <div className={classes.alertContent}>
                    <div className={classes.alertHeader}>
                        <h2 id="alert-dialog-title" className={classes.alertTitle}>
                            {title}
                        </h2>
                    </div>
                    <div id="alert-dialog-description" className={classes.alertBody}>
                        {message}
                    </div>
                    <div className={classes.alertFooter}>
                        <button
                            ref={cancelButtonRef}
                            type="button"
                            onClick={onClose}
                            className={`${classes.alertButton} ${classes.cancel}`}
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className={`${classes.alertButton} ${classes.confirm}`}
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
