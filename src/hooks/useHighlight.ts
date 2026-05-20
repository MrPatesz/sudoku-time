import { useLocalStorage } from '@uidotdev/usehooks';

export const useHighlight = () => useLocalStorage('highlight', true);
