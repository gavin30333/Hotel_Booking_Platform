import { PropsWithChildren } from 'react'
import { useLaunch, useError, usePageNotFound } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { navigateTo404, checkRouteAuth, navigateToLogin } from '@/utils/routeGuard'
import { handleError } from '@/utils/errorHandler'

import './app.less'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
    
    console.log = (() => {
      const originalLog = console.log
      return (...args: any[]) => {
        if (process.env.NODE_ENV === 'development') {
          originalLog.apply(console, args)
        }
      }
    })()
  })

  useError((error) => {
    console.error('[Global Error]', error)
    handleError(error, { showToast: true, navigate: false })
  })

  usePageNotFound((res) => {
    console.warn('[Page Not Found]', res.path)
    navigateTo404()
  })

  return <View>{children}</View>
}

export default App
