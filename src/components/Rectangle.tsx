import { Box, Flex } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import type { ReactNode } from 'react';

export const Rectangle = ({ children }: { children: ReactNode }) => {
  const { ref, width, height } = useElementSize();

  const wider = width > height;

  return (
    <Flex
      ref={ref}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }}
      justify={'center'}
    >
      <Box w={wider ? height : width} h={wider ? height : width}>
        {children}
      </Box>
    </Flex>
  );
};
