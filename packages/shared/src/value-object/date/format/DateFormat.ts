import type { DateLocale } from '../types';
import { INVALID_DATE } from '../constants';

export class DateFormat {
  public dateStringToDate(dateString?: string): Date | undefined {
    if (!dateString){
      return undefined;
    }
    const [year, month, day] = dateString.split('-').map(Number);
    if(!year || !month || !day) {
      return undefined;
    }
    return new Date(year, month - 1, day);
  }

  public dateToDateString(date?: Date | string): string | undefined {
    const rawDate = typeof date === 'string' ? new Date(date) : date;

    if(!rawDate || isNaN(rawDate.getTime())) {
      return undefined;
    }

    return rawDate.toISOString().split('T')[0];
  }

  public date(date?: Date | string, locale: DateLocale = 'en-US'): string {
    const rawDate = typeof date === 'string' ? new Date(date) : date;
    if(!rawDate || isNaN(rawDate.getTime())) {
      return '';
    }
    return new Intl.DateTimeFormat(locale, { timeZone: 'UTC' }).format(rawDate);
  }

  public toDateOnly(date?: Date | null): Date {
    if(!date || isNaN(date.getTime())) {
      throw new Error(INVALID_DATE);
    }
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }

  public month(date?: Date | string, locale: DateLocale = 'en-US'): string {
    const rawDate = typeof date === 'string' ? new Date(date) : date;
    if(!rawDate || isNaN(rawDate.getTime())) {
      return '';
    }
    return new Intl.DateTimeFormat(locale, {
      month: 'long',
      timeZone: 'UTC'
    }).format(rawDate);
  }
}