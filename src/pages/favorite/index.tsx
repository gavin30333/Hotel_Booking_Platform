import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro, { showToast } from '@tarojs/taro'
import HotelCard from '@/components/common/display/HotelCard'
import BottomTabBar from '@/components/common/navigation/BottomTabBar/BottomTabBar'
import TopNavBar from '@/components/common/navigation/TopNavBar/TopNavBar'
import CityFilter from '@/components/common/filters/CityFilter/CityFilter'
import { DateField } from '@/components/FieldRenderers/DateField'
import { useQueryStore } from '@/store/useQueryStore'
import { Hotel } from '@/services/hotel'
import { favoriteApi, hotelApi } from '@/services/api'
import dayjs from 'dayjs'
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
  const [favorites, setFavorites] = useState<FavoriteHotel[]>([])
  const [loading, setLoading] = useState(false)

  const [activeCity, setActiveCity] = useState('all')
  const cities = ['上海']

  const getDates = useQueryStore((state) => state.getDates)
  const getGuests = useQueryStore((state) => state.getGuests)
  const updateDates = useQueryStore((state) => state.updateDates)
  const dates = getDates()
  const guests = getGuests()

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    setLoading(true)
    try {
      const res = await favoriteApi.getList()
      if (res.success && res.data && res.data.length > 0) {
        const hotelList = res.data.map((h: any) => ({
          id: h.id || h.hotelId,
          name: h.name || h.hotelNameCn,
          address: h.address || h.hotelAddress,
          minPrice: h.minPrice || h.price || 0,
          rating: h.rating || h.score || 4.5,
          reviewCount: h.reviewCount || 0,
          starRating: h.starRating || 5,
          images: h.images || [h.imageUrl],
          tags: h.tags || h.facilities || [],
          city: h.city || '上海',
        }))
        setFavorites(hotelList)
      } else {
        const hotelRes = await hotelApi.getHotelList({
          page: 1,
          pageSize: 1,
          city: '上海',
          sortBy: 'rating_desc',
        })
        if (hotelRes.success && hotelRes.data && hotelRes.data.length > 0) {
          const h = hotelRes.data[0]
          setFavorites([
            {
              id: h.id,
              name: h.name,
              address: h.address,
              minPrice: h.minPrice || h.price || 0,
              rating: h.rating || 4.8,
              reviewCount: h.reviewCount || 0,
              starRating: h.starRating || 5,
              images: h.images || [h.imageUrl],
              tags: h.tags || h.facilities || [],
              city: h.city || '上海',
            },
          ])
        }
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error)
      try {
        const hotelRes = await hotelApi.getHotelList({
          page: 1,
          pageSize: 1,
          city: '上海',
          sortBy: 'rating_desc',
        })
        if (hotelRes.success && hotelRes.data && hotelRes.data.length > 0) {
          const h = hotelRes.data[0]
          setFavorites([
            {
              id: h.id,
              name: h.name,
              address: h.address,
              minPrice: h.minPrice || h.price || 0,
              rating: h.rating || 4.8,
              reviewCount: h.reviewCount || 0,
              starRating: h.starRating || 5,
              images: h.images || [h.imageUrl],
              tags: h.tags || h.facilities || [],
              city: h.city || '上海',
            },
          ])
        }
      } catch (e) {
        console.error('Failed to fetch fallback hotel:', e)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCityChange = (city: string) => {
    setActiveCity(city)
  }

  const handleHotelClick = (hotelId: string) => {
    const getNumber = (
      val: number | number[] | undefined,
      defaultVal: number
    ): number => {
      if (val === undefined) return defaultVal
      if (Array.isArray(val)) return val.length > 0 ? val[0] : defaultVal
      return val
    }
    Taro.navigateTo({
      url: `/pages/detail/index?id=${hotelId}&checkInDate=${encodeURIComponent(dates.startDate)}&checkOutDate=${encodeURIComponent(dates.endDate)}&roomCount=${getNumber(guests.rooms, 1)}&adultCount=${getNumber(guests.adults, 2)}&childCount=${getNumber(guests.children, 0)}`,
    })
  }

  return (
    <>
      <View className="favorite-page">
        <TopNavBar
          title="我的收藏"
          showBack
          onBack={() => Taro.switchTab({ url: '/search' })}
        />

        <View className="date-selection-wrapper">
          <DateField
            config={{ props: { singleDay: false } }}
            value={dates}
            onChange={(dateRange) =>
              updateDates(dateRange.startDate, dateRange.endDate)
            }
          />
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
