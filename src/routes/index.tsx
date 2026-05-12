import { createFileRoute } from '@tanstack/react-router';
import { Sudoku } from '#/components/Sudoku';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  // TODO timer, difficulty levels
  return <Sudoku />;
}
