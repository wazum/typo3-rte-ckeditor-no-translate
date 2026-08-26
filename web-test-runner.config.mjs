import { playwrightLauncher } from '@web/test-runner-playwright';
import { esbuildPlugin } from '@web/dev-server-esbuild';

const CKEDITOR_BUNDLE = '/node_modules/ckeditor5/dist/browser/ckeditor5.js';

function importsPlugin() {
    return {
        name: 'imports',
        resolveImport({ source }) {
            if (source.startsWith('@ckeditor/ckeditor5-')) {
                return CKEDITOR_BUNDLE;
            }
            if (source.startsWith('#src/')) {
                return source.replace('#src/', '/src/').replace(/\.js$/, '.ts');
            }
        },
    };
}

export default {
    files: 'tests/**/*.test.ts',
    nodeResolve: true,
    plugins: [
        importsPlugin(),
        esbuildPlugin({
            ts: true,
            tsconfig: './tsconfig.json',
        }),
    ],
    browsers: [
        playwrightLauncher({ product: 'chromium' }),
    ],
    testFramework: {
        config: {
            timeout: 5000,
        },
    },
    coverageConfig: {
        include: ['src/**/*.ts'],
        exclude: ['tests/**/*.ts'],
    },
};
