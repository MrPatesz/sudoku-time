import { useLocalStorage } from '@uidotdev/usehooks';
import { useCallback, useEffect, useMemo } from 'react';

const formatter = Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 });

export const useTimer = () => {
  const [time, setTime] = useLocalStorage('timer', 0);

  const timer = useMemo(() => {
    return `${formatter.format(Math.floor(time / 60))}:${formatter.format(time % 60)}`;
  }, [time]);

  const reset = useCallback(() => setTime(0), [setTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [setTime]);

  return { timer, reset };
};
