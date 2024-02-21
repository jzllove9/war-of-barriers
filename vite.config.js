import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        AutoImport({
            dts: 'src/types/auto-imports.d.ts',
            imports: [
                'vue',
                'pinia',
                'vue-router',
                {
                    from: 'vue-router',
                    imports: ['Router', 'RouteRecordName', 'RouteRecordRaw', 'RouteLocationNormalized'],
                    type: true,
                },
            ],
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
