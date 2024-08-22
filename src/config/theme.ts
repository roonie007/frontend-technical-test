import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: {
      'html, body, #root': {
        height: 'full',
        margin: 0,
        padding: 0,
        width: 'full',
      },
    },
  },
});
