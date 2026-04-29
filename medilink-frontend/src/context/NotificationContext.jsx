/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useState } from 'react';
import Toast from '../components/common/Toast.jsx';

export const NotificationContext = createContext(null);

function buildId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const dismissNotification = useCallback((id) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  }, []);

  const pushNotification = useCallback(
    ({ title, message, variant = 'info', duration = 4000 }) => {
      const id = buildId();

      setNotifications((current) => [
        ...current,
        {
          id,
          title,
          message,
          variant,
        },
      ]);

      if (duration > 0) {
        window.setTimeout(() => {
          dismissNotification(id);
        }, duration);
      }

      return id;
    },
    [dismissNotification],
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        pushNotification,
        dismissNotification,
        notifySuccess(message, title = 'Success') {
          return pushNotification({ title, message, variant: 'success' });
        },
        notifyError(message, title = 'Something went wrong') {
          return pushNotification({ title, message, variant: 'error' });
        },
        notifyInfo(message, title = 'Heads up') {
          return pushNotification({ title, message, variant: 'info' });
        },
      }}
    >
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            {...notification}
            onDismiss={() => dismissNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
