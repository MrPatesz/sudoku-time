import { useLocalStorage } from '@uidotdev/usehooks';
import { useCallback, useEffect } from 'react';

export const usePuzzle = () => {
  const [puzzle, setPuzzle] = useLocalStorage<
    | {
        original: Array<number>;
        current: Array<number>;
        // TODO solution: Array<number>;
      }
    | undefined
  >('puzzle');

  useEffect(() => {
    if (!puzzle) {
      void (async () => {
        const puzzles = (await import('#/data/puzzles.json')).default;
        const original = puzzles[Math.floor(Math.random() * puzzles.length)]
          .split('')
          .map(Number);
        setPuzzle({ original, current: original });
      })();
    }
  }, [puzzle, setPuzzle]);

  const update = useCallback(
    (index: number, digit: number) =>
      setPuzzle(
        (prev) =>
          prev &&
          (!prev.original[index]
            ? { ...prev, current: prev.current.toSpliced(index, 1, digit) }
            : prev),
      ),
    [setPuzzle],
  );

  const restart = useCallback(
    () => setPuzzle((prev) => prev && { ...prev, current: prev.original }),
    [setPuzzle],
  );

  const startNew = useCallback(() => setPuzzle(undefined), [setPuzzle]);

  return {
    current: puzzle?.current ?? [], // TODO Array<{current: number; original: number}> ???
    original: puzzle?.original ?? [],
    update,
    restart,
    startNew,
  } as const;
};
