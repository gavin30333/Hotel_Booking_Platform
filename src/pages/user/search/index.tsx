import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.less'

export default function Search() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='search'>
      <Text>搜索页</Text>
    </View>
  )
}
