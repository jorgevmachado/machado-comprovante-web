export type TAlign = 'left' | 'center' | 'right' | 'justify' | 'start' | 'end';

export const OAlign: Array<TAlign> = ['left', 'center', 'right', 'justify', 'start', 'end'];

export const TEXT_ALIGN_CLASS_MAP: Record<TAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
  start: 'text-start',
  end: 'text-end',
};