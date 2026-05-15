import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { HTMLClasses } from "../../classes";

export default function ChatModal({
    isOpen,
    onClose,
    children,
    size = "md",
}: {
    isOpen: boolean;
    onClose: () => void;
    children: any;
    size?: "sm" | "md" | "lg" | "xl";
}) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const cls = HTMLClasses.getInstance()

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        const handleMouseDown = (e: MouseEvent) => {
            if (overlayRef.current && e.target === overlayRef.current) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.addEventListener("mousedown", handleMouseDown);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleMouseDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    return isOpen
        ? createPortal(
            <div className={cls.findFirstInFile("SkeletonLoader", "_modalOverlay_")} ref={overlayRef}>
                <div
                    className={`${cls.findFirstInFile("SkeletonLoader", "_modalContainer_")} ${cls.findFirstAfterFirstInFile("SkeletonLoader", "_modalOverlay_", `_${size}_`)}`}
                >
                    <div className={cls.findFirstInFile("SkeletonLoader", "_modalContent_")}>
                        {children}
                    </div>
                </div>
            </div>,
            document.body,
        )
        : null;
}

export function ChatModalHeader({
    children,
    onClose,
}: {
    children: any;
    onClose?: () => void;
}) {
    const cls = HTMLClasses.getInstance()
    return (
        <div className={cls.findFirstInFile("SkeletonLoader", "_modalHeader_")}>
            <div className={cls.findFirstInFile("SkeletonLoader", "_modalHeaderContent_")}>{children}</div>
            {onClose && (
                <button
                    type="button"
                    className={cls.findFirstInFile("SkeletonLoader", "_modalClose_")}
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M15 5L5 15M5 5l10 10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
}

export function ChatModalBody({ children }: { children: any }) {
    return <div className={HTMLClasses.getInstance().findFirstInFile("SkeletonLoader", "_modalBody_")}>{children}</div>;
}
export function ChatModalFooter({ children }: { children: any }) {
    return <div className={HTMLClasses.getInstance().findFirstInFile("SkeletonLoader", "_modalFooter_")}>{children}</div>;
}