import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'lottie',
            fileName: 'index',
            formats: ['es'],
        },
        rollupOptions: {
            output: {
                exports: 'named',
            },
        },
        minify: true,
        sourcemap: true,
        emptyOutDir: true,
    },
    plugins: [dts()],
})