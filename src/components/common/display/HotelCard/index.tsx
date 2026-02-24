import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Image, Tag, Ellipsis, Space } from 'antd-mobile'
import { Hotel } from '@/services/hotel'
import { useHotelStore } from '@/store/hotelStore'
import dayjs from 'dayjs'
import './HotelCard.less'

interface HotelCardProps {
  hotel: Hotel
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const { filters } = useHotelStore()

  const handleCardClick = () => {
    const params = new URLSearchParams()
    params.append('id', hotel.id)
    if (filters.checkInDate) {
      params.append('checkInDate', filters.checkInDate)
    }
    if (filters.checkOutDate) {
      params.append('checkOutDate', filters.checkOutDate)
    }
    params.append('roomCount', String(filters.rooms || 1))
    params.append('adultCount', String(filters.adults || 2))
    params.append('childCount', String(filters.children || 0))

    Taro.navigateTo({
      url: `/pages/detail/index?${params.toString()}`,
    })
  }

  const calculateNights = () => {
    if (filters.checkInDate && filters.checkOutDate) {
      const start = dayjs(filters.checkInDate)
      const end = dayjs(filters.checkOutDate)
      const nights = end.diff(start, 'day')
      return nights > 0 ? nights : 0
    }
    return 0
  }

  const nights = calculateNights() || 2
  const totalPrice = nights * hotel.minPrice

  const getRatingLabel = (rating: number): string => {
    if (rating >= 4.8) return '超棒'
    if (rating >= 4.5) return '很棒'
    if (rating >= 4.0) return '棒'
    if (rating >= 3.5) return '不错'
    return '一般'
  }

  const displayData = {
    name: hotel.name,
    rating: hotel.rating,
    reviewCount: hotel.reviewCount,
    distance: hotel.distance
      ? `${hotel.distance.toFixed(1)} 公里`
      : '14.5 公里',
    price: hotel.minPrice,
    tags:
      hotel.tags && hotel.tags.length > 0
        ? hotel.tags.slice(0, 4)
        : hotel.facilities && hotel.facilities.length > 0
          ? hotel.facilities.slice(0, 4)
          : ['家庭房', '拍照出片', '行政酒廊', '茶艺表演'],
    image:
      hotel.images?.[0] ||
      hotel.imageUrl ||
      'https://via.placeholder.com/200x200',

    nights: nights,
    totalPrice: totalPrice,

    diamonds: hotel.starRating || 5,
    isGoldDiamond: hotel.starRating >= 5,
    ratingLabel: getRatingLabel(hotel.rating),
    collectionCount: '5.6万',
    landmark: '近市中心商圈',
    serviceDesc: '优质服务体验',
    ranking:
      hotel.orderCount && hotel.orderCount > 1000
        ? `${hotel.city}热门酒店榜`
        : '',

    diamondSymbol: '♦',
    goldDiamondText: '金钻',
    reviewSuffix: '点评',
    collectionSuffix: '收藏',
    distancePrefix: '距您直线 ',
    rankingIcon: '🏆',
    currencySymbol: '¥',
    priceSuffix: '起',
    totalPricePrefix: '晚 总价 ¥',
    separator: ' · ',
  }

  return (
    <View className="hotel-card" onClick={handleCardClick}>
      <View className="hotel-card-left">
        <Image
          className="hotel-image"
          src={displayData.image}
          fit="cover"
          lazy
        />
        <View className="play-icon">
          <View className="triangle"></View>
        </View>
      </View>

      <View className="hotel-card-right">
        <Space className="title-row" align="center" style={{ '--gap': '4px' }}>
          <Ellipsis
            className="hotel-name"
            content={displayData.name}
            rows={1}
            direction="end"
          />
          <View className="diamonds">
            {Array(displayData.diamonds)
              .fill(0)
              .map((_, i) => (
                <Text key={i} className="diamond">
                  {displayData.diamondSymbol}
                </Text>
              ))}
          </View>
        </Space>

        {displayData.isGoldDiamond && (
          <View className="badge-row">
            <View className="gold-diamond-badge">
              <Text className="badge-text">{displayData.goldDiamondText}</Text>
            </View>
          </View>
        )}

        <Space className="rating-row" align="center" style={{ '--gap': '0px' }}>
          <View className="score-box">
            <Text className="score-text">
              {displayData.rating?.toFixed(1) || '0.0'}
            </Text>
          </View>
          <Text className="rating-label">{displayData.ratingLabel}</Text>
          <Text className="review-count">
            {displayData.reviewCount} {displayData.reviewSuffix}
            {displayData.separator}
            {displayData.collectionCount}
            {displayData.collectionSuffix}
          </Text>
        </Space>

        <View className="location-row">
          <Text className="distance-text">
            {displayData.distancePrefix}
            {displayData.distance}
          </Text>
        </View>

        {displayData.landmark && (
          <View className="landmark-row">
            <Text className="landmark-text">{displayData.landmark}</Text>
          </View>
        )}

        {displayData.serviceDesc && (
          <View className="service-row">
            <Text className="service-text">{displayData.serviceDesc}</Text>
          </View>
        )}

        <Space className="tags-row" wrap style={{ '--gap': '4px' }}>
          {displayData.tags.map((tag, index) => (
            <Tag key={index} className="tag-box" fill="outline">
              {tag}
            </Tag>
          ))}
        </Space>

        <View className="footer-row">
          {displayData.ranking ? (
            <View className="ranking-badge">
              <Text className="ranking-icon">{displayData.rankingIcon}</Text>
              <Text className="ranking-text">{displayData.ranking}</Text>
            </View>
          ) : (
            <View />
          )}

          <View className="price-section">
            <View className="price-main">
              <Text className="currency">{displayData.currencySymbol}</Text>
              <Text className="price-value">{displayData.price}</Text>
              <Text className="price-suffix">{displayData.priceSuffix}</Text>
            </View>
            <Text className="total-price">
              {displayData.nights}
              {displayData.totalPricePrefix}
              {displayData.totalPrice}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
