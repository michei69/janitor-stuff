import { useMemo } from "react";

const cls = {
  container: '_container_1krmi_4',
  tab: '_tab_1krmi_34',
  disabled: '_disabled_1krmi_54',
  active: '_active_1krmi_67',
  icon: '_icon_1krmi_88',
  badge: '_badge_1krmi_95',
  tooltip: '_tooltip_1krmi_117'
};

export default function SearchFilters({ options, value, onChangeTab }: { options: any, value: any, onChangeTab: any }) {
  const selectedIndex = useMemo(
    () => options.findIndex((option: any) => option.value === value),
    [options, value]
  );

  return (
    <div className={cls.container} role="tablist">
      {options.map((option: any, index: any) => {
        const isActive = index === selectedIndex;
        const tabClassName = [
          cls.tab,
          isActive && cls.active,
          option.isDisabled && cls.disabled,
          option.className
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-disabled={option.isDisabled}
            className={tabClassName}
            onClick={() => {
              if (option.isDisabled) return;
              const result = option.onClick?.();
              if (!result) {
                onChangeTab?.(option.value);
              }
            }}
            tabIndex={option.isDisabled ? -1 : 0}
          >
            {option.Icon && (
              <span className={cls.icon}>
                <option.Icon />
              </span>
            )}
            {option.label}
            {option.badge && (
              <span className={cls.badge}>{option.badge}</span>
            )}
            {option.isDisabled && option.disabledMessage && (
              <span className={cls.tooltip}>{option.disabledMessage}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};