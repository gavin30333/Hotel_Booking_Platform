import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { Input } from 'antd-mobile'
import {
  SearchOutline,
  FilterOutline,
  MoreOutline,
  FileOutline,
  LeftOutline,
} from 'antd-mobile-icons'
import Taro from '@tarojs/taro'
import RoomItem from '@/pages/detail/components/RoomItem'
import NoData from '@/components/common/feedback/NoData'
import BottomTabBar from '@/components/common/navigation/BottomTabBar/BottomTabBar'
import TopNavBar from '@/components/common/navigation/TopNavBar/TopNavBar'
import OrderStatus from '@/components/common/status/OrderStatus/OrderStatus'
import { Room } from '@/pages/detail/types'
import './index.less'

export default function OrderPage() {
  console.log('Order page loaded')
  const [orders, setOrders] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('all')
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    // 模拟订单数据
    const mockOrders = [
      {
        id: '1',
        hotelName: '上海外滩华尔道夫酒店',
        hotelAddress: '上海市黄浦区中山东一路2号',
        checkInDate: '2026-03-01',
        checkOutDate: '2026-03-03',
        status: 'confirmed',
        room: {
          id: '101',
          name: '豪华客房',
          description: '宽敞明亮的豪华客房，配备特大床，享有城市景观',
          bedType: '特大床',
          area: 45,
          maxOccupancy: 2,
          price: 1280,
          currentPrice: 1280,
          originalPrice: 1680,
          breakfast: true,
          images: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
          ],
        },
        hotelImages: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        ],
      },
      {
        id: '2',
        hotelName: '上海浦东香格里拉大酒店',
        hotelAddress: '上海市浦东新区富城路33号',
        checkInDate: '2026-02-15',
        checkOutDate: '2026-02-16',
        status: 'completed',
        room: {
          id: '201',
          name: '豪华客房',
          description: '宽敞明亮的豪华客房，配备特大床，享有城市景观',
          bedType: '特大床',
          area: 42,
          maxOccupancy: 2,
          price: 1080,
          currentPrice: 1080,
          originalPrice: 1380,
          breakfast: false,
          images: [
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
          ],
        },
        hotelImages: [
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
        ],
      },
    ]
    setOrders(mockOrders)
  }, [])

  const handleBookNow = (orderId: string, breakfastCount?: number) => {
    console.log(
      'Book now clicked for order:',
      orderId,
      'breakfastCount:',
      breakfastCount
    )
  }

  return (
    <>
      <View className="order-page">
        {/* 顶部导航 */}
        <View className="search-bar">
          <View
            className="back-btn"
            onClick={() => Taro.switchTab({ url: '/search' })}
          >
            <LeftOutline />
          </View>
          <Input
            placeholder="搜索订单"
            value={searchValue}
            onChange={setSearchValue}
            prefix={<SearchOutline />}
            className="search-input"
          />
          <View className="search-actions">
            <View className="action-btn" onClick={() => console.log('筛选')}>
              <FilterOutline />
            </View>
            <View className="action-btn" onClick={() => console.log('更多')}>
              <MoreOutline />
            </View>
          </View>
        </View>

        {/* 订单状态标签 */}
        <View className="order-tabs">
          <View
            className={`tab-item ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <Text>全部</Text>
          </View>
          <View
            className={`tab-item ${activeTab === 'unpaid' ? 'active' : ''}`}
            onClick={() => setActiveTab('unpaid')}
          >
            <Text>待付款</Text>
          </View>
          <View
            className={`tab-item ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <Text>未出行</Text>
          </View>
          <View
            className={`tab-item ${activeTab === 'refund' ? 'active' : ''}`}
            onClick={() => setActiveTab('refund')}
          >
            <Text>退款/售后</Text>
          </View>
          <View
            className={`tab-item ${activeTab === 'review' ? 'active' : ''}`}
            onClick={() => setActiveTab('review')}
          >
            <Text>待点评</Text>
          </View>
        </View>

        {/* 订单列表 */}
        <View className="order-list">
          {orders.length === 0 ? (
            <View className="empty-order">
              <View className="empty-icon">
                <FileOutline size={80} color="#ccc" />
              </View>
              <NoData message="暂无相关订单" subMessage="" />
            </View>
          ) : (
            orders.map((order, index) => (
              <View key={order.id} className="order-item">
                <View className="order-hotel-info">
                  <Text className="hotel-name">{order.hotelName}</Text>
                  <Text className="hotel-address">{order.hotelAddress}</Text>
                  <View className="order-date-info">
                    <Text className="order-date">
                      {order.checkInDate} - {order.checkOutDate}
                    </Text>
                    <OrderStatus status={order.status} />
                  </View>
                </View>

                <RoomItem
                  room={order.room}
                  index={index}
                  roomCount={1}
                  onBookNow={() => handleBookNow(order.id)}
                  hotelImages={order.hotelImages}
                />
              </View>
            ))
          )}
        </View>
      </View>

      {/* 底部导航栏区域 */}
      <BottomTabBar activeKey="order" />
    </>
  )
}
