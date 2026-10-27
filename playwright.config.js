import {defineConfig} from '@playwright/test';
export default defineConfig({
 testDir:'./tests',testMatch:'*.spec.js',workers:1,timeout:45000,
 use:{baseURL:process.env.TABI_TEST_BASE_URL||'http://127.0.0.1:5173',headless:true,
  launchOptions:{...(process.env.TABI_CHROMIUM_PATH?{executablePath:process.env.TABI_CHROMIUM_PATH}:{}),args:['--no-sandbox']}
 },
 webServer:process.env.TABI_TEST_BASE_URL?undefined:{command:'npm run dev -- --port 5173',url:'http://127.0.0.1:5173',reuseExistingServer:true},
 reporter:'list'
});
