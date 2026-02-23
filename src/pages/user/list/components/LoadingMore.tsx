import { View, Text } from '@tarojs/components'

interface LoadingMoreProps {
  loading: boolean
  hasMore: boolean
  allLoaded: boolean
}

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
