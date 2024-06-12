import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), mode === 'singleFile' && viteSingleFile()].filter(
      Boolean
    ), // add viteSingleFile() if the mode is singleFile
    base: mode === 'production' ? 'https://file-wallet.com/' : '/',
    build: {
      minify: false, // Disable minification in production build for easier code review
    },
  };
});
