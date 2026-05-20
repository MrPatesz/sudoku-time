// source of puzzles: https://github.com/grantm/sudoku-exchange-puzzle-bank

type Puzzles = Array<{ puzzle: string; solution: string; difficulty: number }>;

declare module '#/data/easy.json' {
  const puzzles: Puzzles;
  export default puzzles;
}

declare module '#/data/medium.json' {
  const puzzles: Puzzles;
  export default puzzles;
}

declare module '#/data/hard.json' {
  const puzzles: Puzzles;
  export default puzzles;
}

declare module '#/data/diabolical.json' {
  const puzzles: Puzzles;
  export default puzzles;
}
