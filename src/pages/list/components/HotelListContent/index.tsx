import { View, Text } from '@tarojs/components'
import { Hotel } from '@/services/hotel'
import NoData from '@/components/common/feedback/NoData'
import VirtualHotelList from '../VirtualHotelList'
import './HotelListContent.less'

interface HotelListContentProps {
  hotelList: Hotel[]
  loading: boolean
  hasMore: boolean
  error: string | null
  isAnyDropdownOpen: boolean
  onLoadMore: () => void
}

export default function HotelListContent({
  hotelList,
  loading,
  hasMore,
  error,
  isAnyDropdownOpen,
  onLoadMore,
}: HotelListContentProps) {
  return (
    <View style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      {isAnyDropdownOpen && (
        <View
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 1,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      {loading && hotelList.length === 0 ? (
        <View className="loading">
          <Text>筛选中...</Text>
        </View>
      ) : hotelList.length > 0 ? (
        <VirtualHotelList
          hotelList={hotelList}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          error={error}
        />
      ) : (
        <NoData />
      )}
    </View>
  )
}
