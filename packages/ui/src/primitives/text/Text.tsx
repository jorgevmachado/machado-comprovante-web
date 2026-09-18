import React ,{ useMemo } from 'react';

import { buildTextTagTheme ,TTag } from '@machado-repo/theme';

import type { TextProps } from './types';

const TextBase = <T extends TTag = 'p'>({
  as ,
  wrap ,
  tone ,
  size ,
  align ,
  color ,
  srOnly ,
  italic ,
  weight ,
  display ,
  leading ,
  truncate ,
  tracking ,
  children ,
  className ,
  lineClamp ,
  transform ,
  fontFamily ,
  decoration ,
  whitespace ,
  breakStrategy ,
  ...elementProps
}: TextProps<T>) => {
  const Component = (as ?? 'p') as React.ElementType;

  const classNameList = useMemo(() => {
    const classNames = buildTextTagTheme({
      tag: Component as TTag ,
      wrap ,
      tone ,
      size ,
      align ,
      color ,
      srOnly ,
      italic ,
      weight ,
      display ,
      leading ,
      truncate ,
      tracking ,
      className ,
      lineClamp ,
      transform ,
      fontFamily ,
      decoration ,
      whitespace ,
      breakStrategy ,
    });
    return classNames.filter(Boolean).join(' ');
  } ,[
    wrap ,
    tone ,
    size ,
    align ,
    color ,
    srOnly ,
    italic ,
    weight ,
    display ,
    leading ,
    truncate ,
    tracking ,
    className ,
    lineClamp ,
    transform ,
    fontFamily ,
    decoration ,
    whitespace ,
    Component,
    breakStrategy ,
  ]);

  return React.createElement(
    Component ,
    {
      ...elementProps ,
      className: classNameList ,
    } ,
    children ,
  );
};

const Text = React.memo(TextBase) as typeof TextBase;

export default Text;