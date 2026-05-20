import { useLocalStorage } from '@uidotdev/usehooks';
import { useCallback, useEffect } from 'react';
import { useDifficulty } from './useDifficulty';

const emptyPuzzle = Array(81).fill(0);

export const usePuzzle = () => {
  const [puzzle, setPuzzle] = useLocalStorage<
    | {
        original: Array<number>;
        current: Array<number>;
        solution: Array<number>;
        rating: number;
      }
    | undefined
  >('puzzle');
  const [difficulty] = useDifficulty();

  useEffect(() => {
    if (!puzzle) {
      void (async () => {
        const puzzles = await (async () => {
          switch (difficulty) {
            case 'Easy': {
              return (await import('#/data/easy.json')).default;
            }
            case 'Medium': {
              return (await import('#/data/medium.json')).default;
            }
            case 'Hard': {
              return (await import('#/data/hard.json')).default;
            }
            case 'Diabolical': {
              return (await import('#/data/diabolical.json')).default;
            }
            default: {
              return difficulty satisfies never;
            }
          }
        })();

        const {
          puzzle,
          solution,
          difficulty: rating,
        } = puzzles[Math.floor(Math.random() * puzzles.length)];

        const original = puzzle.split('').map(Number);

        setPuzzle({
          original,
          current: original,
          solution: solution.split('').map(Number),
          rating,
        });
      })();
    }
  }, [puzzle, setPuzzle, difficulty]);

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
    // TODO type Cell = { original: number; current: number; solution: number }; cells: Array<Cell>;
    current: puzzle?.current ?? emptyPuzzle,
    original: puzzle?.original ?? emptyPuzzle,
    solution: puzzle?.solution,
    update,
    restart,
    startNew,
    rating: puzzle?.rating,
  } as const;
};
