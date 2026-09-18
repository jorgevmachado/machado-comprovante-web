import React from 'react';

import type { TFormField } from '../field';

export type FormLayoutItem = {
  name: string;
  span?: number;
};

export type FormLayoutProps = {
  gap?: number;
  cols?: number;
  fields?: Array<FormLayoutItem>;
  children: React.ReactNode;
  className?: string;
};