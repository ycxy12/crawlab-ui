import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dynamicImport from 'vite-plugin-dynamic-import';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  base: '/',  // 如果是子路径部署，修改为 '/my-app/'
  build: {
    outDir: 'dist',  // 设置输出目录
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),  // 入口文件
    }
  },
  resolve: {
    dedupe: ['vue'],
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
    ],
    extensions: [
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.json',
      '.vue',
      '.scss',
    ]
  },
  optimizeDeps: {
    include: ['monaco-editor']
  },
  plugins: [
    vue(),
    dynamicImport(),
    visualizer({ open: true }),
  ],
  server: {
    host: '0.0.0.0',
    cors: true,
    proxy: {
      '/qb-crawlab': {
        target: 'http://159.138.85.235:8990',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/qb-crawlab/, ''),
      },
    },
  },
});
