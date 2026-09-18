import { jest } from '@jest/globals';
import { DateVO } from '../../src';

describe('DateVO', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });


  describe('tryCreate', () => {
    test('should create a DateVO instance with normalized date', () => {
      const value = new Date('2024-06-15T12:34:56Z');
      const result = DateVO.tryCreate(value);
      expect(result.isOk).toBeTruthy();
      expect(result.instance.value).toBe(value);
      expect(result.instance.formatted).toBe('6/15/2024');
      expect(result.instance.normalized.toISOString()).toBe('2024-06-15T00:00:00.000Z');
    });

    test('should throw create an error when creating a DateVO with an invalid date', () => {
      const value = new Date('invalid-date');
      const result = DateVO.tryCreate(value);
      expect(result.isFailure).toBeTruthy();
    });
  });

  describe('create', () => {
    test('should create a DateVO instance with normalized date', () => {
      const value = new Date('2024-06-15T12:34:56Z');
      const result = DateVO.create(value);
      expect(result.value).toBe(value);
      expect(result.normalized.toISOString()).toBe('2024-06-15T00:00:00.000Z');
    });

    test('should throw create an error when creating a DateVO with an invalid date', () => {
      const value = new Date('invalid-date');
      expect(() => DateVO.create(value)).toThrow('date_picker.invalid_date');
    });
  });

  describe('toDateOnly', () => {
    test('should return a new Date object with only the date part', () => {
      const date = new Date('2024-06-15T12:34:56Z');
      const result = DateVO.toDateOnly(date);
      expect(result.toISOString()).toBe('2024-06-15T00:00:00.000Z');
    });

    test('should throw an error when the date is undefined', () => {
      const invalidDate = undefined;
      expect(() => DateVO.toDateOnly(invalidDate)).toThrow('date_picker.invalid_date');
    });

    test('should throw an error when the date is invalid', () => {
      const invalidDate = new Date('invalid-date');
      expect(() => DateVO.toDateOnly(invalidDate)).toThrow('date_picker.invalid_date');
    });
  });

  describe('isDateDisabled', () => {
    test('should return true when date is before minDate', () => {
      const date = new Date('2024-06-15');
      const minDate = new Date('2024-06-16');
      const result = DateVO.isDateDisabled(date, minDate);
      expect(result).toBe(true);
    });

    test('should return true when date is after maxDate', () => {
      const date = new Date('2024-06-17');
      const maxDate = new Date('2024-06-16');
      const result = DateVO.isDateDisabled(date, undefined, maxDate);
      expect(result).toBe(true);
    });

    test('should return false when date is within minDate and maxDate', () => {
      const date = new Date('2024-06-15');
      const minDate = new Date('2024-06-14');
      const maxDate = new Date('2024-06-16');
      const result = DateVO.isDateDisabled(date, minDate, maxDate);
      expect(result).toBe(false);
    });
  });

  describe('getInitialMonth', () => {
    test('should return normalized value when it is not disabled', () => {
      const value = new Date('2024-06-15');
      const minDate = new Date('2024-06-14');
      const maxDate = new Date('2024-06-16');
      const result = DateVO.getInitialMonth(value, minDate, maxDate);
      expect(result.toISOString()).toBe('2024-06-15T00:00:00.000Z');
    });

    test('should return minDate when normalized value is disabled', () => {
      const value = new Date('2024-06-15');
      const minDate = new Date('2024-06-16');
      const maxDate = new Date('2024-06-17');
      const result = DateVO.getInitialMonth(value, minDate, maxDate);
      expect(result.toISOString()).toBe('2024-06-16T00:00:00.000Z');
    });

    test('should return maxDate when normalized value is disabled and minDate is undefined', () => {
      const value = new Date('2024-06-15');
      const maxDate = new Date('2024-06-14');
      const result = DateVO.getInitialMonth(value, undefined, maxDate);
      expect(result.toISOString()).toBe('2024-06-14T00:00:00.000Z');
    });

    test('should return normalized value when minDate and maxDate are undefined', () => {
      const value = new Date('2024-06-15');

      const result = DateVO.getInitialMonth(value);

      expect(result.toISOString()).toBe('2024-06-15T00:00:00.000Z');
    });

    test('should return current date when value is invalid', () => {
      const result = DateVO.getInitialMonth(new Date('invalid'));

      const today = DateVO.toDateOnly(new Date());

      expect(result.toISOString()).toBe(today.toISOString());
    });
  });

  describe('addMonths', () => {
    test('should add months to the given date', () => {
      const date = new Date('2024-06-15');
      const result = DateVO.addMonths(date, 2);
      expect(result.toISOString()).toBe('2024-08-01T00:00:00.000Z');
    });

    test('should subtract months from the given date', () => {
      const date = new Date('2024-06-15');
      const result = DateVO.addMonths(date, -2);
      expect(result.toISOString()).toBe('2024-04-01T00:00:00.000Z');
    });
  });

  describe('getCalendarDays', () => {
    test('should return an array of dates for the calendar view of the given month', () => {
      const month = new Date('2024-06-01');
      const result = DateVO.getCalendarDays(month);
      expect(result.length).toBe(42); // 6 weeks * 7 days
      expect(result[0].toISOString()).toBe('2024-05-26T00:00:00.000Z'); // First day of the calendar view
      expect(result[41].toISOString()).toBe('2024-07-06T00:00:00.000Z'); // Last day of the calendar view
    });

  });

  describe('getMonthKey', () => {
    test('should return a string key for the given month', () => {
      const month = new Date('2024-06-15');
      const result = DateVO.getMonthKey(month);
      expect(result).toBe('2024-06');
    });
  });

  describe('getDateKey',() => {
    test('should return a string key for the given date', () => {
      const date = new Date('2024-06-15');
      const result = DateVO.getDateKey(date);
      expect(result).toBe('2024-06-15');
    });
  });

  describe('isSameDate', () => {
    test('should return true for the same date', () => {
      const date1 = new Date('2024-06-15');
      const date2 = new Date('2024-06-15');
      const result = DateVO.isSameDate(date1, date2);
      expect(result).toBe(true);
    });

    test('should return false for different dates', () => {
      const date1 = new Date('2024-06-15');
      const date2 = new Date('2024-06-16');
      const result = DateVO.isSameDate(date1, date2);
      expect(result).toBe(false);
    });

    test('should return false if one of the dates is null', () => {
      const date1 = new Date('2024-06-15');
      const result = DateVO.isSameDate(date1, null);
      expect(result).toBe(false);
    });

    test('should return false if both dates are null', () => {
      const result = DateVO.isSameDate(null, null);
      expect(result).toBe(false);
    });
  });

  describe('formatDate', () => {
    test('should return formatted date string for a valid date', () => {
      const date = new Date('2024-06-15');

      expect(DateVO.formatDate(date, 'en-US')).toBe('6/15/2024');
    });

    test('should format date using brazilian locale', () => {
      const date = new Date('2024-06-15');

      expect(DateVO.formatDate(date, 'pt-BR')).toBe('15/06/2024');
    });

    test('should format date using spanish locale', () => {
      const date = new Date('2024-06-15');

      expect(DateVO.formatDate(date, 'es-UE')).toBe('15/6/2024');
    });

    test('should return empty string for null date', () => {
      expect(DateVO.formatDate(null, 'pt-BR')).toBe('');
    });
  });

  describe('formatMonth', () => {
    test('should return formatted month string for a valid date', () => {
      const date = new Date('2024-06-15');

      expect(DateVO.formatMonth(date)).toBe('June');
    });

    test('should return formatted month string for a valid date with brazilian locale', () => {
      const date = new Date('2024-06-15');

      expect(DateVO.formatMonth(date, 'pt-BR')).toBe('junho');
    });
  });

  describe('getWeekDays', () => {
    test('should return an array of week days for the given locale', () => {
      const result = DateVO.getWeekDays('en-US');
      expect(result).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    });

    test('should return an array of week days for the brazilian locale', () => {
      const result = DateVO.getWeekDays('pt-BR');
      expect(result).toEqual(['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']);
    });

    test('should return an array of week days for the spanish locale', () => {
      const result = DateVO.getWeekDays('es-UE');
      expect(result).toEqual(['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']);
    });})

});
