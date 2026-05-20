import { useLocalStorage } from '@uidotdev/usehooks';

export const useDifficulty = () =>
  useLocalStorage<'Easy' | 'Medium' | 'Hard' | 'Diabolical'>(
    'difficulty',
    'Easy',
  );
