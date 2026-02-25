import { View, Text, Image } from '@tarojs/components'
import { SpinLoading } from 'antd-mobile'
import Taro from '@tarojs/taro'
import { useQueryStore } from '@/store/useQueryStore'
import './HotelRanking.less'

interface Hotel {
  hotelId: string
  name: string
  desc: string
  score?: string
  imageUrl?: string
}

interface HotelRankingProps {
  luxuryHotels: Hotel[]
  familyHotels: Hotel[]
  loading?: boolean
}

export default function HotelRanking({
  luxuryHotels,
  familyHotels,
  loading,
}: HotelRankingProps) {
  const getSearchParams = useQueryStore((state) => state.getSearchParams)

  const handleHotelClick = (hotel: Hotel) => {
    const params = getSearchParams()
    Taro.navigateTo({
      url: `/pages/detail/index?id=${hotel.hotelId}&checkInDate=${encodeURIComponent(params.checkInDate)}&checkOutDate=${encodeURIComponent(params.checkOutDate)}&roomCount=${params.rooms}&adultCount=${params.adults}&childCount=${params.children}`,
    })
  }

  if (loading) {
    return (
      <View className="hotel-ranking-section">
        <View className="loading-container">
          <SpinLoading color="primary" />
          <Text className="loading-text">加载中...</Text>
        </View>
      </View>
    )
  }

  if (luxuryHotels.length === 0 && familyHotels.length === 0) {
    return (
      <View className="hotel-ranking-section">
        <View className="no-data">
          <Text>暂无榜单数据</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="hotel-ranking-section">
      <View className="ranking-lists-scroll">
        {luxuryHotels.length > 0 && (
          <View className="ranking-list-wrapper">
            <View className="ranking-list-card">
              <View className="ranking-header-card">
                <Text className="ranking-title-card">🏆 奢华酒店榜</Text>
                <Text className="ranking-more">更多酒店 {'>'}</Text>
              </View>
              <View className="ranking-items">
                {luxuryHotels.map((hotel, index) => (
                  <View
                    key={hotel.hotelId || index}
                    className="ranking-item"
                    onClick={() => handleHotelClick(hotel)}
                  >
                    <View className="item-image-box">
                      <Image
                        src={
                          hotel.imageUrl ||
                          `https://picsum.photos/100/100?random=${index}`
                        }
                        className="item-image"
                        mode="aspectFill"
                      />
                      <View className={`rank-badge rank-${index + 1}`}>
                        {index + 1}
                      </View>
                    </View>
                    <View className="item-info">
                      <Text className="item-name">{hotel.name}</Text>
                      <View className="item-meta">
                        <Text className="item-score">
                          {hotel.score || `4.${8 - index}分`}
                        </Text>
                        <Text className="item-desc">{hotel.desc}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {familyHotels.length > 0 && (
          <View className="ranking-list-wrapper">
            <View className="ranking-list-card">
              <View className="ranking-header-card">
                <Text className="ranking-title-card">🏆 亲子酒店榜</Text>
                <Text className="ranking-more">更多酒店 {'>'}</Text>
              </View>
              <View className="ranking-items">
                {familyHotels.map((hotel, index) => (
                  <View
                    key={hotel.hotelId || index}
                    className="ranking-item"
                    onClick={() => handleHotelClick(hotel)}
                  >
                    <View className="item-image-box">
                      <Image
                        src={
                          hotel.imageUrl ||
                          `https://picsum.photos/100/100?random=${index + 10}`
                        }
                        className="item-image"
                        mode="aspectFill"
                      />
                      <View className={`rank-badge rank-${index + 1}`}>
                        {index + 1}
                      </View>
                    </View>
                    <View className="item-info">
                      <Text className="item-name">{hotel.name}</Text>
                      <View className="item-meta">
                        <Text className="item-score">
                          {hotel.score || `4.${7 - index}分`}
                        </Text>
                        <Text className="item-desc">{hotel.desc}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}
