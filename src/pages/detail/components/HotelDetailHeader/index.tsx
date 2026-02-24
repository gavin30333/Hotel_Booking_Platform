import { View, Text } from '@tarojs/components'
import { Button } from 'antd-mobile'
import {
  LeftOutline,
  HeartOutline,
  PhonebookOutline,
  ShopbagOutline,
  MoreOutline,
} from 'antd-mobile-icons'
import { useState } from 'react'
import { usePageScroll } from '@tarojs/taro'
import './HotelDetailHeader.less'

interface HotelDetailHeaderProps {
  onBack: () => void
  hotelName: string
}

export default function HotelDetailHeader({
  onBack,
  hotelName,
}: HotelDetailHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  usePageScroll((res) => {
    if (res && res.scrollTop > 100) {
      setIsScrolled(true)
    } else {
      setIsScrolled(false)
    }
  })
  return (
    <View className={`top-nav-bar ${isScrolled ? 'scrolled' : ''}`}>
      <View className="nav-left">
        <Button className="back-btn" onClick={onBack} fill="none">
          <LeftOutline color={isScrolled ? '#000' : '#fff'} />
        </Button>
      </View>
      {isScrolled && (
        <View className="nav-center">
          <Text className="hotel-name">{hotelName}</Text>
        </View>
      )}
      <View className="nav-right">
        <Button className="nav-icon" fill="none">
          <HeartOutline color={isScrolled ? '#000' : '#fff'} />
        </Button>
        <Button className="nav-icon" fill="none">
          <PhonebookOutline color={isScrolled ? '#000' : '#fff'} />
        </Button>
        <Button className="nav-icon" fill="none">
          <ShopbagOutline color={isScrolled ? '#000' : '#fff'} />
        </Button>
        <Button className="nav-icon" fill="none">
          <MoreOutline color={isScrolled ? '#000' : '#fff'} />
        </Button>
      </View>
    </View>
  )
}
