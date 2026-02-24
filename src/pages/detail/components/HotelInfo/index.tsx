import { View, Text } from '@tarojs/components'
import { Tag } from 'antd-mobile'
import './HotelInfo.less'

interface HotelInfoProps {
  name: string
  starRating: number
  openingDate: string
  rating: number
  reviewCount: number
}

export default function HotelInfo({
  name,
  starRating,
  openingDate,
}: HotelInfoProps) {
  return (
    <View className="hotel-header-info">
      <View>
        <Text className="hotel-name">{name}</Text>
        <Tag className="hotel-badge" color="default">
          <Text className="hotel-badge-text">{starRating || 5}星级酒店</Text>
        </Tag>
        <Tag className="hotel-badge" color="default">
          <Text className="hotel-badge-text">
            {openingDate ? openingDate.split('-')[0] : '2024'}年开业
          </Text>
        </Tag>
      </View>
    </View>
  )
}
