import type { TThemeTone, TThemeVariant } from '@machado-repo/theme';

export type ThemeMode = TThemeVariant;

export type ThemeSwitcherProps = {
  tone?: TThemeTone;
  variant?: ThemeMode;
  onChange?: (theme: ThemeMode) => void;
  defaultVariant?: ThemeMode;
};
