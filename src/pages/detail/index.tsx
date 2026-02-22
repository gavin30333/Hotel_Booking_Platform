import {
  View,
  Text,
  ScrollView,
  Image,
  Swiper,
  SwiperItem,
} from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro, { useRouter, showToast } from '@tarojs/taro'
import { getHotelDetail } from '@/services/hotel'
import {
  LeftOutline,
  HeartOutline,
  PhonebookOutline,
  ShopbagOutline,
  MoreOutline,
  FireFill,
  EnvironmentOutline,
  AppstoreOutline,
  UserOutline,
  SmileOutline,
  GlobalOutline,
  TruckOutline,
  ScanningFaceOutline,
  GiftOutline,
  LocationOutline,
  TravelOutline,
  ClockCircleOutline,
  SetOutline,
} from 'antd-mobile-icons'
import { CalendarPicker } from '@/components/common/CalendarPicker'
import { PolicyPopup } from '@/components/common/PolicyPopup'
import { GuestSelectionPopup } from '@/components/FieldRenderers/GuestField/components/GuestSelectionPopup'
import { GuestInfo } from '@/types/query.types'
import './index.less'

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
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [draggedHandle, setDraggedHandle] = useState<'min' | 'max' | null>(null)

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

  const getNightsCount = () => {
    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getFacilityIcon = (facility: string) => {
    const facilityLower = facility.toLowerCase()
    if (
      facilityLower.includes('wifi') ||
      facilityLower.includes('网络') ||
      facilityLower.includes('无线')
    ) {
      return GlobalOutline
    }
    if (
      facilityLower.includes('停车') ||
      facilityLower.includes('车位') ||
      facilityLower.includes('车库')
    ) {
      return TruckOutline
    }
    if (
      facilityLower.includes('早餐') ||
      facilityLower.includes('餐厅') ||
      facilityLower.includes('餐饮')
    ) {
      return GiftOutline
    }
    if (
      facilityLower.includes('健身') ||
      facilityLower.includes('泳池') ||
      facilityLower.includes('运动')
    ) {
      return ScanningFaceOutline
    }
    if (
      facilityLower.includes('前台') ||
      facilityLower.includes('服务') ||
      facilityLower.includes('接待')
    ) {
      return SmileOutline
    }
    if (facilityLower.includes('空调') || facilityLower.includes('暖气')) {
      return SetOutline
    }
    if (facilityLower.includes('洗浴') || facilityLower.includes('淋浴')) {
      return ClockCircleOutline
    }
    return FireFill
  }

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'subway':
      case 'highspeed':
      case 'train':
        return TravelOutline
      case 'bus':
        return TruckOutline
      case 'airport':
        return GlobalOutline
      default:
        return LocationOutline
    }
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

  const handlePriceSliderStart = (handle: 'min' | 'max') => (e: any) => {
    e.stopPropagation()
    setIsDragging(true)
    setDraggedHandle(handle)
    document.addEventListener('mousemove', handlePriceSliderMove)
    document.addEventListener('mouseup', handlePriceSliderEnd)
    document.addEventListener('touchmove', handlePriceSliderMove)
    document.addEventListener('touchend', handlePriceSliderEnd)
  }

  const handlePriceSliderMove = (e: any) => {
    if (!isDragging || !draggedHandle) return
    const slider = document.querySelector('.price-slider')
    if (!slider) return
    const rect = slider.getBoundingClientRect()
    let x: number
    if (e.touches) {
      x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width))
    } else if (e.clientX) {
      x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    } else {
      return
    }
    const percentage = x / rect.width
    const price = Math.round(percentage * 100)
    const roundedPrice = Math.round(price / 10) * 10
    setPriceRange((prev) => {
      if (draggedHandle === 'min') {
        return { min: Math.min(roundedPrice, prev.max - 10), max: prev.max }
      } else {
        return { min: prev.min, max: Math.max(roundedPrice, prev.min + 10) }
      }
    })
  }

  const handlePriceSliderEnd = () => {
    setIsDragging(false)
    setDraggedHandle(null)
    document.removeEventListener('mousemove', handlePriceSliderMove)
    document.removeEventListener('mouseup', handlePriceSliderEnd)
    document.removeEventListener('touchmove', handlePriceSliderMove)
    document.removeEventListener('touchend', handlePriceSliderEnd)
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

  return (
    <View className="hotel-detail-page">
      <View className="top-nav-bar">
        <View className="nav-left">
          <View className="back-btn" onClick={handleBack}>
            <LeftOutline color="#fff" />
          </View>
        </View>
        <View className="nav-right">
          <View className="nav-icon">
            <HeartOutline color="#fff" />
          </View>
          <View className="nav-icon">
            <PhonebookOutline color="#fff" />
          </View>
          <View className="nav-icon">
            <ShopbagOutline color="#fff" />
          </View>
          <View className="nav-icon">
            <MoreOutline color="#fff" />
          </View>
        </View>
      </View>

      <ScrollView className="detail-content" scrollY>
        <View className="image-carousel">
          <Swiper
            className="swiper"
            indicatorDots
            indicatorColor="rgba(255, 255, 255, 0.5)"
            indicatorActiveColor="#fff"
            autoplay
            interval={3000}
            duration={500}
          >
            {hotelImages.length > 0 ? (
              hotelImages.map((image: string, index: number) => (
                <SwiperItem key={index}>
                  <View
                    className="image-container"
                    onClick={() => handleImageClick(index)}
                  >
                    <Image
                      src={image}
                      mode="aspectFill"
                      className="carousel-image"
                    />
                  </View>
                </SwiperItem>
              ))
            ) : (
              <SwiperItem>
                <View className="image-container">
                  <Image
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
                    mode="aspectFill"
                    className="carousel-image"
                  />
                </View>
              </SwiperItem>
            )}
          </Swiper>
          <View className="carousel-tabs">
            <Text className="tab-item active">封面</Text>
            <Text className="tab-item">精选</Text>
            <Text className="tab-item">位置</Text>
            <Text className="tab-item">点评</Text>
            <Text className="tab-item">相册</Text>
          </View>
        </View>

        <View className="hotel-header-info">
          <View>
            <Text className="hotel-name">{hotelName}</Text>
            <Text className="hotel-badge">{hotel.starRating || 5}星级酒店</Text>
            <Text className="hotel-ranking">{hotelAddress}</Text>
          </View>
          <View className="hotel-rating">
            <Text className="rating">{hotelRating}</Text>
            <Text className="rating-label">很好</Text>
            <Text className="review-count">{hotelReviewCount}条点评</Text>
          </View>
        </View>

        <View className="service-tags-container">
          <ScrollView className="service-tags-scroll" scrollX>
            <View className="service-tags">
              {facilities.slice(0, 8).map((facility: string, index: number) => {
                const IconComponent = getFacilityIcon(facility)
                return (
                  <View key={index} className="service-tag">
                    <View className="tag-icon">
                      <IconComponent color="#1890ff" fontSize={20} />
                    </View>
                    <Text className="tag-text">{facility}</Text>
                  </View>
                )
              })}
            </View>
          </ScrollView>
          <View
            className="facility-policy"
            onClick={() => setShowPolicyPopup(true)}
          >
            <Text className="policy-text">设施政策</Text>
          </View>
        </View>

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

        <View className="date-price-section">
          <View className="date-price-main">
            <View
              className="date-section"
              onClick={() => setShowCalendar(true)}
            >
              <View className="date-combined">
                <View className="date-part">
                  <View className="date-item">
                    <Text className="date-label today">
                      {checkInDate === today.toISOString().split('T')[0]
                        ? '今天'
                        : '入住'}
                    </Text>
                    <Text className="date-value">
                      {(() => {
                        const checkIn = new Date(checkInDate)
                        return `${checkIn.getMonth() + 1}月${checkIn.getDate()}日`
                      })()}
                    </Text>
                  </View>
                  <View className="date-separator">
                    <Text className="separator-text">-</Text>
                  </View>
                  <View className="date-item">
                    <Text className="date-label tomorrow">
                      {checkOutDate === tomorrow.toISOString().split('T')[0]
                        ? '明天'
                        : '退房'}
                    </Text>
                    <Text className="date-value">
                      {(() => {
                        const checkOut = new Date(checkOutDate)
                        return `${checkOut.getMonth() + 1}月${checkOut.getDate()}日`
                      })()}
                    </Text>
                    <View className="low-price-badge">
                      <Text className="low-price-text">看低价</Text>
                    </View>
                  </View>
                </View>
                <View className="night-count">
                  <Text className="night-count-text">
                    共{getNightsCount()}晚
                  </Text>
                </View>
              </View>
            </View>
            <View className="divider"></View>
            <View
              className="guest-section"
              onClick={() => setShowGuestPicker(true)}
            >
              <View className="guest-combined">
                <Text className="guest-label">间数人数</Text>
                <View className="guest-value">
                  <Text>{roomCount}</Text>
                  <AppstoreOutline
                    style={{
                      marginLeft: '4px',
                      marginRight: '4px',
                      fontSize: '14px',
                    }}
                  />
                  <Text>{adultCount}</Text>
                  <UserOutline
                    style={{
                      marginLeft: '4px',
                      marginRight: '4px',
                      fontSize: '14px',
                    }}
                  />
                  <Text>{childCount}</Text>
                  <SmileOutline
                    style={{
                      marginLeft: '4px',
                      marginRight: '4px',
                      fontSize: '14px',
                    }}
                  />
                </View>
              </View>
            </View>
          </View>

          <View className="filter-tags-container">
            <ScrollView scrollX>
              <View
                className="filter-tag"
                onClick={(e) => {
                  e.stopPropagation()
                  handleFilterTagClick('价格')
                }}
              >
                <Text className="filter-tag-text">¥100以上</Text>
                <Text className="filter-tag-arrow">▼</Text>
              </View>
              <View
                className={`filter-tag ${selectedFilters.includes('双床房') ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleFilterTagClick('双床房')
                }}
              >
                <Text className="filter-tag-text">双床房</Text>
                {selectedFilters.includes('双床房') && (
                  <Text
                    className="filter-tag-close"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFilter('双床房')
                    }}
                  >
                    ×
                  </Text>
                )}
              </View>
              <View
                className={`filter-tag ${selectedFilters.includes('大床房') ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleFilterTagClick('大床房')
                }}
              >
                <Text className="filter-tag-text">大床房</Text>
                {selectedFilters.includes('大床房') && (
                  <Text
                    className="filter-tag-close"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFilter('大床房')
                    }}
                  >
                    ×
                  </Text>
                )}
              </View>
            </ScrollView>
            <View
              className="filter-button"
              onClick={(e) => {
                e.stopPropagation()
                setShowFilterDropdown(!showFilterDropdown)
                setFilterArrowUp(!filterArrowUp)
              }}
            >
              <Text className="filter-button-text">筛选</Text>
              <Text className="filter-button-arrow">
                {filterArrowUp ? '▲' : '▼'}
              </Text>
            </View>
          </View>
        </View>

        <View className="rooms-section">
          {roomTypes.map((room: any, index: number) => (
            <View key={room.id || room._id || index} className="room-item">
              <View className="room-image">
                <Image
                  src={
                    room.images?.[0] ||
                    hotelImages[0] ||
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
                  }
                  mode="aspectFill"
                  className="room-img"
                />
                {index === 0 && (
                  <View className="sales-tag">
                    <Text className="sales-tag-text">本店销量No.1</Text>
                  </View>
                )}
              </View>
              <View className="room-info">
                <Text className="room-name">
                  {room.name || room.roomTypeName}
                </Text>
                <Text className="room-description">
                  {room.description || '舒适温馨的客房'}
                </Text>
                <Text className="room-detail">
                  {room.bedType || '大床'} {room.area || 30}㎡{' '}
                  {room.maxOccupancy || 2}人入住
                </Text>
                <Text className="room-notice">
                  {room.breakfast ? '含早餐' : '无早餐'}{' '}
                  入住当天18:00前可免费取消
                </Text>
                <View className="room-bottom">
                  <View className="room-price">
                    {room.originalPrice && (
                      <Text className="price-original">
                        ¥{room.originalPrice}
                      </Text>
                    )}
                    <Text className="price-current">
                      ¥{room.price || room.currentPrice}
                    </Text>
                  </View>
                  <View className="room-booking">
                    <View className="room-count">
                      <Text className="count-text">{roomCount}间</Text>
                      <Text className="count-arrow">▼</Text>
                    </View>
                    <View
                      className="book-btn"
                      onClick={() => handleBookNow(index)}
                    >
                      <Text className="book-btn-text">订</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <CalendarPicker
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        onConfirm={handleDateConfirm}
        defaultStartDate={checkInDate}
        defaultEndDate={checkOutDate}
        title="选择入住日期"
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
