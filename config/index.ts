import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import path from 'path'

import devConfig from './dev'
import prodConfig from './prod'

export default defineConfig<'vite'>(async (merge) => {
  const baseConfig: UserConfigExport<'vite'> = {
    projectName: 'Hotel_Booking_Platform',
    date: '2026-2-1',
    designWidth: 375,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2 / 1,
      828: 1.81 / 2,
    },
    alias: {
      '@': path.resolve(__dirname, '..', 'src'),
    },
    sourceRoot: 'src',
    outputRoot: `dist/${process.env.TARO_ENV}`,
    plugins: [
      '@tarojs/plugin-generator',
      '@tarojs/plugin-platform-h5',
      '@tarojs/plugin-framework-react',
    ],
    defineConstants: {},
    copy: {
      patterns: [],
      options: {},
    },
    framework: 'react',
    compiler: 'vite',
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css',
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
      devServer: {
        open: true,
        historyApiFallback: true,
      },
      router: {
        mode: 'hash',
        customRoutes: {
          '/pages/search/index': '/search',
          '/pages/list/index': '/list',
          '/pages/detail/index': '/detail',
          '/pages/map/index': '/map',
          '/pages/favorite/index': '/favorite',
          '/pages/profile/index': '/profile',
          '/pages/order/index': '/order',
        },
      },
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: false,
        },
      },
    },
  }

  if (process.env.NODE_ENV === 'development') {
    return merge({}, baseConfig, devConfig)
  }
  return merge({}, baseConfig, prodConfig)
})
