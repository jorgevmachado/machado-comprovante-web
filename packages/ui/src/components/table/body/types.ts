import type { TTableHeader } from '../header';
import type { TTableBodyActions } from './actions';

import type { TTableBodyAppearanceTheme } from '@machado-repo/theme';

export type TableBodyProps<T> = {
  items: Array<T>;
  headers: Array<TTableHeader<T>>;
  actions?: TTableBodyActions<T>;
  appearance: TTableBodyAppearanceTheme;
}