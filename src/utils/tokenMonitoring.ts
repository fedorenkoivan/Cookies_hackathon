export type TokenTimerRefs = {
  warning: NodeJS.Timeout | null;
  expiration: NodeJS.Timeout | null;
};

export const setupTokenTimers = (
  expiresAt: number,
  warningMs: number,
  onWarning: () => void,
  onExpire: () => void,
  userDismissed: boolean,
): TokenTimerRefs => {
  const timers: TokenTimerRefs = {
    warning: null,
    expiration: null,
  };

  const now = Date.now();
  const timeToExpiry = expiresAt - now;

  if (timeToExpiry <= 0) {
    onExpire();
    return timers;
  }

  const timeToWarning = timeToExpiry - warningMs;

  if (timeToWarning > 0) {
    timers.warning = setTimeout(() => {
      if (!userDismissed) {
        onWarning();
      }
    }, timeToWarning);
  } else if (!userDismissed) {
    onWarning();
  }

  timers.expiration = setTimeout(() => {
    onExpire();
  }, timeToExpiry);

  return timers;
};

export const clearTokenTimers = (timers: TokenTimerRefs) => {
  if (timers.warning) {
    clearTimeout(timers.warning);
    timers.warning = null;
  }

  if (timers.expiration) {
    clearTimeout(timers.expiration);
    timers.expiration = null;
  }
};
