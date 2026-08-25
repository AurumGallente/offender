import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            strategies: 'injectManifest',
            srcDir: 'src',
            filename: 'sw.js',
            injectRegister: 'auto',
            registerType: 'autoUpdate',
            devOptions: {
                enabled: false
            },
            manifest: {
                name: 'Книга обид',
                short_name: 'Обиды',
                description: 'Приложение для записи обид на мужчин',
                theme_color: '#ff6b6b',
                background_color: '#ffffff',
                display: 'standalone',
                scope: '/',
                id: '/',
                start_url: '/',
                icons: [
                    {
                        src: '/icons/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: '/icons/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: 'icons/maskable-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'maskable'
                    },
                    {
                        src: '/icons/maskable-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable'
                    }
                ],
                screenshots: [
                    {
                        src: '/screenshots/desktop.jpg',
                        sizes: '1319x823',
                        type: 'image/jpeg',
                        form_factor: 'wide'
                    },
                    {
                        src: '/screenshots/mobile.jpg',
                        sizes: '378x668',
                        type: 'image/jpeg',
                        form_factor: 'narrow'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,webmanifest,json}'],
                skipWaiting: true,
                clientsClaim: true,
                navigateFallback: 'index.html'
            }
        })
    ],
    server: {
        hmr: false,
        host: true,
        port: 5173
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true
    }
});