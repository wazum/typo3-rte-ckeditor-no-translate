import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: '.',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    reporter: 'list',

    use: {
        baseURL: process.env.TYPO3_BASE_URL || 'http://127.0.0.1:8080',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        ignoreHTTPSErrors: true,
    },

    projects: [
        {
            name: 'setup',
            testMatch: 'fixtures/auth.setup.ts',
        },
        {
            name: 'chromium',
            testDir: './tests',
            use: {
                ...devices['Desktop Chrome'],
                storageState: '.auth/user.json',
            },
            dependencies: ['setup'],
        },
    ],

    outputDir: 'test-results/',
});
