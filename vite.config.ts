import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
    build: {
        outDir: 'Resources/Public/JavaScript',
        emptyOutDir: false,
        copyPublicDir: false,
        sourcemap: true,
        minify: true,
        rollupOptions: {
            preserveEntrySignatures: 'exports-only',
            input: {
                'no-translate': fileURLToPath(new URL('src/no-translate.ts', import.meta.url)),
            },
            external: [/^@ckeditor\/.*/, /^@typo3\/.*/],
            output: {
                entryFileNames: '[name].js',
            },
        },
    },
});
