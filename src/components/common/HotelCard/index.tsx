import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './HotelCard.less'
import { Hotel } from '../../../services/hotel'
import { useHotelStore } from '../../../store/hotelStore'

interface HotelCardProps {
  hotel: Hotel
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const { filters } = useHotelStore()

  const handleCardClick = () => {
    const params = new URLSearchParams()
    params.append('id', hotel.id)
    if (filters.checkInDate) {
      params.append('checkInDate', filters.checkInDate)
    }
    if (filters.checkOutDate) {
      params.append('checkOutDate', filters.checkOutDate)
    }
    params.append('roomCount', String(filters.rooms || 1))
    params.append('adultCount', String(filters.adults || 2))
    params.append('childCount', String(filters.children || 0))

    Taro.navigateTo({
      url: `/detail?${params.toString()}`,
    })
  }

  return (
    <View className="hotel-card" onClick={handleCardClick}>
      <View className="hotel-image">
        <Image
          src={hotel.imageUrl}
          mode="aspectFill"
          style={{ width: '100%', height: '100%' }}
        />
      </View>

      <View className="hotel-info">
        <Text className="hotel-name">{hotel.name}</Text>

        <View className="hotel-rating">
          <Text className="rating">{hotel.rating}</Text>
          <Text className="rating-label">超棒</Text>
          <Text className="review-count">{hotel.reviewCount}点评</Text>
          <Text className="favorite-count">
            · {Math.floor(hotel.reviewCount * 10)}收藏
          </Text>
        </View>

        <Text className="hotel-location">
          近{hotel.address.split('市')[1]?.split('区')[1] || hotel.address}
        </Text>

        <Text className="hotel-feature">{hotel.description}</Text>

        <View className="hotel-tags">
          {hotel.tags.map((tag, tagIndex) => (
            <View key={tagIndex} className="tag">
              <Text>{tag}</Text>
            </View>
          ))}
        </View>

        <View className="hotel-price">
          <Text className="price-label">4小时</Text>
          <View className="price-info">
            <Text className="price">¥{hotel.minPrice}</Text>
            <Text className="price-unit">起</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
