import { defineConfig } from 'vite';
import { viteJs13k, viteJs13kPre } from './plugins/vite-js13k'
import kontra from 'rollup-plugin-kontra';

export default defineConfig({
  server: {
    port: 3000
  },
  plugins: [
    kontra({
      gameObject: {
        group: true,
        ttl: true, // TODO: Figure out exactly what this is needed for
        velocity: true,
      },
      vector: {
        angle: true,
        distance: true,
        normalize: true,
        scale: true,
        subtract: true,
      },
    }),
    viteJs13kPre(),
    viteJs13k(),
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      toplevel: true,
      compress: {
        passes: 2,
        unsafe: true,
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_math: true,
      },
      mangle: { properties: { keep_quoted: false }},
      module: true,
    },
    assetsInlineLimit: 0,
    modulePreload: {
      polyfill: false,
    },
    reportCompressedSize: false,
  },
});
