import { View, Text, ScrollView } from '@tarojs/components'
import HotelCard from '@/components/common/display/HotelCard'
import { Hotel } from '@/services/api'

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

          {hasMore && (
            <View className="loading-more">
              <Text>{loading ? '加载中...' : '上拉加载更多'}</Text>
            </View>
          )}

          {!hasMore && hotelList.length > 0 && (
            <View className="loading-more">
              <Text>已加载全部酒店</Text>
            </View>
          )}

          {error && (
            <View className="error">
              <Text>{error}</Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <View className="no-data" style={{ zIndex: 0 }}>
          <Text>暂无符合条件的酒店</Text>
          <Text style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
            请尝试调整筛选条件
          </Text>
        </View>
      )}
    </View>
  )
}
