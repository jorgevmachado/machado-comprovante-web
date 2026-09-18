// export const toDateOnly = (date: Date): Date =>
//   new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

// export const getInitialMonth = (
//   value: Date | null,
//   minDate: Date | undefined,
//   maxDate: Date | undefined,
// ): Date => {
//   const normalizedValue = value ? toDateOnly(value) : null;
//
//   if (
//     normalizedValue &&
//     !isDateDisabled(normalizedValue, minDate, maxDate)
//   ) {
//     return normalizedValue;
//   }
//
//   if (minDate) {
//     return toDateOnly(minDate);
//   }
//
//   if (maxDate) {
//     return toDateOnly(maxDate);
//   }
//
//   return toDateOnly(new Date());
// };


// const _getDaysInMonth = (date: Date): number =>
//   new Date(
//     Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
//   ).getUTCDate();
//
// const _getFirstDayOfMonth = (date: Date): number =>
//   new Date(
//     Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1),
//   ).getUTCDay();
//
// const _fromDateParts = (year: number, month: number, day: number): Date =>
//   new Date(Date.UTC(year, month, day));
//
// export const getCalendarDays = (month: Date): Date[] => {
//   const firstDay = _getFirstDayOfMonth(month);
//   const daysInMonth = _getDaysInMonth(month);
//
//   const previousMonth = addMonths(month, -1);
//   const daysInPreviousMonth = _getDaysInMonth(previousMonth);
//
//   const previousMonthDays = Array.from(
//     { length: firstDay },
//     (_, index) =>
//       _fromDateParts(
//         previousMonth.getUTCFullYear(),
//         previousMonth.getUTCMonth(),
//         daysInPreviousMonth - firstDay + index + 1,
//       ),
//   );
//
//   const currentMonthDays = Array.from(
//     { length: daysInMonth },
//     (_, index) =>
//       _fromDateParts(
//         month.getUTCFullYear(),
//         month.getUTCMonth(),
//         index + 1,
//       ),
//   );
//
//   const totalDays = previousMonthDays.length + currentMonthDays.length;
//   const remainingDays = (7 - (totalDays % 7)) % 7;
//
//   const nextMonth = addMonths(month, 1);
//
//   const nextMonthDays = Array.from(
//     { length: remainingDays },
//     (_, index) =>
//       _fromDateParts(
//         nextMonth.getUTCFullYear(),
//         nextMonth.getUTCMonth(),
//         index + 1,
//       ),
//   );
//
//   return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
// };
//
// export const addMonths = (date: Date, amount: number): Date =>
//   new Date(
//     Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + amount, 1),
//   );
//


// export const getMonthKey = (date: Date): string =>
//   `${date.getUTCFullYear()}-${_pad(date.getUTCMonth() + 1)}`;


// const _isBefore = (date: Date, reference: Date): boolean =>
//   date.getTime() < reference.getTime();
//
// const _isAfter = (date: Date, reference: Date): boolean =>
//   date.getTime() > reference.getTime();

// export const isDateDisabled = (
//   date: Date,
//   minDate: Date | undefined,
//   maxDate: Date | undefined,
// ): boolean => {
//   const normalizedDate = toDateOnly(date);
//   const normalizedMinDate = minDate ? toDateOnly(minDate) : undefined;
//   const normalizedMaxDate = maxDate ? toDateOnly(maxDate) : undefined;
//
//   return Boolean(
//     (normalizedMinDate && _isBefore(normalizedDate, normalizedMinDate)) ||
//     (normalizedMaxDate && _isAfter(normalizedDate, normalizedMaxDate)),
//   );
// };

// export const isSameDate = (first: Date | null, second: Date | null): boolean =>
//   Boolean(first && second && getDateKey(first) === getDateKey(second));
//
// export const getDateKey = (date: Date): string =>
//   `${date.getUTCFullYear()}-${_pad(date.getUTCMonth() + 1)}-${_pad(
//     date.getUTCDate(),
//   )}`;

const _pad = (value: number): string => String(value).padStart(2, "0");

export const formatDate = (date: Date | null): string => {
  if (!date) {
    return "";
  }

  return `${_pad(date.getUTCDate())}/${_pad(
    date.getUTCMonth() + 1,
  )}/${date.getUTCFullYear()}`;
};