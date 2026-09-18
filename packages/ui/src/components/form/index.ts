import type { TLocalesFiles } from '@machado-repo/i18n';

import enUS from './locales/en-US.json';
import esUE from './locales/es-UE.json';
import ptBR from './locales/pt-BR.json';

export { default } from './Form';
export type { FormValidation } from './validator';

export type { FormProps } from './types';

export const formLocales:TLocalesFiles = { "en-US": enUS, "es-UE": esUE, "pt-BR": ptBR };