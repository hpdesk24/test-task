import { PlaywrightTestConfig } from '@playwright/test';
import path from 'path';

const config: PlaywrightTestConfig = {
    workers: 2,
    globalSetup: require.resolve(__dirname + '/global-setup.ts'),
    use: {
        baseURL: 'https://qa-challenge-tabeo.vercel.app',
        storageState: path.join(__dirname, '/state.json'),
        screenshot: 'only-on-failure'
    }
};
export default config;