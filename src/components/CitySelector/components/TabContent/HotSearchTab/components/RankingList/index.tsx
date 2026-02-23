import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import { HotSearchCategory } from '@/types/citySelector'
import './RankingList.less'

interface RankingListProps {
  ranking: HotSearchCategory
  onSelect: (name: string) => void
}

export const RankingList: React.FC<RankingListProps> = ({
  ranking,
  onSelect,
}) => {
  return (
    <View className="ranking-list-card">
      <View className="ranking-header">
        <Text className="ranking-title">🏆 {ranking.title}</Text>
        <Text className="ranking-more">更多酒店 {'>'}</Text>
      </View>

      <View className="ranking-items">
        {ranking.items.slice(0, 5).map((item) => (
          <View
            key={item.id}
            className="ranking-item"
            onClick={() => onSelect(item.name)}
          >
            <View className="item-image-box">
              <Image
                src={item.imageUrl || ''}
                className="item-image"
                mode="aspectFill"
              />
              <View className={`rank-badge rank-${item.rank}`}>
                {item.rank}
              </View>
            </View>
            <View className="item-info">
              <Text className="item-name">{item.name}</Text>
              <View className="item-meta">
                <Text className="item-score">{item.score}</Text>
                <Text className="item-desc">{item.description}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}
