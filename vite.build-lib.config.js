import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import eslint from 'vite-plugin-eslint';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [
    eslint(),
    dts({
      tsconfigPath: './tsconfig.build.json',
      exclude: ['./src/implementation'],
    }),
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'umd'],
      name: 'springify',
      fileName: '[name]',
    },
    rollupOptions: {
      output: {
        preserveModules: false,
        inlineDynamicImports: false,
      },
      treeshake: 'smallest',
    },
  },
});
