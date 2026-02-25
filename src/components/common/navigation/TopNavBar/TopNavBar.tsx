import { View, Text } from '@tarojs/components'
import { LeftOutline } from 'antd-mobile-icons'
import Taro from '@tarojs/taro'
import './TopNavBar.less'

interface TopNavBarProps {
  title: string
  onBack?: () => void
  showBack?: boolean
}

export default function TopNavBar({
  title,
  onBack,
  showBack = true,
}: TopNavBarProps) {
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      Taro.switchTab({ url: '/search' })
    }
  }

  return (
    <View className="top-nav-bar">
      {showBack && (
        <View className="back-btn" onClick={handleBack}>
          <LeftOutline />
        </View>
      )}
      <View className="header-title">
        <Text style={{ fontSize: '18px', fontWeight: 500, color: '#333333' }}>
          {title}
        </Text>
      </View>
    </View>
  )
}
