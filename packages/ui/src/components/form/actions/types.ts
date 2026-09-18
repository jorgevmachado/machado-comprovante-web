import type { TJustify } from '@machado-repo/theme';

import type { ButtonProps } from '../../button';

export type FormActionsProps = {
  cancel?: ButtonProps;
  submit: ButtonProps;
  justify?: TJustify;
  className?: string;
}