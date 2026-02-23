import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro, { useRouter, showToast } from '@tarojs/taro'
import { getHotelDetail } from '@/services/hotel'
import dayjs from 'dayjs'
import {
  FireFill,
  EnvironmentOutline,
  ShopbagOutline,
  TravelOutline,
  LocationOutline,
} from 'antd-mobile-icons'
import { CalendarPicker } from '@/components/common/form/CalendarPicker'
import { PolicyPopup } from '@/components/common/popup/PolicyPopup'
import { GuestSelectionPopup } from '@/components/common/popup/GuestSelectionPopup'
import { GuestInfo } from '@/types/query.types'
import { getTransportIcon } from './utils'
import './DetailPage.less'

import HotelDetailHeader from './components/HotelDetailHeader'
import ImageCarousel from '@/components/common/display/ImageCarousel'
import HotelInfo from './components/HotelInfo'
import ServiceTags from './components/ServiceTags'
import DatePriceSelector from './components/DatePriceSelector'
import RoomList from './components/RoomList'

export default function HotelDetailPage() {
  const router = useRouter()
  const hotelId = router.params.id as string
  const [hotel, setHotel] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [checkInDate, setCheckInDate] = useState<string>(
    router.params.checkInDate || today.toISOString().split('T')[0]
  )
  const [checkOutDate, setCheckOutDate] = useState<string>(
    router.params.checkOutDate || tomorrow.toISOString().split('T')[0]
  )
  const [roomCount, setRoomCount] = useState<number>(
    Number(router.params.roomCount) || 1
  )
  const [adultCount, setAdultCount] = useState<number>(
    Number(router.params.adultCount) || 1
  )
  const [childCount, setChildCount] = useState<number>(
    Number(router.params.childCount) || 0
  )

  const [showCalendar, setShowCalendar] = useState(false)
  const [showPolicyPopup, setShowPolicyPopup] = useState(false)
  const [showGuestPicker, setShowGuestPicker] = useState(false)
  const [showPriceFilter, setShowPriceFilter] = useState(false)
  const [showRoomTypeFilter, setShowRoomTypeFilter] = useState(false)
  const [showSortFilter, setShowSortFilter] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [filterArrowUp, setFilterArrowUp] = useState(false)

  useEffect(() => {
    fetchHotelDetail()
  }, [hotelId])

  const fetchHotelDetail = async () => {
    setLoading(true)
    try {
      const response = await getHotelDetail(hotelId)
      setHotel(response)
    } catch (error) {
      console.error('Failed to fetch hotel detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookNow = (roomIndex: number) => {
    const selectedRoom = hotel.roomTypes?.[roomIndex]
    if (!selectedRoom) {
      showToast({
        title: '请选择房型',
        icon: 'none',
      })
      return
    }

    // 检查用户是否已登录
    const isLoggedIn = Taro.getStorageSync('isLoggedIn')
    if (!isLoggedIn) {
      // 未登录，跳转到登录页
      showToast({
        title: '请先登录后操作',
        icon: 'none',
        duration: 1500,
      })

      // 跳转到登录页，并传递来源页面信息
      const fromPage = `/pages/booking/index?hotelId=${hotelId}&roomTypeId=${roomIndex}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
      Taro.navigateTo({
        url: `/pages/login/index?fromPage=${encodeURIComponent(fromPage)}`,
      })
      return
    }

    // 已登录，直接跳转到预订页面
    Taro.navigateTo({
      url: `/pages/booking/index?hotelId=${hotelId}&roomTypeId=${roomIndex}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`,
    })
  }

  const handleImageClick = (index: number) => {
    showToast({
      title: `查看图片 ${index + 1}`,
      icon: 'none',
      duration: 1500,
    })
  }

  const handleBack = () => {
    Taro.navigateBack()
  }

  const handleDateConfirm = (range: {
    start: string | null
    end: string | null
  }) => {
    if (range.start && range.end) {
      setCheckInDate(range.start)
      setCheckOutDate(range.end)
    }
    setShowCalendar(false)
  }

  const handleGuestChange = (guestInfo: GuestInfo) => {
    const getNumber = (
      val: number | number[] | undefined,
      defaultVal: number = 0
    ): number => {
      if (val === undefined) return defaultVal
      if (Array.isArray(val)) return val.length > 0 ? val[0] : defaultVal
      return val
    }
    setRoomCount(getNumber(guestInfo.rooms, 1))
    setAdultCount(getNumber(guestInfo.adults, 1))
    setChildCount(getNumber(guestInfo.children, 0))
  }

  const guestInfo: GuestInfo = {
    rooms: roomCount,
    adults: adultCount,
    children: childCount,
    childAges: [],
  }

  const handleFilterTagClick = (filterType: string) => {
    switch (filterType) {
      case '价格':
        setShowPriceFilter(!showPriceFilter)
        setShowRoomTypeFilter(false)
        setShowSortFilter(false)
        break
      case '房型':
        setShowRoomTypeFilter(!showRoomTypeFilter)
        setShowPriceFilter(false)
        setShowSortFilter(false)
        break
      case '精选':
        setShowSortFilter(!showSortFilter)
        setShowPriceFilter(false)
        setShowRoomTypeFilter(false)
        break
      case '筛选':
        setShowFilterDropdown(!showFilterDropdown)
        setFilterArrowUp(!filterArrowUp)
        break
      default:
        if (!selectedFilters.includes(filterType)) {
          setSelectedFilters([...selectedFilters, filterType])
          showToast({
            title: `已选择${filterType}`,
            icon: 'success',
            duration: 1500,
          })
        }
        break
    }
  }

  const handleRemoveFilter = (filterType: string) => {
    setSelectedFilters(
      selectedFilters.filter((filter) => filter !== filterType)
    )
    showToast({
      title: `已取消${filterType}`,
      icon: 'success',
      duration: 1500,
    })
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

  const hotelName = hotel.name || hotel.hotelNameCn || '未知酒店'
  const hotelImages = hotel.images || []
  const hotelRating = hotel.rating || hotel.score || 4.5
  const hotelReviewCount = hotel.reviewCount || 0
  const hotelAddress = hotel.address || hotel.hotelAddress || ''
  const roomTypes = hotel.roomTypes || []
  const facilities = hotel.facilities || []
  const policies = hotel.policies || {}
  const nearbyAttractions = hotel.nearbyAttractions || []
  const transportations = hotel.transportations || []
  const shoppingMalls = hotel.shoppingMalls || []

  // 直接计算价格数据，不使用useMemo
  const getPriceData = () => {
    // 使用第一个房间的价格作为所有日期的价格
    const basePrice = roomTypes[0]?.price || roomTypes[0]?.currentPrice || 400
    const priceData: Record<string, number> = {}
    // 生成当前月份和下一个月的价格数据
    const currentMonth = dayjs()
    const nextMonth = dayjs().add(1, 'month')

    // 生成当前月份的价格数据
    const daysInCurrentMonth = currentMonth.daysInMonth()
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const dateStr = currentMonth.date(i).format('YYYY-MM-DD')
      priceData[dateStr] = basePrice
    }

    // 生成下一个月的价格数据
    const daysInNextMonth = nextMonth.daysInMonth()
    for (let i = 1; i <= daysInNextMonth; i++) {
      const dateStr = nextMonth.date(i).format('YYYY-MM-DD')
      priceData[dateStr] = basePrice
    }

    return priceData
  }
  const calendarPriceData = getPriceData()

  return (
    <View className="hotel-detail-page">
      <HotelDetailHeader onBack={handleBack} />

      <ScrollView className="detail-content" scrollY>
        <ImageCarousel images={hotelImages} onImageClick={handleImageClick} />
        
        <View className="carousel-tabs">
          <Text className="tab-item active">封面</Text>
          <Text className="tab-item">精选</Text>
          <Text className="tab-item">位置</Text>
          <Text className="tab-item">点评</Text>
          <Text className="tab-item">相册</Text>
        </View>

        <HotelInfo
          name={hotelName}
          starRating={hotel.starRating || 5}
          address={hotelAddress}
          rating={hotelRating}
          reviewCount={hotelReviewCount}
        />

        <ServiceTags
          facilities={facilities}
          onPolicyClick={() => setShowPolicyPopup(true)}
        />

        <View className="review-map-container">
          <View className="review-section">
            <View className="review-header">
              <Text className="review-title">用户评价</Text>
              <Text className="review-count">{hotelReviewCount}条点评</Text>
            </View>
            <View className="review-content">
              <Text className="review-rating">{hotelRating}</Text>
              <Text className="review-label">很好</Text>
              <Text className="review-tags">安静舒适 交通便利 服务周到</Text>
            </View>
          </View>

          <View className="map-section">
            <View className="map-header">
              <Text className="map-title">酒店位置</Text>
            </View>
            <View className="map-content">
              <Text className="location-text">{hotelAddress}</Text>
              <View className="map-btn">
                <View className="map-icon">
                  <EnvironmentOutline color="#666" />
                </View>
                <Text className="map-text">查看地图</Text>
              </View>
            </View>
          </View>
        </View>

        {(hotel.discounts || []).length > 0 && (
          <View className="promotion-section">
            {hotel.discounts.map((discount: any, index: number) => (
              <View key={index} className="promotion-item">
                <View className="promotion-icon">
                  <FireFill color="#ff4d4f" />
                </View>
                <Text className="promotion-text">
                  {discount.name}: {discount.description}
                </Text>
              </View>
            ))}
          </View>
        )}

        {(nearbyAttractions.length > 0 ||
          transportations.length > 0 ||
          shoppingMalls.length > 0) && (
          <View className="nearby-section">
            <Text className="section-title">周边信息</Text>

            {nearbyAttractions.length > 0 && (
              <View className="nearby-group">
                <View className="nearby-header">
                  <LocationOutline color="#1890ff" fontSize={16} />
                  <Text className="nearby-title">周边景点</Text>
                </View>
                <View className="nearby-list">
                  {nearbyAttractions
                    .slice(0, 3)
                    .map((item: any, index: number) => (
                      <View key={index} className="nearby-item">
                        <Text className="nearby-name">{item.name}</Text>
                        {item.distance && (
                          <Text className="nearby-distance">
                            {item.distance}
                          </Text>
                        )}
                      </View>
                    ))}
                </View>
              </View>
            )}

            {transportations.length > 0 && (
              <View className="nearby-group">
                <View className="nearby-header">
                  <TravelOutline color="#1890ff" fontSize={16} />
                  <Text className="nearby-title">交通出行</Text>
                </View>
                <View className="nearby-list">
                  {transportations
                    .slice(0, 3)
                    .map((item: any, index: number) => {
                      const IconComponent = getTransportIcon(item.type)
                      return (
                        <View key={index} className="nearby-item">
                          <View className="transport-item">
                            <IconComponent color="#666" fontSize={14} />
                            <Text className="nearby-name">{item.name}</Text>
                          </View>
                          {item.distance && (
                            <Text className="nearby-distance">
                              {item.distance}
                            </Text>
                          )}
                        </View>
                      )
                    })}
                </View>
              </View>
            )}

            {shoppingMalls.length > 0 && (
              <View className="nearby-group">
                <View className="nearby-header">
                  <ShopbagOutline color="#1890ff" fontSize={16} />
                  <Text className="nearby-title">购物商场</Text>
                </View>
                <View className="nearby-list">
                  {shoppingMalls.slice(0, 3).map((item: any, index: number) => (
                    <View key={index} className="nearby-item">
                      <Text className="nearby-name">{item.name}</Text>
                      {item.distance && (
                        <Text className="nearby-distance">{item.distance}</Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        <DatePriceSelector
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          roomCount={roomCount}
          adultCount={adultCount}
          childCount={childCount}
          selectedFilters={selectedFilters}
          onDateClick={() => setShowCalendar(true)}
          onGuestClick={() => setShowGuestPicker(true)}
          onFilterTagClick={handleFilterTagClick}
          onRemoveFilter={handleRemoveFilter}
        />

        <RoomList
          rooms={roomTypes}
          roomCount={roomCount}
          onBookNow={handleBookNow}
          hotelImages={hotelImages}
        />
      </ScrollView>

      <CalendarPicker
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        onConfirm={handleDateConfirm}
        defaultStartDate={checkInDate}
        defaultEndDate={checkOutDate}
        title="选择入住日期"
        priceData={calendarPriceData}
        holidayData={{
          '2026-02-23': { type: 'holiday', name: '春节' },
          '2026-02-24': { type: 'rest' },
          '2026-03-01': { type: 'work' },
        }}
        lowestPriceData={['2026-02-25', '2026-02-29', '2026-03-02']}
        showPrice
      />

      <GuestSelectionPopup
        visible={showGuestPicker}
        onClose={() => setShowGuestPicker(false)}
        value={guestInfo}
        onChange={handleGuestChange}
      />

      <PolicyPopup
        visible={showPolicyPopup}
        onClose={() => setShowPolicyPopup(false)}
        policies={policies}
        hotelName={hotelName}
      />
    </View>
  )
}
