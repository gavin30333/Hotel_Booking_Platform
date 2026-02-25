import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { Input, Image } from 'antd-mobile'
import {
  SearchOutline,
  FilterOutline,
  MoreOutline,
  FileOutline,
  LeftOutline,
} from 'antd-mobile-icons'
import Taro from '@tarojs/taro'
import NoData from '@/components/common/feedback/NoData'
import BottomTabBar from '@/components/common/navigation/BottomTabBar/BottomTabBar'
import OrderStatus from '@/components/common/status/OrderStatus/OrderStatus'
import './index.less'

interface OrderRoom {
  id: string
  name: string
  description: string
  bedType: string
  area: number
  maxOccupancy: number
  price: number
  currentPrice: number
  originalPrice: number
  breakfast: boolean
  images: string[]
}

interface Order {
  id: string
  hotelId: string
  hotelName: string
  hotelAddress: string
  checkInDate: string
  checkOutDate: string
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending'
  room: OrderRoom
  hotelImages: string[]
}

export default function OrderPage() {
  console.log('Order page loaded')
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState('all')
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: '1',
        hotelId: '1',
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
        hotelId: '2',
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

  const handleOrderClick = (order: Order) => {
    if (order.status === 'completed' || order.status === 'cancelled') {
      return
    }
    Taro.navigateTo({
      url: `/pages/detail/index?id=${order.hotelId}`,
    })
  }

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'all') return true
    if (activeTab === 'unpaid') return order.status === 'pending'
    if (activeTab === 'upcoming') return order.status === 'confirmed'
    if (activeTab === 'refund') return order.status === 'cancelled'
    if (activeTab === 'review') return order.status === 'completed'
    return true
  })

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    return Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    )
  }

  return (
    <>
      <View className="order-page">
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

        <View className="order-list">
          {filteredOrders.length === 0 ? (
            <View className="empty-order">
              <View className="empty-icon">
                <FileOutline size={80} color="#ccc" />
              </View>
              <NoData message="暂无相关订单" subMessage="" />
            </View>
          ) : (
            filteredOrders.map((order) => (
              <View
                key={order.id}
                className={`order-item ${order.status === 'completed' || order.status === 'cancelled' ? 'order-item-disabled' : ''}`}
                onClick={() => handleOrderClick(order)}
              >
                <View className="order-hotel-info">
                  <Text className="hotel-name">{order.hotelName}</Text>
                  <Text className="hotel-address">{order.hotelAddress}</Text>
                  <View className="order-date-info">
                    <Text className="order-date">
                      {formatDate(order.checkInDate)} -{' '}
                      {formatDate(order.checkOutDate)} · 共
                      {calculateNights(order.checkInDate, order.checkOutDate)}晚
                    </Text>
                    <OrderStatus status={order.status} />
                  </View>
                </View>

                <View className="order-room-info">
                  <View className="room-image">
                    <Image
                      src={order.room.images?.[0] || order.hotelImages[0]}
                      fit="cover"
                      className="room-img"
                    />
                  </View>
                  <View className="room-detail">
                    <Text className="room-name">{order.room.name}</Text>
                    <Text className="room-desc">
                      {order.room.bedType} · {order.room.area}㎡ ·{' '}
                      {order.room.maxOccupancy}人入住
                    </Text>
                    <Text className="room-breakfast">
                      {order.room.breakfast ? '含早餐' : '无早餐'}
                    </Text>
                    <View className="room-price-row">
                      <Text className="room-price">
                        ¥{order.room.currentPrice}
                      </Text>
                      {order.room.originalPrice > order.room.currentPrice && (
                        <Text className="room-original-price">
                          ¥{order.room.originalPrice}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>

                {order.status !== 'completed' &&
                  order.status !== 'cancelled' && (
                    <View className="order-actions">
                      <View className="action-btn-secondary">
                        <Text>再次预订</Text>
                      </View>
                    </View>
                  )}
              </View>
            ))
          )}
        </View>
      </View>

      <BottomTabBar activeKey="order" />
    </>
  )
}
