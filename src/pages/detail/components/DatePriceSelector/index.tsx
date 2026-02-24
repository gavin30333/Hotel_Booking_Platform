import { View, Text, ScrollView } from '@tarojs/components'
import { Tag, Button } from 'antd-mobile'
import {
  AppstoreOutline,
  UserOutline,
  SmileOutline,
  DownOutline,
} from 'antd-mobile-icons'
import { getNightsCount } from '../../utils'
import './DatePriceSelector.less'

interface DatePriceSelectorProps {
  checkInDate: string
  checkOutDate: string
  roomCount: number
  adultCount: number
  childCount: number
  selectedFilters: string[]
  onDateClick: () => void
  onGuestClick: () => void
  onFilterTagClick: (filterType: string) => void
  onRemoveFilter: (filterType: string) => void
}

export default function DatePriceSelector({
  checkInDate,
  checkOutDate,
  roomCount,
  adultCount,
  childCount,
  selectedFilters,
  onDateClick,
  onGuestClick,
  onFilterTagClick,
  onRemoveFilter,
}: DatePriceSelectorProps) {
  const getWeekDay = (dateStr: string) => {
    const date = new Date(dateStr)
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return days[date.getDay()]
  }

  const getDateLabel = (dateStr: string, isCheckIn: boolean) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)

    const dStr = date.toISOString().split('T')[0]
    const tStr = today.toISOString().split('T')[0]
    const tmStr = tomorrow.toISOString().split('T')[0]

    if (dStr === tStr) return '今天'
    if (dStr === tmStr) return '明天'
    
    return getWeekDay(dateStr)
  }

  return (
    <View className="date-price-section">
      <View className="date-price-main">
        <View className="date-section" onClick={onDateClick}>
          <View className="date-combined">
            <View className="date-group">
              <View className="date-item">
                <Text className="date-label">
                  {getDateLabel(checkInDate, true)}
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
                <View className="date-label-row">
                  <Text className="date-label">
                    {getDateLabel(checkOutDate, false)}
                  </Text>
                  <Tag className="low-price-badge" color="primary">
                    <Text className="low-price-text">看低价</Text>
                  </Tag>
                </View>
                <Text className="date-value">
                  {(() => {
                    const checkOut = new Date(checkOutDate)
                    return `${checkOut.getMonth() + 1}月${checkOut.getDate()}日`
                  })()}
                </Text>
              </View>
            </View>
            <View className="night-count">
              <Text className="night-count-text">
                共{getNightsCount(checkInDate, checkOutDate)}晚
              </Text>
            </View>
          </View>
        </View>
        <View className="divider"></View>
        <View className="guest-section" onClick={onGuestClick}>
          <View className="guest-combined">
            <Text className="guest-label">间数人数</Text>
            <View className="guest-value">
              <View className="guest-item">
                <Text className="val">{roomCount}</Text>
                <AppstoreOutline className="icon" />
              </View>
              <View className="guest-item">
                <Text className="val">{adultCount}</Text>
                <UserOutline className="icon" />
              </View>
              <View className="guest-item">
                <Text className="val">{childCount}</Text>
                <SmileOutline className="icon" />
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="filter-tags-container">
        <ScrollView scrollX>
          <Tag
            className="filter-tag"
            onClick={(e) => {
              e.stopPropagation()
              onFilterTagClick('价格')
            }}
          >
            <Text className="filter-tag-text">¥100以上</Text>
            <DownOutline className="filter-tag-arrow" />
          </Tag>
          <Tag
            className={`filter-tag ${selectedFilters.includes('双床房') ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              onFilterTagClick('双床房')
            }}
          >
            <Text className="filter-tag-text">双床房</Text>
            {selectedFilters.includes('双床房') && (
              <Text
                className="filter-tag-close"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveFilter('双床房')
                }}
              >
                ×
              </Text>
            )}
          </Tag>
          <Tag
            className={`filter-tag ${selectedFilters.includes('大床房') ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              onFilterTagClick('大床房')
            }}
          >
            <Text className="filter-tag-text">大床房</Text>
            {selectedFilters.includes('大床房') && (
              <Text
                className="filter-tag-close"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveFilter('大床房')
                }}
              >
                ×
              </Text>
            )}
          </Tag>
        </ScrollView>
        <Button
          className="filter-button"
          onClick={(e) => {
            e.stopPropagation()
            onFilterTagClick('筛选')
          }}
          fill="none"
        >
          <Text className="filter-button-text">筛选</Text>
          <DownOutline className="filter-button-arrow" />
        </Button>
      </View>
    </View>
  )
}
