export const getIndices = (index: number) => {
  const rowIndex = Math.floor(index / 9);
  const colIndex = index % 9;
  const boxIndex = Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3);

  return { rowIndex, colIndex, boxIndex };
};
