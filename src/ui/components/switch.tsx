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
    const sizes = {
        sm: "_sm_9q46w_23",
        md: "_md_9q46w_28",
        lg: "_lg_9q46w_33",
    };
    const generatedId =
        id || `switch-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="_switchContainer_9q46w_2">
            {label && (
                <label htmlFor={generatedId} className="_switchLabel_9q46w_8">
                    {label}
                </label>
            )}
            <div className={`_switch_9q46w_2 ${sizes[size]}`}>
                <input
                    type="checkbox"
                    id={generatedId}
                    checked={isChecked}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                    className="_switchInput_9q46w_39"
                />
                <span className="_switchSlider_9q46w_51" />
            </div>
        </div>
    );
}
