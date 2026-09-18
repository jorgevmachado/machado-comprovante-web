import { ReactNode, KeyboardEvent } from 'react';
import type { TIcon } from '@machado-repo/icons';

import type { InputProps } from '../input';

export type AutocompleteOption = {
  key: string;
  icon?: ReactNode | TIcon;
  value: string;
  label?: string;
  description?: string;
};

export type AutocompleteProps = Readonly<Omit<
  InputProps,
  'role' | 'value' | 'onChange' | 'onValueChange' | 'children'
> & {
  name: string;
  value: string;
  label?: string;
  options: ReadonlyArray<AutocompleteOption>;
  maxOptions?: number;
  filterOptions?: (option: AutocompleteOption, normalizedQuery: string) => boolean;
  noResultsText?: string;
  onValueChange?: (value: string) => void;
  onInputKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onSelectOption?: (option: AutocompleteOption) => void;
  optionClassName?: string;
  listboxClassName?: string;
  loadingPlaceholder?: string;
}>;
