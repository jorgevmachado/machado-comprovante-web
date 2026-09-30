import { DateFormat } from '../../../../src/value-object/date/format';

describe('DateFormat', () => {
  const dateFormat = new DateFormat();

  describe('dateStringToDate', () => {
    test('should convert a valid date string to a Date object', () => {
      const dateString = '2024-06-15';
      const result = dateFormat.dateStringToDate(dateString);
      expect(result).toBeInstanceOf(Date);
      expect(result?.toISOString().split('T')[0]).toBe(dateString);
    });

    test('should return undefined for an invalid date string', () => {
      const invalidDateString = 'invalid-date';
      const result = dateFormat.dateStringToDate(invalidDateString);
      expect(result).toBeUndefined();
    });

    test('should return undefined for a undefined date string', () => {
      const result = dateFormat.dateStringToDate(undefined);
      expect(result).toBeUndefined();
    });
  });
  describe('dateToDateString', () => {
    test('should convert a valid Date object to a date string', () => {
      const date = new Date('2024-06-15');
      const result = dateFormat.dateToDateString(date);
      expect(result).toBe('2024-06-15');
    });

    test('should return undefined for an invalid Date object', () => {
      const invalidDate = new Date('invalid-date');
      const result = dateFormat.dateToDateString(invalidDate);
      expect(result).toBeUndefined();
    });

    test('should convert date string object to date string', () => {
      const dateString = '2024-06-15';
      const result = dateFormat.dateToDateString(dateString);
      expect(result).toBe('2024-06-15');
    });
  });

  describe('date', () => {
    test('should return formatted date string for a valid date', () => {
      const date = new Date('2024-06-15');

      expect(dateFormat.date(date)).toBe('6/15/2024');
    });

    test('should return formatted date string for a valid date object string', () => {
      const date = '2024-06-15';

      expect(dateFormat.date(date, 'en-US')).toBe('6/15/2024');
    });

    test('should format date using brazilian locale', () => {
      const date = new Date('2024-06-15');

      expect(dateFormat.date(date, 'pt-BR')).toBe('15/06/2024');
    });

    test('should format date using spanish locale', () => {
      const date = new Date('2024-06-15');

      expect(dateFormat.date(date, 'es-UE')).toBe('15/6/2024');
    });

    test('should return empty string for null date', () => {
      expect(dateFormat.date(null, 'pt-BR')).toBe('');
    });
  });

  describe('toDateOnly', () => {
    test('should return a new Date object with only the date part', () => {
      const date = new Date('2024-06-15T12:34:56Z');
      const result = dateFormat.toDateOnly(date);
      expect(result.toISOString()).toBe('2024-06-15T00:00:00.000Z');
    });

    test('should throw an error when the date is undefined', () => {
      const invalidDate = undefined;
      expect(() => dateFormat.toDateOnly(invalidDate)).toThrow('date.invalid_date');
    });

    test('should throw an error when the date is invalid', () => {
      const invalidDate = new Date('invalid-date');
      expect(() => dateFormat.toDateOnly(invalidDate)).toThrow('date.invalid_date');
    });
  });

  describe('month', () => {
    test('should return formatted month string for a valid date', () => {
      const date = new Date('2024-06-15');

      expect(dateFormat.month(date)).toBe('June');
    });

    test('should return formatted month string for a valid date object string', () => {
      const date = '2024-06-15';

      expect(dateFormat.month(date)).toBe('June');
    });

    test('should return formatted month string for a valid date with brazilian locale', () => {
      const date = new Date('2024-06-15');

      expect(dateFormat.month(date, 'pt-BR')).toBe('junho');
    });

    test('should return empty string for undefined date', () => {
      expect(dateFormat.month(undefined)).toBe('');
    });
  });
})