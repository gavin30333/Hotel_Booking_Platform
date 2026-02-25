import { View, Text, ScrollView, Input, Button } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro, { useRouter, showToast } from '@tarojs/taro'
import { getHotelDetail, orderApi } from '@/services/hotel'
import {
  LeftOutline,
  MessageOutline,
  GiftOutline,
  FileOutline,
  DownOutline,
} from 'antd-mobile-icons'
import './index.less'

interface RoomType {
  id: string
  name: string
  nameEn?: string
  price: number
  originalPrice?: number
  area?: number
  bedType?: string
  maxOccupancy?: number
  breakfast?: boolean
  description?: string
  facilities?: string[]
  stock?: number
  images?: string[]
}

interface HotelDetail {
  id: string
  name: string
  nameEn?: string
  address: string
  city: string
  starRating: number
  phone?: string
  description?: string
  images: string[]
  rating: number
  reviewCount: number
  viewCount?: number
  orderCount?: number
  facilities: string[]
  nearbyAttractions?: Array<{ name: string; distance?: string; description?: string }>
  transportations?: Array<{ type: string; name: string; distance?: string }>
  shoppingMalls?: Array<{ name: string; distance?: string; description?: string }>
  discounts?: Array<{ name: string; type: string; value: number; description?: string }>
  policies?: {
    checkIn?: string
    checkOut?: string
    cancellation?: string
    extraBed?: string
    pets?: string
  }
  roomTypes: RoomType[]
  openingDate?: string
}

export default function BookingPage() {
  const router = useRouter()
  const hotelId = router.params.hotelId as string
  const roomTypeId = router.params.roomTypeId as string
  const checkInDate = router.params.checkInDate as string
  const checkOutDate = router.params.checkOutDate as string

  const [hotel, setHotel] = useState<HotelDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    guestName: '',
    phone: '',
    roomCount: 1,
    adultCount: 1,
    childCount: 0,
    specialRequests: [] as string[],
  })

  const [priceInfo, setPriceInfo] = useState({
    roomPrice: 0,
    totalPrice: 0,
    discount: 0,
    nights: 1,
  })

  const specialRequestOptions = [
    '电梯近',
    '是否安静',
    '高楼层',
    '无烟房',
    '延迟退房',
    '提前入住',
  ]

  useEffect(() => {
    if (hotelId) {
      fetchHotelDetail()
    }
    const userInfo = Taro.getStorageSync('userInfo')
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        guestName: userInfo.name || '',
        phone: userInfo.phone || '',
      }))
    }
  }, [hotelId])

  useEffect(() => {
    if (hotel && checkInDate && checkOutDate) {
      calculatePrice()
    }
  }, [hotel, formData.roomCount, checkInDate, checkOutDate, roomTypeId])

  const calculatePrice = () => {
    if (!hotel) return

    const selectedRoom = hotel.roomTypes?.find(
      (room) => room.id === roomTypeId || room.name === roomTypeId
    ) || hotel.roomTypes?.[0]

    const roomPrice = selectedRoom?.price || 0
    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)))

    const discount = hotel.discounts?.reduce((acc, d) => {
      if (d.type === 'percentage') {
        return acc + Math.floor(roomPrice * nights * formData.roomCount * (100 - d.value) / 100)
      } else if (d.type === 'fixed' || d.type === 'special') {
        return acc + d.value
      }
      return acc
    }, 0) || 0

    const totalPrice = roomPrice * nights * formData.roomCount - discount

    setPriceInfo({
      roomPrice,
      totalPrice: Math.max(0, totalPrice),
      discount,
      nights,
    })
  }

  const fetchHotelDetail = async () => {
    setLoading(true)
    try {
      const response = await getHotelDetail(hotelId)
      if (response) {
        setHotel(response as unknown as HotelDetail)
      }
    } catch (error) {
      console.error('Failed to fetch hotel detail:', error)
      showToast({
        title: '酒店信息加载失败，请稍后重试',
        icon: 'none',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCounterChange = (field: string, delta: number) => {
    setFormData((prev) => {
      const currentValue = prev[field as keyof typeof prev] as number
      const newValue = Math.max(field === 'roomCount' ? 1 : 0, currentValue + delta)
      return {
        ...prev,
        [field]: newValue,
      }
    })
  }

  const handleSpecialRequestToggle = (request: string) => {
    setFormData((prev) => {
      const requests = prev.specialRequests
      if (requests.includes(request)) {
        return {
          ...prev,
          specialRequests: requests.filter((r) => r !== request),
        }
      } else {
        return {
          ...prev,
          specialRequests: [...requests, request],
        }
      }
    })
  }

  const handleSubmit = async () => {
    if (!formData.guestName) {
      showToast({
        title: '请输入住客姓名',
        icon: 'none',
      })
      return
    }

    if (!formData.phone) {
      showToast({
        title: '请输入联系手机',
        icon: 'none',
      })
      return
    }

    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
      })
      return
    }

    setSubmitting(true)

    try {
      const selectedRoom = hotel?.roomTypes?.find(
        (room) => room.id === roomTypeId || room.name === roomTypeId
      ) || hotel?.roomTypes?.[0]

      const createResponse = await orderApi.create({
        hotelId: hotelId,
        roomTypeId: selectedRoom?.id || roomTypeId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: [{
          name: formData.guestName,
          phone: formData.phone,
          idCard: '',
        }],
        remark: formData.specialRequests.join('、'),
      })

      if (createResponse.success) {
        const newOrderId = createResponse.data.orderId

        showToast({
          title: '订单创建成功，正在支付...',
          icon: 'loading',
          duration: 1500,
        })

        setTimeout(() => {
          handlePayment(newOrderId)
        }, 1500)
      } else {
        showToast({
          title: createResponse.message || '订单创建失败',
          icon: 'none',
        })
        setSubmitting(false)
      }
    } catch (error: any) {
      console.error('创建订单失败:', error)
      showToast({
        title: error.response?.data?.message || '订单创建失败，请重试',
        icon: 'none',
      })
      setSubmitting(false)
    }
  }

  const handlePayment = async (orderIdToPay: string) => {
    try {
      const payResponse = await orderApi.pay(orderIdToPay)

      if (payResponse.success) {
        showToast({
          title: '支付成功！',
          icon: 'success',
          duration: 2000,
        })

        setTimeout(() => {
          Taro.showModal({
            title: '支付成功',
            content: `您的订单已支付成功！\n订单号：${orderIdToPay}\n支付金额：¥${priceInfo.totalPrice}`,
            confirmText: '查看酒店',
            cancelText: '返回首页',
            success: (res) => {
              if (res.confirm) {
                Taro.redirectTo({
                  url: `/pages/detail/index?id=${hotelId}`,
                })
              } else {
                Taro.switchTab({
                  url: '/pages/search/index',
                })
              }
            }
          })
        }, 500)
      } else {
        showToast({
          title: payResponse.message || '支付失败',
          icon: 'none',
          duration: 2000,
        })
        showPaymentFailModal(orderIdToPay)
      }
    } catch (error: any) {
      console.error('支付失败:', error)
      showToast({
        title: error.response?.data?.message || '支付失败，请重试',
        icon: 'none',
      })
      showPaymentFailModal(orderIdToPay)
    }
  }

  const showPaymentFailModal = (orderIdToPay: string) => {
    setTimeout(() => {
      Taro.showModal({
        title: '支付失败',
        content: '支付遇到问题，是否重试？',
        confirmText: '重试支付',
        cancelText: '取消订单',
        success: (res) => {
          if (res.confirm) {
            handlePayment(orderIdToPay)
          } else {
            orderApi.cancel(orderIdToPay).catch(() => {})
            Taro.navigateBack()
          }
        }
      })
    }, 500)
    setSubmitting(false)
  }

  if (loading) {
    return (
      <View className="loading-container">
        <Text>加载中...</Text>
      </View>
    )
  }

  if (!hotel) {
    return (
      <View className="error-container">
        <Text>酒店信息加载失败</Text>
        <Button
          style={{ marginTop: '20px' }}
          onClick={() => Taro.navigateBack()}
        >
          返回上一页
        </Button>
      </View>
    )
  }

  const selectedRoom = hotel.roomTypes?.find(
    (room) => room.id === roomTypeId || room.name === roomTypeId
  ) || hotel.roomTypes?.[0]

  return (
    <View className="booking-page">
      <View className="top-nav-bar">
        <View className="nav-left">
          <View className="back-btn" onClick={() => Taro.navigateBack()}>
            <LeftOutline color="#333" />
          </View>
        </View>
        <View className="nav-title">{hotel.name}</View>
        <View className="nav-right" />
      </View>

      <ScrollView className="booking-content" scrollY>
        <View className="hotel-header">
          <View className="date-and-room">
            <Text className="booking-date">
              {(() => {
                const checkIn = new Date(checkInDate)
                const checkOut = new Date(checkOutDate)
                return `${checkIn.getMonth() + 1}月${checkIn.getDate()}日 - ${checkOut.getMonth() + 1}月${checkOut.getDate()}日 | 共${priceInfo.nights}晚`
              })()}
            </Text>
            <Text className="room-detail-tag">房型详情</Text>
          </View>
          <Text className="check-time">
            {hotel.policies?.checkIn || '15:00'}后入住
            {hotel.policies?.checkOut || '12:00'}前退房
          </Text>
          <Text className="room-info">
            {selectedRoom
              ? `${selectedRoom.name} ${selectedRoom.bedType || ''} ${selectedRoom.breakfast ? '含早餐' : '无早餐'}`
              : '请选择房型'}
          </Text>
          <View className="booking-tags">
            <Text className="booking-tag">✓ 订单确认30分钟内免费取消</Text>
            <Text className="booking-tag">✓ 立即确认</Text>
          </View>
        </View>

        <View className="booking-form">
          <View className="form-section">
            <View className="room-count-header">
              <Text className="section-title">订房信息</Text>
              <View className="room-count-control">
                <Button
                  className="counter-btn"
                  disabled={formData.roomCount <= 1}
                  onClick={() => handleCounterChange('roomCount', -1)}
                >
                  -
                </Button>
                <Text className="counter-value">{formData.roomCount}</Text>
                <Button
                  className="counter-btn"
                  onClick={() => handleCounterChange('roomCount', 1)}
                >
                  +
                </Button>
              </View>
            </View>

            <View>
              <View className="form-row">
                <Text className="form-label">住客姓名</Text>
                <Text className="required">*</Text>
                <View className="form-control">
                  <Input
                    placeholder="请输入住客姓名"
                    value={formData.guestName}
                    onInput={(e) =>
                      handleInputChange('guestName', e.detail.value)
                    }
                  />
                </View>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: '#999',
                  marginLeft: 84,
                }}
              >
                英文姓名用 "/" 隔开，如 Han/Meimei
              </Text>
            </View>

            <View className="form-row">
              <Text className="form-label">联系手机</Text>
              <Text className="required">*</Text>
              <View className="form-control">
                <Input
                  placeholder="用于接收通知"
                  value={formData.phone}
                  onInput={(e) => handleInputChange('phone', e.detail.value)}
                  type="number"
                />
              </View>
            </View>
          </View>
        </View>

        <View className="discount-section">
          <View className="section-title">
            <GiftOutline className="title-icon" />
            <Text>本单可享</Text>
          </View>
          {hotel.discounts && hotel.discounts.length > 0 ? (
            hotel.discounts.map((discount, index) => (
              <View key={index} className="discount-item">
                <Text className="discount-name">{discount.name}</Text>
                <Text className="discount-value">
                  -¥{discount.value}{discount.type === 'percentage' ? '%' : ''}
                </Text>
              </View>
            ))
          ) : (
            <View className="discount-item">
              <Text className="discount-name">离店赚积分</Text>
              <Text className="discount-value-gray">
                {Math.floor(priceInfo.totalPrice * 0.5)}积分
              </Text>
            </View>
          )}
        </View>

        <View className="special-requests-section">
          <View className="section-title">
            <MessageOutline className="title-icon" />
            <Text>特殊要求</Text>
          </View>
          <View className="request-tags">
            {specialRequestOptions.map((option, index) => (
              <View
                key={index}
                className={`request-tag ${formData.specialRequests.includes(option) ? 'active' : ''}`}
                onClick={() => handleSpecialRequestToggle(option)}
              >
                <Text>{option}</Text>
              </View>
            ))}
          </View>
          <View className="more-requests">
            <Text>更多入住要求</Text>
            <DownOutline />
          </View>
        </View>

        <View className="invoice-section">
          <View className="section-title">
            <FileOutline className="title-icon" />
            <Text>发票</Text>
          </View>
          <View className="invoice-info">
            <Text>携程开具发票（携程旅行社及其分公司）</Text>
            <Text>
              预订成功后在订单页开具 | 可开具专票 |
              开票内容为经纪代理服务-代订住宿费 | 仅支持数电票
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="booking-footer">
        <View className="price-info">
          <Text className="price-label">在线付</Text>
          <Text className="price-value-blue">¥{priceInfo.totalPrice}</Text>
          {priceInfo.discount > 0 && (
            <Text className="price-note">已优惠¥{priceInfo.discount}</Text>
          )}
        </View>
        <Button
          className="pay-btn-blue"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? '处理中...' : '立即支付'}
        </Button>
      </View>
    </View>
  )
}
