export type TJustify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';

export const OJustify: Array<TJustify> = ['start', 'end', 'center', 'between', 'around', 'evenly'];

export const JUSTIFY_CLASS_MAP: Record<TJustify, string> = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};