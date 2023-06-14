'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {},
};

export const theme = extendTheme({
  colors,
  config: { initialColorMode: 'dark', useSystemColorMode: false },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
}
