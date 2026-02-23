import { View, Text } from '@tarojs/components'
import './NoData.less'

interface NoDataProps {
  message?: string
  subMessage?: string
}

export default function NoData({
  message = '暂无符合条件的酒店',
  subMessage = '请尝试调整筛选条件',
}: NoDataProps) {
  return (
    <View className="no-data" style={{ zIndex: 0 }}>
      <Text>{message}</Text>
      <Text style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
        {subMessage}
      </Text>
    </View>
  )
}
