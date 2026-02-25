import { View, Text } from '@tarojs/components'
import { useState } from 'react'
import Taro, { showToast } from '@tarojs/taro'
import HotelCard from '@/components/common/display/HotelCard'
import BottomTabBar from '@/components/common/navigation/BottomTabBar/BottomTabBar'
import TopNavBar from '@/components/common/navigation/TopNavBar/TopNavBar'
import CityFilter from '@/components/common/filters/CityFilter/CityFilter'
import { Hotel } from '@/services/hotel'
import './index.less'

interface FavoriteHotel extends Hotel {
  id: string
  name: string
  address: string
  minPrice: number
  rating: number
  reviewCount: number
  starRating: number
  images: string[]
  tags: string[]
}

export default function FavoritePage() {
  console.log('Favorite page loaded')
  const [favorites, setFavorites] = useState<FavoriteHotel[]>([
    {
      id: '1',
      name: '上海外滩华尔道夫酒店',
      address: '上海市黄浦区中山东一路2号',
      minPrice: 1280,
      rating: 4.8,
      reviewCount: 1256,
      starRating: 5,
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      ],
      tags: ['奢华酒店', '商务出行', '近地铁', '江景房'],
      city: '上海',
    },
  ])

  const [activeCity, setActiveCity] = useState('all')
  const cities = ['上海']

  const handleCityChange = (city: string) => {
    setActiveCity(city)
  }

  const handleHotelClick = (hotelId: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${hotelId}`,
    })
  }

  return (
    <>
      <View className="favorite-page">
        <TopNavBar title="我的收藏" showBack={false} />

        <View className="date-selection">
          <View className="date-row">
            <Text className="date-item">02月24日 周二</Text>
            <Text className="date-separator">-</Text>
            <Text className="date-item">02月26日 周四</Text>
          </View>
          <Text className="night-count">共2晚</Text>
        </View>

        <CityFilter
          cities={cities}
          activeCity={activeCity}
          onCityChange={handleCityChange}
        />

        {favorites.length === 0 ? (
          <View className="no-favorites">
            <Text>暂无收藏的酒店</Text>
          </View>
        ) : (
          <View className="favorite-list">
            {favorites.map((hotel) => (
              <View
                key={hotel.id}
                className="favorite-item"
                onClick={() => handleHotelClick(hotel.id)}
              >
                <HotelCard hotel={hotel} />
              </View>
            ))}
          </View>
        )}

        <View className="no-more-results">
          <Text>无更多结果</Text>
        </View>
      </View>

      <BottomTabBar activeKey="favorite" />
    </>
  )
}
