import { HTMLClasses } from "../../classes"

export default function ChatPanelTextArea({
    placeholder,
    content,
    setContent
}: {
    placeholder: string,
    content: string,
    setContent: (val: string) => void
}) {
    return <textarea className={HTMLClasses.getInstance().findFirstInFile("SkeletonLoader", "_formTextarea_")} placeholder={placeholder} value={content} onChange={(e) => { setContent(e.target.value) }} />
}