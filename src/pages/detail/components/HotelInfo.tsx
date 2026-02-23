import { View, Text } from '@tarojs/components'

interface HotelInfoProps {
  name: string
  starRating: number
  address: string
  rating: number
  reviewCount: number
}

export default function HotelInfo({
  name,
  starRating,
  address,
  rating,
  reviewCount,
}: HotelInfoProps) {
  return (
    <View className="hotel-header-info">
      <View>
        <Text className="hotel-name">{name}</Text>
        <Text className="hotel-badge">{starRating || 5}星级酒店</Text>
        <Text className="hotel-ranking">{address}</Text>
      </View>
      <View className="hotel-rating">
        <Text className="rating">{rating}</Text>
        <Text className="rating-label">很好</Text>
        <Text className="review-count">{reviewCount}条点评</Text>
      </View>
    </View>
  )
}
