import classes from "../../classes";

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

    return (
        <div className={classes.switchContainer}>
            {label && (
                <label htmlFor={generatedId} className={classes.switchLabel}>
                    {label}
                </label>
            )}
            <div className={`${classes.switch} ${classes.sizes[size]}`}>
                <input
                    type="checkbox"
                    id={generatedId}
                    checked={isChecked}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                    className={classes.switchInput}
                />
                <span className={classes.switchSlider} />
            </div>
        </div>
    );
}
