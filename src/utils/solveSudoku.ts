import { getDefaultOptions } from './getDefaultOptions';
import { getIndices } from './getIndices';

let rows: boolean[];
let cols: boolean[];
let boxes: boolean[];

const digitPlacedAt = (digit: number, index: number) => {
  const { rowIndex, colIndex, boxIndex } = getIndices(index);
  rows[rowIndex * 9 + digit - 1] = false;
  cols[colIndex * 9 + digit - 1] = false;
  boxes[boxIndex * 9 + digit - 1] = false;
};

function* createCandidateGenerator(
  puzzle: Array<number>,
): Generator<Array<number>, Array<number> | undefined> {
  const cells: {
    options: Array<number>;
    index: number;
  }[] = [];

  for (let i = 0; i < puzzle.length; i++) {
    if (puzzle[i]) {
      continue;
    }

    const { rowIndex, colIndex, boxIndex } = getIndices(i);

    const cellOptions: number[] = [];

    for (let j = 0; j < 9; j++) {
      const digit = j + 1;
      if (
        rows[rowIndex * 9 + j] &&
        cols[colIndex * 9 + j] &&
        boxes[boxIndex * 9 + j]
      ) {
        cellOptions.push(digit);
      }
    }

    switch (cellOptions.length) {
      case 0: {
        return;
      }
      case 1: {
        const digit = cellOptions[0];
        digitPlacedAt(digit, i);
        return puzzle.toSpliced(i, 1, digit);
      }
      default: {
        cells.push({
          options: cellOptions,
          index: i,
        });
      }
    }
  }

  cells.sort((a, b) => a.options.length - b.options.length);

  const cell = cells[0];
  for (const option of cell.options) {
    digitPlacedAt(option, cell.index);
    yield puzzle.toSpliced(cell.index, 1, option);
  }
}

const solve = (
  puzzle: Array<number>,
  count: number,
): Array<number> | undefined => {
  if (!count) {
    return puzzle;
  }

  const candidateGenerator = createCandidateGenerator(puzzle);

  let candidate = candidateGenerator.next();

  while (candidate.value) {
    const solution = solve(candidate.value, count - 1);

    if (solution) {
      return solution;
    } else {
      rows = getDefaultOptions();
      cols = getDefaultOptions();
      boxes = getDefaultOptions();

      for (let i = 0; i < puzzle.length; i++) {
        const digit = puzzle[i];
        if (digit) {
          digitPlacedAt(digit, i);
        }
      }
    }

    candidate = candidateGenerator.next();
  }
};

export const solveSudoku = (puzzle: number[]): number[] | undefined => {
  let count = 0;
  rows = getDefaultOptions();
  cols = getDefaultOptions();
  boxes = getDefaultOptions();

  for (let i = 0; i < puzzle.length; i++) {
    const digit = puzzle[i];
    if (digit) {
      digitPlacedAt(digit, i);
    } else {
      count++;
    }
  }

  return solve(puzzle, count);
};
