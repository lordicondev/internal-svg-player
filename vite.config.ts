import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: 'demo/index.html',
        },
    },
    server: {
        host: '0.0.0.0',
        port: 3000,
    },
    root: 'demo',
    define: {
        __SUPPORT_DARK__: true
    },
});