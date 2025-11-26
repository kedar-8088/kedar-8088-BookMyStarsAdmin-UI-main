import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import path from 'path';

// ----------------------------------------------------------------------

export default defineConfig({
  plugins: [react(), jsconfigPaths()],
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src'),
      'components': path.resolve(__dirname, './src/components'),
      'views': path.resolve(__dirname, './src/views'),
      'assets': path.resolve(__dirname, './src/assets'),
      'utils': path.resolve(__dirname, './src/utils'),
      'ui-component': path.resolve(__dirname, './src/ui-component'),
      'store': path.resolve(__dirname, './src/store'),
      'layout': path.resolve(__dirname, './src/layout'),
    },
  },
  // https://github.com/jpuri/react-draft-wysiwyg/issues/1317
  base: '/',
  define: {
    global: 'window'
  },

  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  preview: {
    // this ensures that the browser opens upon preview start
    open: true,
    // this sets a default port to 3000
    port: 3000
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@mui/system', '@mui/utils'],
          vendor: ['axios', 'lodash'],
        }
      },
      external: [],
      maxParallelFileOps: 1,
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    chunkSizeWarningLimit: 1000,
  },
  esbuild: {
    // Ignore source map errors
    sourcemap: false
  }
});


//------------large chunks


