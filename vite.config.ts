import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    // PHP serves public/ as the document root. Vite only compiles the module
    // graph into public/build and must not copy the whole public directory.
    publicDir: false,
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    build: {
        outDir: 'public/build',
        emptyOutDir: true,
        manifest: true,
        sourcemap: false,
        target: 'es2022',
        assetsDir: 'assets',
        rollupOptions: {
            input: fileURLToPath(new URL('./src/main.tsx', import.meta.url)),
        },
    },
    server: {
        host: '127.0.0.1',
        port: 5173,
        strictPort: true,
    },
});
