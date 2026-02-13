import { View, Text } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'

export default function Detail() {
  const router = useRouter()
  const { id } = router.params

  return (
    <View className="detail">
      <Text>detail page</Text>
      <View>Current ID: {id}</View>
    </View>
  )
}
