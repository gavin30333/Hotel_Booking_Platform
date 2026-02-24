import { View, Image, Text, ScrollView } from '@tarojs/components'
import { Swiper, TabBar, Grid } from 'antd-mobile'
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
import './index.less'

export default function Search() {
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
  const tabs = [
    {
      key: 'recommend',
      title: '首页',
      icon: (active: boolean) =>
        active ? <FireFill /> : <ArrowDownCircleOutline />,
    },
    {
      key: 'favorite',
      title: '收藏',
      icon: <GiftOutline />,
    },
    {
      key: 'profile',
      title: '我的',
      icon: <FileOutline />,
    },
  ]

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
      <View className="hotel-ranking-section">
        <ScrollView scrollX className="ranking-lists-scroll" enableFlex>
          {/* 奢华酒店榜单 */}
          <View className="ranking-list-wrapper">
            <View className="ranking-list-card">
              <View className="ranking-header-card">
                <Text className="ranking-title-card">🏆 奢华酒店榜</Text>
                <Text className="ranking-more">更多酒店 {'>'}</Text>
              </View>
              <View className="ranking-items">
                {luxuryHotels.map((hotel, index) => (
                  <View key={index} className="ranking-item">
                    <View className="item-image-box">
                      <Image
                        src={`https://picsum.photos/100/100?random=${index}`}
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
                        <Text className="item-score">4.{8 - index}</Text>
                        <Text className="item-desc">{hotel.desc}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* 亲子酒店榜单 */}
          <View className="ranking-list-wrapper">
            <View className="ranking-list-card">
              <View className="ranking-header-card">
                <Text className="ranking-title-card">🏆 亲子酒店榜</Text>
                <Text className="ranking-more">更多酒店 {'>'}</Text>
              </View>
              <View className="ranking-items">
                {familyHotels.map((hotel, index) => (
                  <View key={index} className="ranking-item">
                    <View className="item-image-box">
                      <Image
                        src={`https://picsum.photos/100/100?random=${index + 10}`}
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
                        <Text className="item-score">4.{7 - index}</Text>
                        <Text className="item-desc">{hotel.desc}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* 底部导航栏区域 */}
      <TabBar
        className="bottom-tab-bar"
        onChange={(key) => {
          switch (key) {
            case 'recommend':
              Taro.switchTab({ url: '/search' })
              break
            case 'favorite':
              Taro.switchTab({ url: '/favorite' })
              break
            case 'profile':
              Taro.switchTab({ url: '/profile' })
              break
            default:
              break
          }
        }}
      >
        {tabs.map((item) => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    </>
  )
}
