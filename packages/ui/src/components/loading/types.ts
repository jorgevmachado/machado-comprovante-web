import type { TReducedSize ,TTone } from '@machado-repo/theme';

export type LoadingVariant =
  | 'bar'
  | 'circle'
  | 'dot';

export type LoadingVariantProps = {
  tone?: TTone;
  size?: TReducedSize;
}

export type LoadingProps = LoadingVariantProps & {
  variant?: LoadingVariant;
  complete?: boolean;
  progress?: boolean;
}