import { useLocalStorage } from '@uidotdev/usehooks';
import { useCallback, useEffect, useMemo } from 'react';

const formatter = Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 });

export const useTimer = () => {
  const [time, setTime] = useLocalStorage('timer', 0);
  const [stopped, setStopped] = useLocalStorage('timerStopped', false);

  const timer = useMemo(() => {
    return `${formatter.format(Math.floor(time / 60))}:${formatter.format(time % 60)}`;
  }, [time]);

  const reset = useCallback(() => {
    setTime(0);
    setStopped(false);
  }, [setTime, setStopped]);

  const stop = useCallback(() => setStopped(true), [setStopped]);

  useEffect(() => {
    if (stopped) {
      return;
    }

    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [stopped, setTime]);

  return { timer, reset, stop };
};
