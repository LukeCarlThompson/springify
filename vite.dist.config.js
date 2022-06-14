const path = require('path');
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    build: {
      outDir: 'dist',
      lib: {
        entry: path.resolve(__dirname, 'src/scripts/Springify.ts'),
        name: 'Springify',
        fileName: (format) => `Springify.${format}.js`,
      },
    },
  };
});
