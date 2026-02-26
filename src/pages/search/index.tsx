import { View, Image, Text } from '@tarojs/components'
import { Swiper } from 'antd-mobile'
import { QueryCard } from '@/components/QueryCard'
import Taro, { useLoad } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { getBanners } from '@/mock/index'
import type { Banner } from '@/mock/index'
import { useQueryStore } from '@/store/useQueryStore'
import BottomTabBar from '@/components/common/navigation/BottomTabBar/BottomTabBar'
import HotelRanking from '@/components/common/display/HotelRanking/HotelRanking'
import { hotelApi } from '@/services/api'
import './index.less'

export default function Search() {
  console.log('Search page loaded')
  const [banners, setBanners] = useState<Banner[]>([])
  const [luxuryHotels, setLuxuryHotels] = useState<
    {
      hotelId: string
      name: string
      desc: string
      score?: string
      imageUrl?: string
    }[]
  >([])
  const [familyHotels, setFamilyHotels] = useState<
    {
      hotelId: string
      name: string
      desc: string
      score?: string
      imageUrl?: string
    }[]
  >([])
  const [loading, setLoading] = useState(false)

  const currentCity = useQueryStore(
    (state) => state.scenes[state.activeScene].location.city
  )

  const handleBannerClick = (banner: Banner) => {
    const getSearchParams = useQueryStore.getState().getSearchParams
    const params = getSearchParams()
    Taro.navigateTo({
      url: `/pages/detail/index?id=${banner.hotelId}&checkInDate=${encodeURIComponent(params.checkInDate)}&checkOutDate=${encodeURIComponent(params.checkOutDate)}&roomCount=${params.rooms}&adultCount=${params.adults}&childCount=${params.children}`,
    })
  }

  const fetchData = async (city: string) => {
    setLoading(true)
    try {
      const res = await hotelApi.getHotelList({
        page: 1,
        pageSize: 10,
        city: city,
        sortBy: 'rating_desc',
      })

      if (res.success && res.data) {
        const hotels = res.data
        const luxury = hotels
          .filter((h) => h.starRating >= 4)
          .slice(0, 5)
          .map((h) => ({
            hotelId: h.id,
            name: h.name,
            desc: h.address,
            score: `${h.rating}分`,
            imageUrl: h.images?.[0] || h.imageUrl,
          }))
        const family = hotels
          .filter((h) =>
            h.tags?.some((t) => t.includes('亲子') || t.includes('家庭'))
          )
          .slice(0, 5)
          .map((h) => ({
            hotelId: h.id,
            name: h.name,
            desc: h.address,
            score: `${h.rating}分`,
            imageUrl: h.images?.[0] || h.imageUrl,
          }))

        if (family.length === 0) {
          const fallbackFamily = hotels.slice(0, 5).map((h) => ({
            hotelId: h.id,
            name: h.name,
            desc: h.address,
            score: `${h.rating}分`,
            imageUrl: h.images?.[0] || h.imageUrl,
          }))
          setFamilyHotels(fallbackFamily)
        } else {
          setFamilyHotels(family)
        }

        setLuxuryHotels(
          luxury.length > 0
            ? luxury
            : hotels.slice(0, 5).map((h) => ({
                hotelId: h.id,
                name: h.name,
                desc: h.address,
                score: `${h.rating}分`,
                imageUrl: h.images?.[0] || h.imageUrl,
              }))
        )
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setLuxuryHotels([])
      setFamilyHotels([])
    } finally {
      setLoading(false)
    }
  }

  useLoad(async () => {
    const bannerData = getBanners()
    setBanners(bannerData)
  })

  useEffect(() => {
    fetchData(currentCity)
  }, [currentCity])

  return (
    <>
      <View className="search-page">
        {banners.length > 0 && (
          <Swiper
            className="banner-swiper"
            autoplay
            loop
            indicatorProps={{
              color: 'white',
            }}
          >
            {banners.map((item) => (
              <Swiper.Item
                key={item.id}
                onClick={() => handleBannerClick(item)}
              >
                <Image
                  src={item.imgUrl}
                  className="banner-image"
                  mode="scaleToFill"
                />
              </Swiper.Item>
            ))}
          </Swiper>
        )}

        <View className="card-container">
          <QueryCard />
        </View>

        <HotelRanking
          luxuryHotels={luxuryHotels}
          familyHotels={familyHotels}
          loading={loading}
        />
      </View>

      <BottomTabBar activeKey="recommend" />
    </>
  )
}
