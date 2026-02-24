import { View, Text } from '@tarojs/components'
import './LoadingMore.less'

interface LoadingMoreProps {
  loading: boolean
  hasMore: boolean
  allLoaded?: boolean // Made optional as it was not in the props used in HotelListContent, but original LoadingMore had it. Wait, I should check usage.
}

// Checking original LoadingMore:
// interface LoadingMoreProps {
//   loading: boolean
//   hasMore: boolean
//   allLoaded: boolean
// }

// Usage in HotelListContent needs to be adapted.
// HotelListContent logic:
// if (hasMore) -> loading or load more
// if (!hasMore && length > 0) -> all loaded.

// So I will keep the interface as is and adapt HotelListContent to pass the right props.

export default function LoadingMore({
  loading,
  hasMore,
  allLoaded,
}: LoadingMoreProps) {
  if (allLoaded) {
    return (
      <View className="loading-more">
        <Text>已加载全部酒店</Text>
      </View>
    )
  }

  if (hasMore) {
    return (
      <View className="loading-more">
        <Text>{loading ? '加载中...' : '上拉加载更多'}</Text>
      </View>
    )
  }

  return null
}
