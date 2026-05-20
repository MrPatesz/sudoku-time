import { createFileRoute } from '@tanstack/react-router';
import { Sudoku } from '#/components/Sudoku';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  // TODO timer+pause?, difficulty levels, share puzzle (?puzzle=020460107000...), icons
  return <Sudoku />;
}
