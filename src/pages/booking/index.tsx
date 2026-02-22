import { View, Text, ScrollView, Input, Button } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro, { useRouter, showToast } from '@tarojs/taro'
import { getHotelDetail } from '@/services/hotel'
import {
  LeftOutline,
  CalendarOutline,
  ClockOutline,
  UserOutline,
  PhoneOutline,
  MessageOutline,
  GiftOutline,
  FileOutline,
  DownOutline,
} from 'antd-mobile-icons'
import './index.less'

export default function BookingPage() {
  const router = useRouter()
  const hotelId = router.params.hotelId as string
  const roomTypeId = router.params.roomTypeId as string
  const checkInDate = router.params.checkInDate as string
  const checkOutDate = router.params.checkOutDate as string

  const [hotel, setHotel] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 表单数据
  const [formData, setFormData] = useState({
    guestName: '',
    phone: '',
    roomCount: 1,
    adultCount: 1,
    childCount: 0,
    specialRequests: [] as string[],
  })

  // 价格信息
  const [priceInfo, setPriceInfo] = useState({
    roomPrice: 0,
    totalPrice: 0,
    discount: 0,
  })

  // 特殊要求选项
  const specialRequestOptions = [
    '电梯近',
    '是否安静',
    '高楼层',
    '无烟房',
    '延迟退房',
    '提前入住',
  ]

  useEffect(() => {
    fetchHotelDetail()
    // 检查用户是否已登录，如果是，回填用户信息
    const userInfo = Taro.getStorageSync('userInfo')
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        guestName: userInfo.name,
        phone: userInfo.phone,
      }))
    }
  }, [hotelId])

  useEffect(() => {
    // 计算价格
    if (hotel) {
      const roomPrice = hotel.rooms?.[0]?.price || 0
      const discount = 0 // 可以根据实际情况计算折扣
      const totalPrice = roomPrice * formData.roomCount

      setPriceInfo({
        roomPrice,
        totalPrice,
        discount,
      })
    }
  }, [hotel, formData.roomCount])

  const fetchHotelDetail = async () => {
    setLoading(true)
    try {
      const response = await getHotelDetail(hotelId)
      setHotel(response.data)
    } catch (error) {
      console.error('Failed to fetch hotel detail:', error)
      showToast({
        title: '酒店信息加载失败',
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
      const newValue = Math.max(0, currentValue + delta)
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

  const handleSubmit = () => {
    // 表单验证
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

    // 模拟提交预订
    showToast({
      title: '预订成功！',
      icon: 'success',
      duration: 2000,
    })

    // 跳转到成功页面或返回详情页
    setTimeout(() => {
      Taro.navigateBack()
    }, 2000)
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
      </View>
    )
  }

  return (
    <View className="booking-page">
      {/* 顶部导航栏 */}
      <View className="top-nav-bar">
        <View className="nav-left">
          <View className="back-btn" onClick={() => Taro.navigateBack()}>
            <LeftOutline color="#333" />
          </View>
        </View>
        <View className="nav-title">{hotel.name}</View>
        <View className="nav-right" />
      </View>

      {/* 内容区域 */}
      <ScrollView className="booking-content" scrollY>
        {/* 酒店信息头部 */}
        <View className="hotel-header">
          <View className="date-and-room">
            <Text className="booking-date">
              {(() => {
                const checkIn = new Date(checkInDate)
                const checkOut = new Date(checkOutDate)
                return `${checkIn.getMonth() + 1}月${checkIn.getDate()}日 - ${checkOut.getMonth() + 1}月${checkOut.getDate()}日 | 共${Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))}晚`
              })()}
            </Text>
            <Text className="room-detail-tag">房型详情</Text>
          </View>
          <Text className="check-time">15:00后入住 12:00前退房</Text>
          <Text className="room-info">
            {(() => {
              const roomTypeIndex = parseInt(roomTypeId)
              const selectedRoom = hotel.rooms?.[roomTypeIndex]
              return selectedRoom
                ? `${selectedRoom.name} ${selectedRoom.description}`
                : '豪华房 1张1.8米大床 1份早餐'
            })()}
          </Text>
          <View className="booking-tags">
            <Text className="booking-tag">✓ 订单确认30分钟内免费取消</Text>
            <Text className="booking-tag">✓ 立即确认</Text>
          </View>
        </View>

        {/* 预订信息表单 */}
        <View className="booking-form">
          {/* 订房信息 */}
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

            {/* 住客姓名 */}
            <View>
              <View className="form-row">
                <Text className="form-label">住客姓名</Text>
                <Text className="required">*</Text>
                <View className="form-control">
                  <Input
                    placeholder="请输入住客姓名"
                    value={formData.guestName}
                    onChange={(e) =>
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

            {/* 联系手机 */}
            <View className="form-row">
              <Text className="form-label">联系手机</Text>
              <Text className="required">*</Text>
              <View className="form-control">
                <Input
                  placeholder="用于接收通知"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.detail.value)}
                  type="number"
                />
              </View>
            </View>
          </View>
        </View>

        {/* 可享优惠 */}
        <View className="discount-section">
          <View className="section-title">
            <GiftOutline className="title-icon" />
            <Text>本单可享</Text>
          </View>
          <View className="discount-item">
            <Text className="discount-name">离店赚积分</Text>
            <Text className="discount-value-gray">1317积分</Text>
          </View>
        </View>

        {/* 特殊要求 */}
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

        {/* 发票信息 */}
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

      {/* 底部价格和支付区域 */}
      <View className="booking-footer">
        <View className="price-info">
          <Text className="price-label">在线付</Text>
          <Text className="price-value-blue">¥{priceInfo.totalPrice}</Text>
          <Text className="price-note">新人价</Text>
        </View>
        <Button className="pay-btn-blue" onClick={handleSubmit}>
          立即支付
        </Button>
      </View>
    </View>
  )
}
