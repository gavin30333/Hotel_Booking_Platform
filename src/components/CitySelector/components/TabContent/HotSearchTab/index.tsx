import React from 'react'
import { View, ScrollView } from '@tarojs/components'
import { HotSearchItems } from './components/HotSearchItems'
import { RankingList } from './components/RankingList'
import { hotSearchTags, rankingLists } from '@/constants/hotSearchData'
import './HotSearchTab.less'

interface HotSearchTabProps {
  onSelect: (item: string) => void
}

export const HotSearchTab: React.FC<HotSearchTabProps> = ({ onSelect }) => {
  return (
    <View className="hot-search-tab">
      <View className="hot-search-content">
        <HotSearchItems items={hotSearchTags} onSelect={onSelect} />

        <ScrollView scrollX className="ranking-lists-scroll" enableFlex>
          {rankingLists.map((list, index) => (
            <View key={index} className="ranking-list-wrapper">
              <RankingList ranking={list} onSelect={onSelect} />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  )
}
