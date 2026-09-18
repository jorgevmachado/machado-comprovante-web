import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { DateVO } from '@machado-repo/shared';

import type { DatePickerProps } from "./types";

import { useTranslationResolver } from '../../lang';

const cn = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(" ");

export function DatePicker({
  value = null,
  onChange,
  minDate,
  maxDate,
  locale,
  disabled = false,
  placeholder = "date_picker.select_date",
  className,
  "aria-label": ariaLabel = "date_picker.select_date",
}: DatePickerProps) {
  const {
    resolve
  } = useTranslationResolver()
  const normalizedValue = value ? DateVO.toDateOnly(value) : null;

  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => DateVO.getInitialMonth(normalizedValue, minDate, maxDate));

  const containerRef = useRef<HTMLDivElement>(null);
  const selectedDateRef = useRef<HTMLButtonElement | null>(null);

  const calendarDays = useMemo(() => DateVO.getCalendarDays(visibleMonth),[visibleMonth]);

  const normalizedMinDate = minDate ? DateVO.toDateOnly(minDate) : undefined;
  const normalizedMaxDate = maxDate ? DateVO.toDateOnly(maxDate) : undefined;

  const previousMonth = DateVO.addMonths(visibleMonth, -1);
  const nextMonth = DateVO.addMonths(visibleMonth, 1);

  const isPreviousMonthDisabled = Boolean(normalizedMinDate && DateVO.getMonthKey(previousMonth) < DateVO.getMonthKey(normalizedMinDate));

  const isNextMonthDisabled = Boolean(normalizedMaxDate && DateVO.getMonthKey(nextMonth) > DateVO.getMonthKey(normalizedMaxDate));

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent): void => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () =>
      document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  useEffect(() => {
    if (!open || !selectedDateRef.current) {
      return;
    }

    selectedDateRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (normalizedValue) {
      setVisibleMonth(normalizedValue);
    }
  }, [value]);

  const handleSelect = (date: Date): void => {
    if (disabled || DateVO.isDateDisabled(date, minDate, maxDate)) {
      return;
    }

    onChange?.(date);
    setOpen(false);
  };

  const handlePreviousMonth = (): void => {
    if (!isPreviousMonthDisabled) {
      setVisibleMonth(previousMonth);
    }
  };

  const handleNextMonth = (): void => {
    if (!isNextMonthDisabled) {
      setVisibleMonth(nextMonth);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const keyActions: Record<string, () => void> = {
      ArrowLeft: () => setVisibleMonth(DateVO.addMonths(visibleMonth, -1)),
      ArrowRight: () => setVisibleMonth(DateVO.addMonths(visibleMonth, 1)),
      Escape: () => setOpen(false),
    };

    const action = keyActions[event.key];

    if (action) {
      event.preventDefault();
      action();
    }
  };

  const currentPlaceholder = useMemo(() => {
    if(!placeholder) {
      return;
    }
    return resolve(placeholder);
  }, [placeholder, resolve]);

  const currentAriaLabel = useMemo(() => resolve(ariaLabel), [ariaLabel, resolve]);

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block w-full", className)}
    >
      <button
        type="button"
        disabled={disabled}
        aria-label={currentAriaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border",
          "bg-background px-3 text-sm transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          normalizedValue ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <span>{DateVO.formatDate(normalizedValue, locale) || currentPlaceholder}</span>

        <span
          aria-hidden="true"
          className="ml-2 text-muted-foreground"
        >
          📅
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Calendário"
          className={cn(
            "absolute z-50 mt-2 w-[296px] rounded-md border",
            "bg-background p-3 shadow-md",
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="Mês anterior"
              disabled={isPreviousMonthDisabled}
              onClick={handlePreviousMonth}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-md",
                "text-sm transition-colors hover:bg-muted",
                "focus:outline-none focus:ring-2 focus:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-40",
              )}
            >
              ←
            </button>

            <span className="text-sm font-semibold">
              {DateVO.formatMonth(visibleMonth, locale)}{" "}
              {visibleMonth.getUTCFullYear()}
            </span>

            <button
              type="button"
              aria-label="Próximo mês"
              disabled={isNextMonthDisabled}
              onClick={handleNextMonth}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-md",
                "text-sm transition-colors hover:bg-muted",
                "focus:outline-none focus:ring-2 focus:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-40",
              )}
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {DateVO.getWeekDays(locale).map((day, index) => (
              <span
                key={`${day}-${index}`}
                aria-hidden="true"
                className="flex h-8 items-center justify-center text-xs font-medium text-muted-foreground"
              >
                {day}
              </span>
            ))}

            {calendarDays.map((date) => {
              const isCurrentMonth =
                date.getUTCMonth() === visibleMonth.getUTCMonth();

              const dateDisabled = DateVO.isDateDisabled(
                date,
                minDate,
                maxDate,
              );

              const selected = DateVO.isSameDate(date, normalizedValue);

              return (
                <button
                  key={DateVO.getDateKey(date)}
                  ref={selected ? selectedDateRef : undefined}
                  type="button"
                  disabled={dateDisabled}
                  tabIndex={selected ? 0 : -1}
                  aria-label={DateVO.formatDate(date, locale)}
                  aria-current={selected ? "date" : undefined}
                  onClick={() => handleSelect(date)}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "flex h-9 items-center justify-center rounded-md text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-ring",
                    "hover:bg-muted",
                    !isCurrentMonth && "text-muted-foreground/40",
                    dateDisabled &&
                    "cursor-not-allowed text-muted-foreground/30 hover:bg-transparent",
                    selected &&
                    "bg-primary text-primary-foreground hover:bg-primary",
                  )}
                >
                  {date.getUTCDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between border-t pt-3">
            <button
              type="button"
              disabled={disabled || !normalizedValue}
              onClick={() => {
                onChange?.(null);
                setOpen(false);
              }}
              className={cn(
                "text-sm text-muted-foreground hover:text-foreground",
                "focus:outline-none focus:underline",
                "disabled:cursor-not-allowed disabled:opacity-40",
              )}
            >
              Limpar
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => handleSelect(DateVO.toDateOnly(new Date()))}
              className={cn(
                "text-sm font-medium text-primary hover:underline",
                "focus:outline-none focus:underline",
                "disabled:cursor-not-allowed disabled:opacity-40",
              )}
            >
              Hoje
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DatePicker;