import { View } from '@tarojs/components'
import { LeftOutline, HeartOutline, PhonebookOutline, ShopbagOutline, MoreOutline } from 'antd-mobile-icons'

interface HotelDetailHeaderProps {
  onBack: () => void
}

export default function HotelDetailHeader({ onBack }: HotelDetailHeaderProps) {
  return (
    <View className="top-nav-bar">
      <View className="nav-left">
        <View className="back-btn" onClick={onBack}>
          <LeftOutline color="#fff" />
        </View>
      </View>
      <View className="nav-right">
        <View className="nav-icon">
          <HeartOutline color="#fff" />
        </View>
        <View className="nav-icon">
          <PhonebookOutline color="#fff" />
        </View>
        <View className="nav-icon">
          <ShopbagOutline color="#fff" />
        </View>
        <View className="nav-icon">
          <MoreOutline color="#fff" />
        </View>
      </View>
    </View>
  )
}
