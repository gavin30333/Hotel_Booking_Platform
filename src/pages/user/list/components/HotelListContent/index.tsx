import { View, Text, ScrollView } from '@tarojs/components'
import HotelCard from '@/components/common/display/HotelCard'
import { Hotel } from '@/services/api'
import LoadingMore from '../LoadingMore'
import NoData from '../NoData'
import './HotelListContent.less'

interface HotelListContentProps {
  hotelList: Hotel[]
  loading: boolean
  hasMore: boolean
  error: string | null
  isAnyDropdownOpen: boolean
}

export default function HotelListContent({
  hotelList,
  loading,
  hasMore,
  error,
  isAnyDropdownOpen,
}: HotelListContentProps) {
  return (
    <View style={{ flex: 1, position: 'relative', overflow: 'auto' }}>
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
        <ScrollView
          style={{ flex: 1, zIndex: 0 }}
          scrollY
          scrollWithAnimation
        >
          {hotelList.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}

          <LoadingMore
            loading={loading}
            hasMore={hasMore}
            allLoaded={!hasMore && hotelList.length > 0}
          />

          {error && (
            <View className="error">
              <Text>{error}</Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <NoData />
      )}
    </View>
  )
}
