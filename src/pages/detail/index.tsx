import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useEffect, useRef, useMemo } from 'react'
import Taro, { useRouter, showToast, usePageScroll } from '@tarojs/taro'
import ImageCarousel from '@/components/common/display/ImageCarousel'
import { getHotelDetail } from '@/services/hotel'
import { getCarouselImages } from '@/mock/carousel'
import dayjs from 'dayjs'
import {
  FireFill,
  EnvironmentOutline,
  ShopbagOutline,
  TravelOutline,
  LocationOutline,
} from 'antd-mobile-icons'
import { CalendarPicker } from '@/components/common/form/CalendarPicker'
import {
  PolicyPopup,
  GuestSelectionPopup,
  DiscountPopup,
} from '@/components/common/popup'
import { GuestInfo } from '@/types/query.types'
import { getTransportIcon } from './utils'
import {
  DEFAULT_HOTEL_RATING,
  DEFAULT_RATING_LABEL,
  DEFAULT_REVIEW_TAGS,
  DEFAULT_DISTANCE_TEXT,
  DEFAULT_OPENING_DATE,
  HOLIDAY_DATA,
  LOWEST_PRICE_DATA,
} from './constants'
import './DetailPage.less'

import HotelDetailHeader from './components/HotelDetailHeader'

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
  const [showDiscountPopup, setShowDiscountPopup] = useState(false)
  const [showPriceFilter, setShowPriceFilter] = useState(false)
  const [showRoomTypeFilter, setShowRoomTypeFilter] = useState(false)
  const [showSortFilter, setShowSortFilter] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [filterArrowUp, setFilterArrowUp] = useState(false)

  const [isDatePriceFixed, setIsDatePriceFixed] = useState(false)
  const datePriceSectionTop = useRef(0)
  const isDatePriceFixedRef = useRef(false)
  const TOP_NAV_BAR_HEIGHT = 56

  // Use memo to prevent re-generating mock data on every render
  const carouselData = useMemo(() => {
    if (!hotel) return []
    return getCarouselImages(hotel.images || [])
  }, [hotel])

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

  const handleBookNow = (roomIndex: number, breakfastCount?: number) => {
    const selectedRoom = hotel.roomTypes?.[roomIndex]
    if (!selectedRoom) {
      showToast({
        title: '请选择房型',
        icon: 'none',
      })
      return
    }

    const isLoggedIn = Taro.getStorageSync('isLoggedIn')
    if (!isLoggedIn) {
      showToast({
        title: '请先登录后操作',
        icon: 'none',
        duration: 1500,
      })

      const fromPage = `/pages/booking/index?hotelId=${hotelId}&roomTypeId=${roomIndex}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&breakfastCount=${breakfastCount || 0}`
      Taro.navigateTo({
        url: `/pages/login/index?fromPage=${encodeURIComponent(fromPage)}`,
      })
      return
    }

    Taro.navigateTo({
      url: `/pages/booking/index?hotelId=${hotelId}&roomTypeId=${roomIndex}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&breakfastCount=${breakfastCount || 0}`,
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

  usePageScroll((res) => {
    const scrollTop = res.scrollTop
    const datePriceThreshold = datePriceSectionTop.current - TOP_NAV_BAR_HEIGHT

    if (scrollTop > datePriceThreshold && !isDatePriceFixedRef.current) {
      setIsDatePriceFixed(true)
      isDatePriceFixedRef.current = true
    } else if (scrollTop <= datePriceThreshold && isDatePriceFixedRef.current) {
      setIsDatePriceFixed(false)
      isDatePriceFixedRef.current = false
    }
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      Taro.createSelectorQuery()
        .select('.date-price-card')
        .boundingClientRect((rect: any) => {
          if (rect) {
            datePriceSectionTop.current = rect.top + (window?.scrollY || 0)
          }
        })
        .exec()
    }, 500)

    return () => clearTimeout(timer)
  }, [hotel])

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
  const hotelRating = hotel.rating || hotel.score || DEFAULT_HOTEL_RATING
  const hotelReviewCount = hotel.reviewCount || 0
  const hotelAddress = hotel.address || hotel.hotelAddress || ''
  const roomTypes = hotel.roomTypes || []
  const facilities = hotel.facilities || []
  const policies = hotel.policies || {}
  const nearbyAttractions = hotel.nearbyAttractions || []
  const transportations = hotel.transportations || []
  const shoppingMalls = hotel.shoppingMalls || []

  const getPriceData = () => {
    const basePrice = roomTypes[0]?.price || roomTypes[0]?.currentPrice || 400
    const priceData: Record<string, number> = {}
    const currentMonth = dayjs()
    const nextMonth = dayjs().add(1, 'month')

    const daysInCurrentMonth = currentMonth.daysInMonth()
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const dateStr = currentMonth.date(i).format('YYYY-MM-DD')
      priceData[dateStr] = basePrice
    }

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
      <HotelDetailHeader onBack={handleBack} hotelName={hotelName} />

      <ScrollView className="detail-content" scrollY>
        <ImageCarousel
          images={hotelImages}
          items={carouselData}
          onImageClick={handleImageClick}
        />

        <HotelInfo
          name={hotelName}
          starRating={hotel.starRating || 5}
          openingDate={hotel.openingDate || DEFAULT_OPENING_DATE}
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
              <View className="rating-badge">
                <Text className="rating-value">{DEFAULT_HOTEL_RATING}</Text>
              </View>
              <Text className="rating-label">{DEFAULT_RATING_LABEL}</Text>
              <Text className="review-count">{hotelReviewCount}条&gt;</Text>
            </View>
            <View className="review-content">
              <Text className="review-tags">"{DEFAULT_REVIEW_TAGS}"</Text>
            </View>
          </View>

          <View className="map-section">
            <View className="map-content">
              <View className="location-info">
                <Text className="address-text">{hotelAddress}</Text>
                <Text className="distance-text">{DEFAULT_DISTANCE_TEXT}</Text>
              </View>
              <View className="map-icon-container">
                <View className="map-icon">
                  <EnvironmentOutline className="map-icon-svg" />
                </View>
                <Text className="map-text">地图</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="date-price-card">
          {(hotel.discounts || []).length > 0 && (
            <View className="promotion-section">
              <ScrollView className="promotion-scroll" scrollX>
                <View className="promotion-tags">
                  {hotel.discounts.map((discount: any, index: number) => (
                    <View key={index} className="promotion-tag">
                      <View className="promotion-icon">
                        <FireFill color="#ff7a45" />
                      </View>
                      <Text className="promotion-text">
                        {discount.name}: {discount.description}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
              <View
                className="promotion-more"
                onClick={() => setShowDiscountPopup(true)}
              >
                <Text className="more-text">更多优惠</Text>
              </View>
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
        </View>

        <RoomList
          rooms={roomTypes}
          roomCount={roomCount}
          onBookNow={handleBookNow}
          onRoomCountChange={setRoomCount}
          hotelImages={hotelImages}
        />

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
      </ScrollView>

      <CalendarPicker
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        onConfirm={handleDateConfirm}
        defaultStartDate={checkInDate}
        defaultEndDate={checkOutDate}
        title="选择入住日期"
        priceData={calendarPriceData}
        holidayData={HOLIDAY_DATA}
        lowestPriceData={LOWEST_PRICE_DATA}
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

      <DiscountPopup
        visible={showDiscountPopup}
        onClose={() => setShowDiscountPopup(false)}
        discounts={hotel.discounts || []}
        hotelName={hotelName}
      />
    </View>
  )
}
