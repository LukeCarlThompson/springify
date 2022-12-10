const { resolve } = require('path');
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'build') {
    return {
      build: {
        outDir: 'dist',
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'springify',
          fileName: 'springify',
        },
      },
      plugins: [
        dts({
          insertTypesEntry: true,
          skipDiagnostics: false,
        }),
      ],
    };
  }
  return {};
});
