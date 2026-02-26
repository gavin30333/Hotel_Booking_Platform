import { View, Text } from '@tarojs/components'
import { Button, Toast } from 'antd-mobile'
import {
  LeftOutline,
  HeartOutline,
  HeartFill,
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
  showOnlyFavorite?: boolean
}

export default function HotelDetailHeader({
  onBack,
  hotelName,
  showOnlyFavorite = false,
}: HotelDetailHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  usePageScroll((res) => {
    if (res && res.scrollTop > 100) {
      setIsScrolled(true)
    } else {
      setIsScrolled(false)
    }
  })

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    Toast.show({
      content: isFavorite ? '取消收藏成功' : '收藏成功',
      duration: 1000,
    })
  }

  return (
    <View className={`hotel-detail-header ${isScrolled ? 'scrolled' : ''}`}>
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
        <Button className="nav-icon" fill="none" onClick={handleFavorite}>
          {isFavorite ? (
            <HeartFill color={isScrolled ? '#ff4d4f' : '#ff4d4f'} />
          ) : (
            <HeartOutline color={isScrolled ? '#000' : '#fff'} />
          )}
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
