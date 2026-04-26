import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue2'
import vueJsx from '@vitejs/plugin-vue2-jsx'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'node:path'

const resolve = (p) => path.resolve(__dirname, p)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  const apiTarget = env.VITE_APP_BASE_API || 'http://localhost:8000'

  return {
    base: '/',
    resolve: {
      alias: {
        '@': resolve('src'),
        '@crud': resolve('src/components/Crud')
      },
      extensions: ['.js', '.jsx', '.json', '.vue']
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          loadPaths: ['node_modules'],
          silenceDeprecations: ['import', 'global-builtin', 'slash-div', 'function-units', 'color-functions', 'legacy-js-api']
        }
      }
    },
    plugins: [
      vue(),
      vueJsx(),
      createSvgIconsPlugin({
        iconDirs: [resolve('src/assets/icons/svg')],
        symbolId: 'icon-[name]'
      })
    ],
    server: {
      port: 8013,
      open: true,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true
        },
        '/auth': {
          target: apiTarget,
          changeOrigin: true
        },
        '/avatar': {
          target: apiTarget,
          changeOrigin: true
        },
        '/file': {
          target: apiTarget,
          changeOrigin: true
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: false,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks: {
            'element-ui': ['element-ui'],
            echarts: ['echarts', 'vue-echarts']
          }
        }
      }
    },
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    }
  }
})
