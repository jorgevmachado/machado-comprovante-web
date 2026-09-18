import enUS from './locales/en-US.json';
import esUE from './locales/es-UE.json';
import ptBR from './locales/pt-BR.json';

import type { TLocalesFiles } from '@machado-repo/i18n';

export { default } from './DatePicker';
export type { DatePickerProps } from './types';

export const datePickerLocales:TLocalesFiles = { "en-US": enUS, "es-UE": esUE, "pt-BR": ptBR };