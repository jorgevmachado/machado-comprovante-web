import React, { useMemo, useState, useRef, useCallback } from 'react';

import Alert from '../Alert';

import { ALERT_POSITIONS, type TAlert, type TAlertPosition, type TShowAlert } from './types';
import { removeAlertState, buildAlertId } from './business';

import { AlertContext, type AlertContextProps } from './AlertContext';

type AlertProviderProps = {
  children: React.ReactNode;
}

const ALERT_POSITION_STYLE_MAP: Record<TAlertPosition, React.CSSProperties> = {
  'top-left': { top: 16, left: 16 },
  'top-center': { top: 16, left: '50%', transform: 'translateX(-50%)' },
  'top-right': { top: 16, right: 16 },
  'bottom-left': { bottom: 16, left: 16 },
  'bottom-center': { bottom: 16, left: '50%', transform: 'translateX(-50%)' },
  'bottom-right': { bottom: 16, right: 16 },
};

const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const [alerts, setAlerts] = useState<Array<TAlert>>([]);

  const clearAlerts = useCallback(() => {
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current.clear();
    setAlerts([]);
  }, []);

  const dismissAlert = useCallback((id: string) => {
    const timeout = timeoutsRef.current.get(id);

    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }

    setAlerts((previousState) => removeAlertState(previousState, id));
  }, [removeAlertState]);

  const scheduleDismiss = useCallback((id: string, durationMs: number) => {
    if (durationMs <= 0) {
      return;
    }

    const timeout = setTimeout(() => {
      setAlerts((previousState) => removeAlertState(previousState, id));
      timeoutsRef.current.delete(id);
    }, durationMs);

    timeoutsRef.current.set(id, timeout);
  }, []);

  const showAlert = useCallback(({ title,  variant = 'info', message, duration = 5000, position = 'top-right' }: TShowAlert) => {
    const id = buildAlertId();

    setAlerts((previousState) => [...previousState, { id, title, variant, message, position }]);

    scheduleDismiss(id, duration);

    return id;

  }, [scheduleDismiss]);

  const contextValue = useMemo(() => ({
    alerts,
    showAlert,
    clearAlerts,
    dismissAlert
  }), [
    alerts,
    showAlert,
    clearAlerts,
    dismissAlert
  ]);

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      {alerts.length > 0 && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            pointerEvents: 'none',
          }}
        >
          {ALERT_POSITIONS.map((position) => {
            const alertsByPosition = alerts.filter((alert) => alert.position === position);

            if (alertsByPosition.length === 0) {
              return null;
            }

            return (
              <div
                key={position}
                style={{
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  width: 'min(24rem, calc(100vw - 2rem))',
                  pointerEvents: 'none',
                  ...ALERT_POSITION_STYLE_MAP[position],
                }}
              >
                {alertsByPosition.map((alert) => (
                  <Alert
                    key={alert.id}
                    className="pointer-events-auto"
                    title={alert?.title ? alert.title : alert.message}
                    onClose={() => dismissAlert(alert.id)}
                    variant={alert.variant}
                    description={alert?.title ? alert.message : undefined}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </AlertContext.Provider>
  );
};

export default AlertProvider;