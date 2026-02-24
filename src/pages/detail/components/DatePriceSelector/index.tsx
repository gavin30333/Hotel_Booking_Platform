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
  isFixed?: boolean
  topOffset?: number
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
  isFixed = false,
  topOffset = 0,
}: DatePriceSelectorProps) {
  return (
    <View className="date-price-section">
      {isFixed && <View className="date-price-placeholder"></View>}
      <View
        className={`date-price-main${isFixed ? ' fixed' : ''}`}
        style={isFixed ? { top: `${topOffset}px` } : undefined}
      >
        <View className="date-section" onClick={onDateClick}>
          <View className="date-combined">
            <View className="date-part">
              <View className="date-item">
                <Text className="date-label today">
                  {checkInDate === new Date().toISOString().split('T')[0]
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
                  {checkOutDate ===
                  new Date(new Date().setDate(new Date().getDate() + 1))
                    .toISOString()
                    .split('T')[0]
                    ? '明天'
                    : '退房'}
                </Text>
                <Text className="date-value">
                  {(() => {
                    const checkOut = new Date(checkOutDate)
                    return `${checkOut.getMonth() + 1}月${checkOut.getDate()}日`
                  })()}
                </Text>
                <Tag className="low-price-badge" color="primary">
                  <Text className="low-price-text">看低价</Text>
                </Tag>
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
