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
  // 模拟收藏的酒店数据
  const [favorites, setFavorites] = useState<FavoriteHotel[]>([
    {
      id: '1',
      name: '上海浦东丽呈酒店(国际旅游度假区店)',
      address: '上海·迪士尼·近川沙老街',
      minPrice: 274,
      rating: 4.7,
      reviewCount: 2860,
      starRating: 4,
      images: ['https://picsum.photos/400/300?random=1'],
      tags: ['免费升房', '亲子主题房', '免费停车', '洗衣房'],
      city: '上海',
    },
  ])

  // 城市筛选状态
  const [activeCity, setActiveCity] = useState('all')
  const cities = ['上海'] // 从收藏数据中提取城市列表

  const handleCityChange = (city: string) => {
    setActiveCity(city)
    // 这里可以添加根据城市筛选收藏酒店的逻辑
  }

  return (
    <>
      <View className="favorite-page">
        {/* 顶部导航 */}
        <TopNavBar title="我的收藏" />

        {/* 日期选择区域 */}
        <View className="date-selection">
          <Text className="date-item">02月24日 周二入住</Text>
          <Text className="date-item night-count">2晚</Text>
          <Text className="date-item">02月26日 周四离店</Text>
        </View>

        {/* 城市筛选标签 */}
        <CityFilter
          cities={cities}
          activeCity={activeCity}
          onCityChange={handleCityChange}
        />

        {/* 酒店列表 */}
        {favorites.length === 0 ? (
          <View className="no-favorites">
            <Text>暂无收藏的酒店</Text>
          </View>
        ) : (
          <View className="favorite-list">
            {favorites.map((hotel) => (
              <View key={hotel.id} className="favorite-item">
                <HotelCard hotel={hotel} />
              </View>
            ))}
          </View>
        )}

        {/* 无更多结果 */}
        <View className="no-more-results">
          <Text>无更多结果</Text>
        </View>
      </View>

      {/* 底部导航栏区域 */}
      <BottomTabBar activeKey="favorite" />
    </>
  )
}
