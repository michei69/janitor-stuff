import { useState } from "react";
import ChatAlertDialog from "../components/ChatAlertDialog";
import ChatBurgerButton from "../components/ChatBurgerButton";

export default function ChatDevButtonAlert() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <ChatBurgerButton
                disabled={false}
                className="DOGGY_dev"
                onClick={() => {
                    setIsOpen(!isOpen);
                }}
            >
                Dev Mode
            </ChatBurgerButton>
            <ChatAlertDialog
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                }}
                onConfirm={() => {
                    setIsOpen(false);
                }}
                title="Test"
                message="Test"
            />
        </>
    );
}
