import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  // Whether to use css reset
  preflight: true,
  include: [
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/pages/**/*.{ts,tsx}',
  ],
  exclude: [],
  theme: {
    extend: {},
  },
  outdir: 'src/styles',
});
