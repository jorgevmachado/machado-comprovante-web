import { createContext } from 'react';

import type { TAlert, TShowAlert } from './types';

export type AlertContextProps = {
  alerts: Array<TAlert>;
  showAlert: (event: TShowAlert) => string;
  clearAlerts: () => void;
  dismissAlert: (id: string) => void;
};

export const AlertContext = createContext<AlertContextProps | null>(null);