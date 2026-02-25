import { View, Image, Text } from '@tarojs/components'
import { Swiper } from 'antd-mobile'
import { QueryCard } from '@/components/QueryCard'
import {
  ArrowDownCircleOutline,
  FireFill,
  UnorderedListOutline,
  GiftOutline,
  FillinOutline,
  FileOutline,
} from 'antd-mobile-icons'
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
    { name: string; desc: string }[]
  >([])
  const [familyHotels, setFamilyHotels] = useState<
    { name: string; desc: string }[]
  >([])

  // Get current city from query store
  const currentCity = useQueryStore(
    (state) => state.scenes[state.activeScene].location.city
  )

  const handleBannerClick = (id: number) => {
    Taro.navigateTo({
      url: `/hotel?id=${id}`,
    })
  }

  // Function to fetch hotel rankings by city
  const fetchHotelRankings = async (city: string) => {
    try {
      const rankingsData = await getCityHotelRankings(city)
      if (rankingsData.code === 200 && rankingsData.data) {
        setLuxuryHotels(rankingsData.data.luxuryHotels || [])
        setFamilyHotels(rankingsData.data.familyHotels || [])
      }
    } catch (error) {
      console.error('Failed to fetch hotel rankings:', error)
    }
  }

  useLoad(async () => {
    // 获取轮播图数据
    const bannerData = getBanners()
    setBanners(bannerData)

    // 获取热门酒店榜单数据
    await fetchHotelRankings(currentCity)
  })

  // Update hotel rankings when city changes
  useEffect(() => {
    fetchHotelRankings(currentCity)
  }, [currentCity])

  return (
    <>
      {/* 轮播图区域 */}
      <View className="banner-section">
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
                onClick={() => handleBannerClick(item.id)}
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
      </View>

      {/* 查询框区域 */}
      <View className="card-container">
        <QueryCard></QueryCard>
      </View>

      {/* 热门推荐酒店榜单区域 */}
      <HotelRanking luxuryHotels={luxuryHotels} familyHotels={familyHotels} />

      {/* 底部导航栏区域 */}
      <BottomTabBar activeKey="recommend" />
    </>
  )
}
