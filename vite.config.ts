import { defineConfig, createLogger } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import basicSsl from '@vitejs/plugin-basic-ssl';

const isProd = ['prod', 'production'].includes(process.env.NODE_ENV);

const logger = createLogger();
const originalWarning = logger.warn;
logger.warn = (msg, options) => {
  if (msg.includes('Default and named imports from CSS files are deprecated. ')) return;
  originalWarning(msg, options);
};

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    drop: isProd ? ['debugger', 'console'] : []
  },
  customLogger: logger,
  define: {
    'process.env': {},
    'Buffer.from': {},
    global: 'window'
  },
  plugins: [react(), tsconfigPaths(), basicSsl()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://pokeapi.co',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api')
      }
    }
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer]
    }
  }
});
