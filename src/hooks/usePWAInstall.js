import { useState, useEffect } from 'react';
import {
  getPWASnapshot,
  subscribePWA,
  triggerPWAInstall,
  applyPWAUpdate,
  checkForPWAUpdate
} from '../utils/pwaManager.js';

/**
 * Hook to manage PWA / Mobile App installation, live app updates, and offline status.
 * Uses a shared singleton store so every Header/Banner button receives beforeinstallprompt.
 */
export function usePWAInstall() {
  const [snapshot, setSnapshot] = useState(() => getPWASnapshot());

  useEffect(() => {
    setSnapshot(getPWASnapshot());
    return subscribePWA(setSnapshot);
  }, []);

  return {
    ...snapshot,
    install: triggerPWAInstall,
    applyUpdate: applyPWAUpdate,
    checkForUpdate: checkForPWAUpdate
  };
}

export default usePWAInstall;
