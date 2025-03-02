import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills({
      include: ['crypto'] ,
      globals:{
        Buffer: true,
        global: true,
      }
    }),
    wasm(),
    topLevelAwait(),
    react()
  ],
  optimizeDeps: {
    esbuildOptions: {
        external: ['*.ttf'],
    },
    rollupOptions: {
      // Exclude files with the *.cy.tsx extension from being processed by Vite
      external: [
        "*.ttf",
        "*/vite-plugin-node-polyfills/*"
      ],
    }
  },
  exclude: ['*.ttf'],
  server: {
    port: 3333,
    cors: true,
    // proxy: {
    //   '/api': {
    //     target: 'http://127.0.0.1:8080',
    //     changeOrigin: true,
    //     secure: false,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //   },
    // },
  },
})

