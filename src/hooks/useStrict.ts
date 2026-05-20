import { useLocalStorage } from '@uidotdev/usehooks';

export const useStrict = () => useLocalStorage('strict-mode', false);
