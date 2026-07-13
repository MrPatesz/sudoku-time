import { createFileRoute } from '@tanstack/react-router';
import { Sudoku } from '#/components/Sudoku';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  // TODO share puzzle button (?puzzle=020460107000...) + Google Analytics
  return <Sudoku />;
}
