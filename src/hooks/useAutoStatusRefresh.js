import { useState, useEffect } from 'react';
import { getTodayIST } from '../utils/notificationStatus.js';

/**
 * Hook to automatically refresh date-dependent calculations in real-time.
 * Checks the Indian Standard Time date every interval (default 30 seconds).
 * When midnight in IST arrives, triggers a re-render so UPCOMING -> OPEN -> CLOSED transitions
 * occur dynamically without requiring manual page reloads or database modifications.
 */
export function useAutoStatusRefresh(intervalMs = 30000) {
  const [currentDateIST, setCurrentDateIST] = useState(() => getTodayIST());
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const latestDate = getTodayIST();
      setCurrentDateIST((prev) => {
        if (prev !== latestDate) {
          return latestDate;
        }
        return prev;
      });
      setTick((t) => t + 1);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]);

  return { currentDateIST, tick };
}

export default useAutoStatusRefresh;
