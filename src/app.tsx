import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './app.less'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
  })

  // children 是将要会渲染的页面
  return <View>{children}</View>
}

export default App
