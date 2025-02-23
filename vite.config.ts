import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dynamicImport from 'vite-plugin-dynamic-import';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  // 根据部署环境配置 base
  base: process.env.NODE_ENV === 'production' ? './' : '/', // 使用相对路径，更灵活地支持各种部署场景

  build: {
    outDir: 'dist',
    // 生产环境优化配置
    minify: 'terser', // 使用 terser 进行更好的代码压缩
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console
        drop_debugger: true // 移除 debugger
      }
    },
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        // 优化分包策略
        manualChunks: {
          'vue-vendor': ['vue'],
          'monaco': ['monaco-editor'],
        },
        // 自定义 chunk 文件名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    // 源码映射，便于调试
    sourcemap: true,
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 设置资源大小警告阈值
    chunkSizeWarningLimit: 1000
  },

  resolve: {
    dedupe: ['vue'],
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
    ],
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.scss']
  },

  optimizeDeps: {
    include: ['monaco-editor']
  },

  plugins: [
    vue(),
    dynamicImport(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html' // 将分析报告输出到 dist 目录
    })
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
