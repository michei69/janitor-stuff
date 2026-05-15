import { HTMLClasses } from "../../classes";

export default function SearchFilter({ options, value, onChangeTab, name = 'radio-filter' }: { options: any, value: any, onChangeTab: any, name?: string }) {
    const cls = HTMLClasses.getInstance()

    return (
        <div className={cls.findFirstInFile("index-", "_radioInputs_") || cls.findFirst("_radioInputs_")}>
            {options.map((option: any) => (
                <label
                    key={option.value}
                    className={cls.findFirstAfterFirstInFile("index-", "_radioInputs_", "_radio_") || cls.findFirstAfterFirst("_radioInputs_", "_radio_")}
                >
                    <input
                        type="radio"
                        name={name}
                        checked={value === option.value}
                        disabled={option.isDisabled}
                        onChange={() => {
                            // Preserve original logic exactly
                            if (option.isDisabled) return;
                            const s = option.onClick?.();
                            if (!s && onChangeTab) onChangeTab(option.value);
                        }}
                    />
                    <div className={cls.findFirstAfterFirstInFile("index-", "_radioInputs_", "_name_") || cls.findFirstAfterFirst("_radioInputs_", "_name_")}>
                        {option.Icon && (
                            <span className={cls.findFirstAfterFirstInFile("index-", "_radioInputs_", "_icon_") || cls.findFirstAfterFirst("_radioInputs_", "_icon_")}>
                                <option.Icon />
                            </span>
                        )}
                        <span className={cls.findFirstAfterFirstInFile("index-", "_radioInputs_", "_text_") || cls.findFirstAfterFirst("_radioInputs_", "_text_")}>{option.label}</span>
                    </div>
                    {option.isDisabled && option.disabledMessage && value === option.value && (
                        <div className={cls.findFirstAfterFirstInFile("index-", "_radioInputs_", "_tooltip_") || cls.findFirstAfterFirst("_radioInputs_", "_tooltip_")}>{option.disabledMessage}</div>
                    )}
                </label>
            ))}
        </div>
    );
};