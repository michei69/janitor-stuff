import { HTMLClasses } from "../../classes";

export default function Switch({
    isChecked,
    onChange,
    disabled = false,
    size = "md",
    label,
    id,
}: {
    isChecked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    size?: "sm" | "md" | "lg";
    label?: string;
    id?: string;
}) {
    const generatedId =
        id || `switch-${Math.random().toString(36).substr(2, 9)}`;
    const cls = HTMLClasses.getInstance()

    return (
        <div className={cls.findFirstInFile("Switch-", "_switchContainer_")}>
            {label && (
                <label htmlFor={generatedId} className={cls.findFirstInFile("Switch-", "_switchLabel_")}>
                    {label}
                </label>
            )}
            <div className={`${cls.findFirstInFile("Switch-", "_switch_")} ${cls.findFirstInFile("Switch-", `_${size}_`)}`}>
                <input
                    type="checkbox"
                    id={generatedId}
                    checked={isChecked}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                    className={cls.findFirstInFile("Switch-", "_switchInput_")}
                />
                <span className={cls.findFirstInFile("Switch-", "_switchSlider_")} />
            </div>
        </div>
    );
}
