import { useLocalStorage } from '@uidotdev/usehooks';
import { createContext, type ReactNode, useContext, useMemo } from 'react';
import type { PrimaryColor } from '#/utils/primaryColors';

const primaryColorContext = createContext<{
  primaryColor: PrimaryColor;
  setPrimaryColor: (color: PrimaryColor) => void;
} | null>(null);

export const PrimaryColorProvider = ({ children }: { children: ReactNode }) => {
  const [primaryColor, setPrimaryColor] = useLocalStorage<PrimaryColor>(
    'primary-color',
    'blue',
  );

  const value = useMemo(
    () => ({ primaryColor, setPrimaryColor }),
    [primaryColor, setPrimaryColor],
  );

  return (
    <primaryColorContext.Provider value={value}>
      {children}
    </primaryColorContext.Provider>
  );
};

export const usePrimaryColor = () => {
  const context = useContext(primaryColorContext);

  if (!context) {
    throw new Error(
      'usePrimaryColor must be used within PrimaryColorProvider!',
    );
  }

  return context;
};
