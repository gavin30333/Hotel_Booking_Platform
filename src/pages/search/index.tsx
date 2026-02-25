import { View, Image, Text } from '@tarojs/components'
import { Swiper } from 'antd-mobile'
import { QueryCard } from '@/components/QueryCard'
import Taro, { useLoad } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { getBanners, getCityHotelRankings } from '@/mock/index'
import type { Banner } from '@/mock/index'
import { useQueryStore } from '@/store/useQueryStore'
import BottomTabBar from '@/components/common/navigation/BottomTabBar/BottomTabBar'
import HotelRanking from '@/components/common/display/HotelRanking/HotelRanking'
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
    Taro.navigateTo({
      url: `/pages/detail/index?id=${banner.hotelId}`,
    })
  }

  const fetchData = async (city: string) => {
    setLoading(true)
    try {
      const rankingsRes = await getCityHotelRankings(city)

      if (rankingsRes.code === 200 && rankingsRes.data) {
        setLuxuryHotels(rankingsRes.data.luxuryHotels || [])
        setFamilyHotels(rankingsRes.data.familyHotels || [])
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
