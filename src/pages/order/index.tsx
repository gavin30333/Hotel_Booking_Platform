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

interface Order {
  id: string
  orderNo: string
  hotelId: string
  hotelName: string
  hotelAddress: string
  roomTypeName: string
  roomPrice: number
  checkIn: string
  checkOut: string
  nights: number
  totalPrice: number
  discountAmount: number
  finalPrice: number
  status: 'pending' | 'paid' | 'completed' | 'cancelled'
  createdAt: string
}

// 状态映射：后端状态 -> 前端显示状态
const statusMap: Record<
  string,
  'pending' | 'confirmed' | 'completed' | 'cancelled'
> = {
  pending: 'pending',
  paid: 'confirmed',
  completed: 'completed',
  cancelled: 'cancelled',
}

export default function OrderPage() {
  console.log('Order page loaded')
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState('all')
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(true)

  // 获取订单列表
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await Taro.request({
        url: 'http://localhost:3000/api/user/orders',
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
        },
      })

      if (response.statusCode === 200 && response.data.success) {
        setOrders(response.data.data)
      } else {
        console.error('获取订单失败:', response.data)
        setOrders([])
      }
    } catch (error) {
      console.error('网络错误:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
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
    if (activeTab === 'upcoming') return order.status === 'paid'
    if (activeTab === 'refund') return order.status === 'cancelled'
    if (activeTab === 'review') return order.status === 'completed'
    return true
  })

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <>
      <View className="order-page">
        <View className="search-bar">
          <View
            className="back-btn"
            onClick={() => Taro.reLaunch({ url: '/pages/search/index' })}
          >
            <LeftOutline />
          </View>
          <Input
            placeholder="搜索订单"
            value={searchValue}
            onChange={setSearchValue}
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
          {loading ? (
            <View className="empty-order">
              <Text>加载中...</Text>
            </View>
          ) : filteredOrders.length === 0 ? (
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
                      {formatDate(order.checkIn)} - {formatDate(order.checkOut)}{' '}
                      · 共{calculateNights(order.checkIn, order.checkOut)}晚
                    </Text>
                    <OrderStatus
                      status={statusMap[order.status] || order.status}
                    />
                  </View>
                </View>

                <View className="order-room-info">
                  <View className="room-image">
                    <Image
                      src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
                      fit="cover"
                      className="room-img"
                    />
                  </View>
                  <View className="room-detail">
                    <Text className="room-name">{order.roomTypeName}</Text>
                    <Text className="room-desc">豪华客房 · 40㎡ · 2人入住</Text>
                    <Text className="room-breakfast">含早餐</Text>
                    <View className="room-price-row">
                      <Text className="room-price">¥{order.finalPrice}</Text>
                      {order.totalPrice > order.finalPrice && (
                        <Text className="room-original-price">
                          ¥{order.totalPrice}
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
