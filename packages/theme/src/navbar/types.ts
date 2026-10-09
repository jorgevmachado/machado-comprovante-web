import type { TNavbarVariant } from './variant';

export type TNavbarVariantsTheme = {
  icon: string;
  title: string;
  header: string;
  button: string;
  subtitle: string;
}

export type TNavbarThemeVariant = Record<TNavbarVariant, TNavbarVariantsTheme>;

export type BuildNavbarThemeResult = {
  icon: string;
  title: string;
  header: string;
  button: string;
  subtitle: string;
};