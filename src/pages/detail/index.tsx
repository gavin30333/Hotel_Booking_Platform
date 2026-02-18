import {
  View,
  Text,
  ScrollView,
  Image,
  Swiper,
  SwiperItem,
} from '@tarojs/components'
import { useState, useEffect } from 'react'
import { useRouter, showToast } from '@tarojs/taro'
import { getHotelDetail } from '@/services/hotel'
import {
  LeftOutline,
  HeartOutline,
  PhonebookOutline,
  ShopbagOutline,
  MoreOutline,
  GiftOutline,
  EnvironmentOutline,
  FireFill,
  GlobalOutline,
  SetOutline,
  TruckOutline,
  ClockCircleOutline,
  AppstoreOutline,
  UserOutline,
  SmileOutline,
} from 'antd-mobile-icons'
import './index.less'

export default function HotelDetailPage() {
  const router = useRouter()
  const hotelId = router.params.id as string
  const [hotel, setHotel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checkInDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [checkOutDate] = useState<string>(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  })
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
      setHotel(response.data)
    } catch (error) {
      console.error('Failed to fetch hotel detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookNow = (roomIndex: number) => {
    const selectedRoom = hotel.rooms?.[roomIndex]
    if (!selectedRoom) {
      showToast({
        title: '请选择房型',
        icon: 'none',
      })
      return
    }

    showToast({
      title: `预订成功！\n房型：${selectedRoom.name}\n价格：¥${selectedRoom.price}/晚\n入住：${checkInDate}\n退房：${checkOutDate}`,
      icon: 'success',
      duration: 3000,
    })
  }

  const handleImageClick = (index: number) => {
    showToast({
      title: `查看图片 ${index + 1}`,
      icon: 'none',
      duration: 1500,
    })
  }

  // 处理筛选标签点击
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
        // 处理具体的筛选选项
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

  // 处理筛选标签移除
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

  // 价格滑块事件处理
  const handlePriceSliderStart = (handle: 'min' | 'max') => (e: any) => {
    e.stopPropagation()
    setIsDragging(true)
    setDraggedHandle(handle)

    // 添加鼠标事件监听器
    document.addEventListener('mousemove', handlePriceSliderMove)
    document.addEventListener('mouseup', handlePriceSliderEnd)
    // 添加触摸事件监听器
    document.addEventListener('touchmove', handlePriceSliderMove)
    document.addEventListener('touchend', handlePriceSliderEnd)
  }

  const handlePriceSliderMove = (e: any) => {
    if (!isDragging || !draggedHandle) return

    const slider = document.querySelector('.price-slider')
    if (!slider) return

    const rect = slider.getBoundingClientRect()
    let x: number

    // 处理鼠标事件和触摸事件
    if (e.touches) {
      // 触摸事件
      x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width))
    } else if (e.clientX) {
      // 鼠标事件
      x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    } else {
      return
    }

    const percentage = x / rect.width
    const price = Math.round(percentage * 100) // Max price is 100
    const roundedPrice = Math.round(price / 10) * 10 // Round to nearest 10

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

    // 移除鼠标事件监听器
    document.removeEventListener('mousemove', handlePriceSliderMove)
    document.removeEventListener('mouseup', handlePriceSliderEnd)
    // 移除触摸事件监听器
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

  return (
    <View className="hotel-detail-page">
      {/* 顶部导航栏 */}
      <View className="top-nav-bar">
        <View className="nav-left">
          <View className="back-btn">
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

      {/* 酒店基本信息 */}
      <ScrollView className="detail-content" scrollY>
        {/* 图片轮播 */}
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
            {hotel.images?.map((image: string, index: number) => (
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
            )) || (
              <SwiperItem>
                <View
                  className="image-container"
                  onClick={() => handleImageClick(0)}
                >
                  <Image
                    src={hotel.imageUrl}
                    mode="aspectFill"
                    className="carousel-image"
                  />
                </View>
              </SwiperItem>
            )}
          </Swiper>
          {/* 胶囊状标签 */}
          <View className="carousel-tabs">
            <Text className="tab-item active">封面</Text>
            <Text className="tab-item">精选</Text>
            <Text className="tab-item">位置</Text>
            <Text className="tab-item">点评</Text>
            <Text className="tab-item">相册</Text>
          </View>
        </View>
        {/* 酒店名称和评分 */}
        <View className="hotel-header-info">
          <View>
            <Text className="hotel-name">{hotel.name}</Text>
            <Text className="hotel-badge">2025年开业</Text>
            <Text className="hotel-ranking">
              上海新国际博览中心经济型酒店热卖 No.2
            </Text>
          </View>
          <View className="hotel-rating">
            <Text className="rating">{hotel.rating}</Text>
            <Text className="rating-label">很好</Text>
            <Text className="review-count">{hotel.reviewCount}条点评</Text>
          </View>
        </View>

        {/* 标签服务 */}
        <View className="service-tags-container">
          <ScrollView className="service-tags-scroll" scrollX>
            <View className="service-tags">
              <View className="service-tag">
                <View className="tag-icon">
                  <TruckOutline color="#666" />
                </View>
                <Text className="tag-text">免费行李寄存</Text>
              </View>
              <View className="service-tag">
                <View className="tag-icon">
                  <GlobalOutline color="#666" />
                </View>
                <Text className="tag-text">免费客房WiFi</Text>
              </View>
              <View className="service-tag">
                <View className="tag-icon">
                  <GiftOutline color="#666" />
                </View>
                <Text className="tag-text">家庭房</Text>
              </View>
              <View className="service-tag">
                <View className="tag-icon">
                  <ClockCircleOutline color="#666" />
                </View>
                <Text className="tag-text">洗衣房</Text>
              </View>
              <View className="service-tag">
                <View className="tag-icon">
                  <SetOutline color="#666" />
                </View>
                <Text className="tag-text">智能客控</Text>
              </View>
              <View className="service-tag">
                <View className="tag-icon">
                  <SetOutline color="#666" />
                </View>
                <Text className="tag-text">机器人服务</Text>
              </View>
              <View className="service-tag">
                <View className="tag-icon">
                  <TruckOutline color="#666" />
                </View>
                <Text className="tag-text">租车服务</Text>
              </View>
              <View className="service-tag">
                <View className="tag-icon">
                  <ClockCircleOutline color="#666" />
                </View>
                <Text className="tag-text">24小时前台</Text>
              </View>
              <View className="service-tag">
                <View className="tag-icon">
                  <TruckOutline color="#666" />
                </View>
                <Text className="tag-text">停车场</Text>
              </View>
            </View>
          </ScrollView>
          <View className="facility-policy">
            <Text className="policy-text">设施政策</Text>
          </View>
        </View>

        {/* 评价和地图区域 */}
        <View className="review-map-container">
          {/* 评价区域 */}
          <View className="review-section">
            <View className="review-header">
              <Text className="review-title">用户评价</Text>
              <Text className="review-count">{hotel.reviewCount}条点评</Text>
            </View>
            <View className="review-content">
              <Text className="review-rating">{hotel.rating}</Text>
              <Text className="review-label">很好</Text>
              <Text className="review-tags">安静舒适 交通便利 服务周到</Text>
            </View>
          </View>

          {/* 地图区域 */}
          <View className="map-section">
            <View className="map-header">
              <Text className="map-title">酒店位置</Text>
            </View>
            <View className="map-content">
              <Text className="location-text">距德平路地铁站步行690米</Text>
              <Text className="address-text">浦东新区灵山路</Text>
              <View className="map-btn">
                <View className="map-icon">
                  <EnvironmentOutline color="#666" />
                </View>
                <Text className="map-text">查看地图</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 优惠信息 */}
        <View className="promotion-section">
          <View className="promotion-item">
            <View className="promotion-icon">
              <FireFill color="#ff4d4f" />
            </View>
            <Text className="promotion-text">火车新客券减10</Text>
          </View>
        </View>

        {/* 日期价格部分 */}
        <View className="date-price-section">
          {/* 日期价格主容器 */}
          <View className="date-price-main">
            {/* 左侧日期部分 */}
            <View className="date-section">
              {/* 日期标签和内容组合 */}
              <View className="date-combined">
                <View className="date-part">
                  {/* 今天和起始日期 */}
                  <View className="date-item">
                    <Text className="date-label today">今天</Text>

                    <Text className="date-value">
                      {(() => {
                        const checkIn = new Date(checkInDate)
                        return `${checkIn.getMonth() + 1}月${checkIn.getDate()}日`
                      })()}
                    </Text>
                  </View>

                  {/* 到 */}
                  <View className="date-separator">
                    <Text className="separator-text">-</Text>
                  </View>

                  {/* 明天和结束日期 */}
                  <View className="date-item">
                    <Text className="date-label tomorrow">明天</Text>

                    <Text className="date-value">
                      {(() => {
                        const checkOut = new Date(checkOutDate)
                        return `${checkOut.getMonth() + 1}月${checkOut.getDate()}日`
                      })()}
                    </Text>
                    {/* 看低价角标 */}
                    <View className="low-price-badge">
                      <Text className="low-price-text">看低价</Text>
                    </View>
                  </View>
                </View>

                {/* 共1晚 */}
                <View className="night-count">
                  <Text className="night-count-text">共1晚</Text>
                </View>
              </View>
            </View>

            {/* 分隔线 */}
            <View className="divider"></View>

            {/* 右侧人数部分 */}
            <View className="guest-section">
              {/* 人数标签和内容组合 */}
              <View className="guest-combined">
                <Text className="guest-label">间数人数</Text>
                <View className="guest-value">
                  <Text>1</Text>
                  <AppstoreOutline
                    style={{
                      marginLeft: '4px',
                      marginRight: '4px',
                      fontSize: '14px',
                    }}
                  />
                  <Text>1</Text>
                  <UserOutline
                    style={{
                      marginLeft: '4px',
                      marginRight: '4px',
                      fontSize: '14px',
                    }}
                  />
                  <Text>0</Text>
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

          {/* 筛选标签栏 */}
          <View className="filter-tags-container">
            <ScrollView scrollX>
              {/* 价格筛选 */}
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

              {/* 房型筛选 - 双床房 */}
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

              {/* 房型筛选 - 家庭房 */}
              <View
                className={`filter-tag ${selectedFilters.includes('家庭房') ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleFilterTagClick('家庭房')
                }}
              >
                <Text className="filter-tag-text">家庭房</Text>
                {selectedFilters.includes('家庭房') && (
                  <Text
                    className="filter-tag-close"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFilter('家庭房')
                    }}
                  >
                    ×
                  </Text>
                )}
              </View>

              {/* 房型筛选 - 大床房 */}
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

              {/* 特色服务 - 外卖 */}
              <View
                className={`filter-tag ${selectedFilters.includes('外卖') ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleFilterTagClick('外卖')
                }}
              >
                <Text className="filter-tag-text">外卖</Text>
                {selectedFilters.includes('外卖') && (
                  <Text
                    className="filter-tag-close"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFilter('外卖')
                    }}
                  >
                    ×
                  </Text>
                )}
              </View>

              {/* 排序筛选 */}
              <View
                className="filter-tag"
                onClick={(e) => {
                  e.stopPropagation()
                  handleFilterTagClick('精选')
                }}
              >
                <Text className="filter-tag-text">精选</Text>
                <Text className="filter-tag-arrow">▼</Text>
              </View>
            </ScrollView>
            {/* 右侧筛选按钮 */}
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

          {/* 筛选遮罩层 */}
          {showFilterDropdown && (
            <View
              className="filter-overlay"
              onClick={() => setShowFilterDropdown(false)}
            />
          )}

          {/* 筛选下拉框 */}
          {showFilterDropdown && (
            <View className="filter-dropdown">
              {/* 房型 */}
              <View className="filter-category">
                <View className="filter-category-header">
                  <Text className="filter-category-title">房型</Text>
                </View>
                <View className="filter-options-grid">
                  <View className="filter-option">
                    <Text className="filter-option-text">双床房</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">大床房</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">套房</Text>
                  </View>
                </View>
              </View>

              {/* 特色房型：家庭房 */}
              <View className="filter-category">
                <View className="filter-category-header">
                  <Text className="filter-category-title">特色房型</Text>
                </View>
                <View className="filter-options-grid">
                  <View className="filter-option">
                    <Text className="filter-option-text">家庭房</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">亲子房</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">无烟房</Text>
                  </View>
                </View>
              </View>

              {/* 卧室数 */}
              <View className="filter-category">
                <View className="filter-category-header">
                  <Text className="filter-category-title">卧室数</Text>
                </View>
                <View className="filter-options-grid">
                  <View className="filter-option">
                    <Text className="filter-option-text">1室</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">2室</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">3室+</Text>
                  </View>
                </View>
              </View>

              {/* 客房设施 */}
              <View className="filter-category">
                <View className="filter-category-header">
                  <Text className="filter-category-title">客房设施</Text>
                </View>
                <View className="filter-options-grid">
                  <View className="filter-option">
                    <Text className="filter-option-text">免费WiFi</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">空调</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">电视</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">冰箱</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">洗衣机</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">微波炉</Text>
                  </View>
                </View>
              </View>

              {/* 价格 */}
              <View className="filter-category">
                <View className="filter-category-header">
                  <Text className="filter-category-title">价格</Text>
                </View>
                <View className="price-slider-section">
                  {/* 价格滑块 */}
                  <View style={{ padding: '0 24px', marginBottom: '16px' }}>
                    <View
                      className="price-slider"
                      style={{
                        height: '4px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '2px',
                        position: 'relative',
                      }}
                    >
                      <View
                        style={{
                          height: '4px',
                          backgroundColor: '#1890ff',
                          borderRadius: '2px',
                          position: 'absolute',
                          left: `${(priceRange.min / 100) * 100}%`,
                          width: `${((priceRange.max - priceRange.min) / 100) * 100}%`,
                        }}
                      ></View>
                      <View
                        style={{
                          position: 'absolute',
                          left: `${(priceRange.min / 100) * 100}%`,
                          top: '-6px',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: '#1890ff',
                          border: '2px solid #fff',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                          cursor: 'pointer',
                        }}
                        onTouchStart={handlePriceSliderStart('min')}
                      ></View>
                      <View
                        style={{
                          position: 'absolute',
                          left: `${(priceRange.max / 100) * 100}%`,
                          top: '-6px',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: '#1890ff',
                          border: '2px solid #fff',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                          cursor: 'pointer',
                        }}
                        onTouchStart={handlePriceSliderStart('max')}
                      ></View>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '12px',
                      }}
                    >
                      <Text style={{ fontSize: '12px', color: '#666' }}>
                        ¥0
                      </Text>
                      <Text style={{ fontSize: '12px', color: '#1890ff' }}>
                        ¥{priceRange.min}-¥{priceRange.max}
                      </Text>
                      <Text style={{ fontSize: '12px', color: '#666' }}>
                        ¥100以上
                      </Text>
                    </View>
                  </View>

                  {/* 价格输入区域 */}
                  <View
                    style={{
                      display: 'flex',
                      gap: '12px',
                      marginBottom: '16px',
                      padding: '0 24px',
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: '12px',
                          color: '#666',
                          marginBottom: '8px',
                        }}
                      >
                        最低价格
                      </Text>
                      <View
                        style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '4px',
                          padding: '8px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: '14px',
                            color: '#666',
                            marginRight: '8px',
                          }}
                        >
                          ¥
                        </Text>
                        <input
                          type="number"
                          value={priceRange.min}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0
                            const clampedValue = Math.max(
                              0,
                              Math.min(100, value)
                            )
                            const roundedValue =
                              Math.round(clampedValue / 10) * 10
                            setPriceRange((prev) => ({
                              min: Math.min(roundedValue, prev.max - 10),
                              max: prev.max,
                            }))
                          }}
                          style={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            fontSize: '14px',
                            color: '#333',
                          }}
                          min="0"
                          max="100"
                          step="10"
                        />
                      </View>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: '12px',
                          color: '#666',
                          marginBottom: '8px',
                        }}
                      >
                        最高价格
                      </Text>
                      <View
                        style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '4px',
                          padding: '8px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: '14px',
                            color: '#666',
                            marginRight: '8px',
                          }}
                        >
                          ¥
                        </Text>
                        <input
                          type="number"
                          value={priceRange.max}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0
                            const clampedValue = Math.max(
                              0,
                              Math.min(100, value)
                            )
                            const roundedValue =
                              Math.round(clampedValue / 10) * 10
                            setPriceRange((prev) => ({
                              min: prev.min,
                              max: Math.max(roundedValue, prev.min + 10),
                            }))
                          }}
                          style={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            fontSize: '14px',
                            color: '#333',
                          }}
                          min="0"
                          max="100"
                          step="10"
                        />
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginBottom: '16px',
                      padding: '0 24px',
                    }}
                  >
                    {['¥50以下', '¥50-80', '¥80-100', '¥100以上'].map(
                      (item, index) => (
                        <View
                          key={index}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #e0e0e0',
                            backgroundColor: '#f8f8f8',
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            // 根据选择的区间更新价格范围
                            if (item === '¥50以下') {
                              setPriceRange({ min: 0, max: 50 })
                            } else if (item === '¥50-80') {
                              setPriceRange({ min: 50, max: 80 })
                            } else if (item === '¥80-100') {
                              setPriceRange({ min: 80, max: 100 })
                            } else if (item === '¥100以上') {
                              setPriceRange({ min: 100, max: 100 })
                            }
                          }}
                        >
                          <Text style={{ fontSize: '12px', color: '#666' }}>
                            {item}
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                </View>
              </View>

              {/* 房间面积 */}
              <View className="filter-category">
                <View className="filter-category-header">
                  <Text className="filter-category-title">房间面积</Text>
                </View>
                <View className="filter-options-grid">
                  <View className="filter-option">
                    <Text className="filter-option-text">20㎡以下</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">20-30㎡</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">30-40㎡</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">40-50㎡</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">50㎡以上</Text>
                  </View>
                </View>
              </View>

              {/* 携程服务 */}
              <View className="filter-category">
                <View className="filter-category-header">
                  <Text className="filter-category-title">携程服务</Text>
                </View>
                <View className="filter-options-grid">
                  <View className="filter-option">
                    <Text className="filter-option-text">免费取消</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">闪住</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">可开发票</Text>
                  </View>
                </View>
              </View>

              {/* 发票 */}
              <View className="filter-category">
                <View className="filter-category-header">
                  <Text className="filter-category-title">发票</Text>
                </View>
                <View className="filter-options-grid">
                  <View className="filter-option">
                    <Text className="filter-option-text">
                      可开增值税专用发票
                    </Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">
                      可开增值税普通发票
                    </Text>
                  </View>
                </View>
              </View>

              {/* 优惠促销 */}
              <View className="filter-category">
                <View className="filter-category-header">
                  <Text className="filter-category-title">优惠促销</Text>
                </View>
                <View className="filter-options-grid">
                  <View className="filter-option">
                    <Text className="filter-option-text">限时特惠</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">新客立减</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">连住优惠</Text>
                  </View>
                </View>
              </View>

              {/* 支付方式 */}
              <View className="filter-category">
                <View className="filter-category-header">
                  <Text className="filter-category-title">支付方式</Text>
                </View>
                <View className="filter-options-grid">
                  <View className="filter-option">
                    <Text className="filter-option-text">在线支付</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">到店支付</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">信用卡</Text>
                  </View>
                </View>
              </View>

              {/* 适用人群 */}
              <View className="filter-category">
                <View className="filter-category-header">
                  <Text className="filter-category-title">适用人群</Text>
                </View>
                <View className="filter-options-grid">
                  <View className="filter-option">
                    <Text className="filter-option-text">商务出行</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">家庭旅游</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">情侣出游</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">亲子游</Text>
                  </View>
                  <View className="filter-option">
                    <Text className="filter-option-text">朋友聚会</Text>
                  </View>
                </View>
              </View>

              {/* 底部按钮 */}
              <View className="filter-buttons">
                <View
                  className="filter-button-clear"
                  onClick={() => {
                    setSelectedFilters([])
                    setPriceRange({ min: 0, max: 100 })
                  }}
                >
                  <Text className="filter-button-text">清除</Text>
                </View>
                <View
                  className="filter-button-confirm"
                  onClick={() => setShowFilterDropdown(false)}
                >
                  <Text className="filter-button-text">完成</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* 房型信息 */}
        <View className="rooms-section">
          {hotel.rooms?.map((room: any, index: number) => (
            <View key={index} className="room-item">
              <View className="room-image">
                <Image
                  src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=clean%20hotel%20room%20with%20comfortable%20bed&image_size=landscape_4_3"
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
                <Text className="room-name">{room.name}</Text>
                <Text className="room-description">{room.description}</Text>
                <Text className="room-detail">
                  {room.bedType} {room.size}㎡ 2人入住 2层
                </Text>
                <Text className="room-notice">
                  无早餐 入住当天18:00前可免费取消
                </Text>
                <View className="room-bottom">
                  <View className="room-price">
                    <Text className="price-original">¥160</Text>
                    <Text className="price-current">¥{room.price}</Text>
                  </View>
                  <View className="room-booking">
                    <View className="room-count">
                      <Text className="count-text">1间</Text>
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
    </View>
  )
}
