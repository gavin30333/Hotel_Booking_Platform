import { View, Image } from '@tarojs/components'
import { Swiper, TabBar } from 'antd-mobile'
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
import { useState } from 'react'
import { getBanners } from '@/mock/index'
import type { Banner } from '@/mock/index'
import './index.less'

export default function Search() {
  const [banners, setBanners] = useState<Banner[]>([])

  const handleBannerClick = (id: number) => {
    Taro.navigateTo({
      url: `/pages/user/detail/index?id=${id}`,
    })
  }
  const tabs = [
    {
      key: 'recommend',
      title: '推荐',
      icon: (active: boolean) =>
        active ? <FireFill /> : <ArrowDownCircleOutline />,
    },
    {
      key: 'cart',
      title: '购物车',
      icon: <UnorderedListOutline />,
    },
    {
      key: 'equity',
      title: '我的权益',
      icon: <GiftOutline />,
    },
    {
      key: 'comment',
      title: '我的点评',
      icon: <FillinOutline />,
    },
    {
      key: 'order',
      title: '我的订单',
      icon: <FileOutline />,
    },
  ]

  useLoad(() => {
    // 获取 Mock 数据
    const data = getBanners()
    setBanners(data)
  })

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

      {/* 底部导航栏区域 */}
      <TabBar className="bottom-tab-bar">
        {tabs.map((item) => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    </>
  )
}
