import { useLocalStorage } from '@uidotdev/usehooks';
import type { PrimaryColor } from '#/utils/primaryColors';

export const usePrimaryColor = () =>
  useLocalStorage<PrimaryColor>('primary-color', 'blue');
