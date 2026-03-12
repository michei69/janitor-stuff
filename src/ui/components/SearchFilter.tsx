import { useState } from "react";
import classes from "../../classes";

export default function SearchFilter({ options, value, onChangeTab, name = 'radio-filter' }: { options: any, value: any, onChangeTab: any, name?: string }) {
  return (
    <div className={classes.radio.radioInputs}>
      {options.map((option: any) => (
        <label
          key={option.value}
          className={classes.radio.radio}
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
          <div className={classes.radio.name}>
            {option.Icon && (
              <span className={classes.radio.icon}>
                <option.Icon />
              </span>
            )}
            <span className={classes.radio.text}>{option.label}</span>
          </div>
          {option.isDisabled && option.disabledMessage && value === option.value && (
            <div className={classes.radio.tooltip}>{option.disabledMessage}</div>
          )}
        </label>
      ))}
    </div>
  );
};