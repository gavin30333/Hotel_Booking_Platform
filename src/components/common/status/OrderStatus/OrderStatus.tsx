import { View, Text } from '@tarojs/components'
import './OrderStatus.less'

interface OrderStatusProps {
  status: string
}

export default function OrderStatus({ status }: OrderStatusProps) {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '已确认'
      case 'completed':
        return '已完成'
      case 'cancelled':
        return '已取消'
      case 'pending':
        return '待确认'
      default:
        return '未知状态'
    }
  }

  return (
    <View className={`order-status ${status}`}>
      <Text className="status-text">{getStatusText(status)}</Text>
    </View>
  )
}
