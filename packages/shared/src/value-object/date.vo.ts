import { Result ,ValueObject ,ValueObjectConfig } from '../base';

export type DateLocale = 'en-US' | 'pt-BR' | 'es-UE';

export interface DateConfig extends ValueObjectConfig {
  locale?: DateLocale;
}

export class DateVO extends ValueObject<Date ,DateConfig> {
  private static readonly INVALID_DATE = 'date_picker.invalid_date';
  private readonly _normalized: Date;
  private readonly _formatted: string;
  constructor(value: Date, config?: DateConfig) {
    super(value, config);
    this._normalized = DateVO.toDateOnly(value);
    this._formatted = DateVO.formatDate(this._normalized, config?.locale);
  }

  get normalized(): Date {
    return this._normalized;
  }

  get formatted(): string {
    return this._formatted;
  }

  public static tryCreate(value: Date, config?: DateConfig): Result<DateVO> {
    try {
      return Result.ok(new DateVO(value, config));
    } catch {
      return Result.fail(DateVO.INVALID_DATE);
    }
  }

  public static create(value: Date, config?: DateConfig): DateVO {
    const result = DateVO.tryCreate(value, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static toDateOnly(date?: Date | null): Date {
    if(!date || isNaN(date.getTime())) {
      throw new Error(DateVO.INVALID_DATE);
    }
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }

  public static formatDate(date?: Date | null, locale: DateLocale = 'en-US'): string {
    if(!date || isNaN(date.getTime())) {
      return "";
    }
    return new Intl.DateTimeFormat(locale, { timeZone: 'UTC' }).format(date);
  }

  public static formatMonth(date: Date, locale: DateLocale = 'en-US'): string {
    return new Intl.DateTimeFormat(locale, {
      month: "long",
      timeZone: "UTC",
    }).format(date);
  }

  public static getWeekDays(locale: DateLocale = 'en-US'): Array<string> {
    const formatter = new Intl.DateTimeFormat(locale, {
      weekday: "short",
      timeZone: "UTC",
    });
    const currentYear = new Date().getUTCFullYear();
    const referenceDate = new Date(Date.UTC(currentYear, 0, 1));
    const dayOfWeek = referenceDate.getUTCDay();
    const sunday = new Date(referenceDate);
    sunday.setUTCDate(referenceDate.getUTCDate() - dayOfWeek);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(sunday);
      date.setUTCDate(sunday.getUTCDate() + index);
      const formattedDate = formatter.format(date);
      const cleanFormattedDate = formattedDate.replace(/\.$/, "");
      return cleanFormattedDate.charAt(0).toUpperCase() + cleanFormattedDate.slice(1);
    });
  }

  public static isDateDisabled(date: Date, minDate?: Date, maxDate?: Date): boolean {
    const normalizedDate = DateVO.toDateOnly(date);
    const normalizedMinDate = minDate ? DateVO.toDateOnly(minDate) : undefined;
    const normalizedMaxDate = maxDate ? DateVO.toDateOnly(maxDate) : undefined;

    return Boolean(
      (normalizedMinDate && DateVO._isBefore(normalizedDate, normalizedMinDate)) ||
      (normalizedMaxDate && DateVO._isAfter(normalizedDate, normalizedMaxDate)),
    );
  }

  public static getInitialMonth(
    value?: Date | null,
    minDate?: Date,
    maxDate?: Date,
  ): Date {
    try {
      const normalizedValue = DateVO.toDateOnly(value);

      if(normalizedValue && !DateVO.isDateDisabled(normalizedValue, minDate, maxDate)) {
        return normalizedValue;
      }

      if(minDate) {
        return DateVO.toDateOnly(minDate);
      }

      return DateVO.toDateOnly(maxDate);
    } catch {
      return  DateVO.toDateOnly(new Date());
    }
  }

  public static addMonths(date: Date, amount: number): Date {
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + amount, 1),
    );
  }

  public static getCalendarDays(month: Date): Array<Date> {
    const firstDay = DateVO._getFirstDayOfMonth(month);
    const daysInMonth = DateVO._getDaysInMonth(month);

    const previousMonth = DateVO.addMonths(month, -1);
    const daysInPreviousMonth = DateVO._getDaysInMonth(previousMonth);

    const previousMonthDays = Array.from(
      { length: firstDay },
      (_, index) => DateVO._fromDateParts(
        previousMonth.getUTCFullYear(),
        previousMonth.getUTCMonth(),
        daysInPreviousMonth - firstDay + index + 1,
      ),
    );

    const currentMonthDays = Array.from(
      { length: daysInMonth },
      (_, index) => DateVO._fromDateParts(
        month.getUTCFullYear(),
        month.getUTCMonth(),
        index + 1,
      ),
    );

    const totalDays = previousMonthDays.length + currentMonthDays.length;
    const remainingDays = (7 - (totalDays % 7)) % 7;

    const nextMonth = DateVO.addMonths(month, 1);

    const nextMonthDays = Array.from(
      { length: remainingDays },
      (_, index) =>
        DateVO._fromDateParts(
          nextMonth.getUTCFullYear(),
          nextMonth.getUTCMonth(),
          index + 1,
        ),
    );

    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];

  }

  public static getMonthKey(date: Date): string {
    return `${date.getUTCFullYear()}-${DateVO._pad(date.getUTCMonth() + 1)}`;
  }

  public static getDateKey(date: Date): string {
    return `${date.getUTCFullYear()}-${DateVO._pad(date.getUTCMonth() + 1)}-${DateVO._pad(date.getUTCDate())}`;
  }

  public static isSameDate(first?: Date | null, second?: Date | null): boolean {
    return Boolean(first && second && DateVO.getDateKey(first) === DateVO.getDateKey(second));
  }



  private static _isBefore(date: Date, reference: Date): boolean {
    return date.getTime() < reference.getTime();
  }

  private static _isAfter(date: Date, reference: Date): boolean {
    return date.getTime() > reference.getTime();
  }

  private static _getFirstDayOfMonth(date: Date): number {
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1),
    ).getUTCDay();
  }

  private static _getDaysInMonth(date: Date): number {
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
    ).getUTCDate();
  }

  private static _fromDateParts (year: number, month: number, day: number): Date {
    return new Date(Date.UTC(year, month, day));
  }

  private static _pad(value: number): string {
    return String(value).padStart(2, "0");
  }
}