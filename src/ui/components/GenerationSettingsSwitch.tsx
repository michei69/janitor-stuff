import { useState } from "react";
import classes from "../../classes";
import IconInfo from "./IconInfo";

export default function GenerationSettingsSwitch({
    label,
    children,
    state,
    onChange,
}: {
    label: string;
    children: any;
    state: boolean;
    onChange: any;
}) {
    const [enabled, setEnabled] = useState(state);
    const [tooltipEnabled, setTooltipEnabled] = useState(false);
    const generatedId = `${Math.random().toString(36).substr(2, 9)}`;

    return (
        <>
            <div className={classes.switch2.header}>
                <div className={classes.switch2.titleWrapper}>
                    <h3 className={classes.switch2.title}>{label}</h3>
                    <button
                        type="button"
                        className={classes.infoIcon}
                        onClick={() => setTooltipEnabled(!tooltipEnabled)}
                        // aria-label="Information about thinking display"
                    >
                        <IconInfo/>
                    </button>
                </div>
                <label className={classes.switch2.toggleWrapper} htmlFor={`${generatedId}-toggle`}>
                    <input
                        id={`${generatedId}-toggle`}
                        type="checkbox"
                        className={classes.switch2.toggleInput}
                        checked={enabled}
                        onChange={(e) => {
                            setEnabled(e.target.checked);
                            onChange(e.target.checked);
                        }}
                        // aria-label="Enable thinking display"
                    />
                    <span className={classes.switch2.toggleSlider} />
                </label>
            </div>
            {tooltipEnabled && (
                <div className={classes.switch2.tooltip}>
                    <div className={classes.switch2.tooltipContent}>
                        {children}
                    </div>
                </div>
            )}
        </>
    );
}
