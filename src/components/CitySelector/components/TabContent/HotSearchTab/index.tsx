import {
  hotSearchApi,
  HotSearchData,
  RankingList as RankingListType,
} from '@/services/api'
import {
  hotSearchTags,
  rankingLists,
} from '@/constants/CitySelectorConfig/hotSearchData'
import { HotSearchSelectResult } from '@/types/citySelector'
import React, { useState, useEffect } from 'react'
import { View, ScrollView, Text } from '@tarojs/components'
import { HotSearchItems } from './components/HotSearchItems'
import { RankingList } from './components/RankingList'
import './HotSearchTab.less'

interface HotSearchTabProps {
  currentCity?: string
  onSelect: (result: HotSearchSelectResult) => void
}

export const HotSearchTab: React.FC<HotSearchTabProps> = ({
  currentCity,
  onSelect,
}) => {
  const [hotSearchData, setHotSearchData] = useState<HotSearchData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (currentCity) {
      fetchHotSearchData(currentCity)
    }
  }, [currentCity])

  const fetchHotSearchData = async (city: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await hotSearchApi.getHotSearchByCity(city)
      if (response.data) {
        setHotSearchData(response.data)
      } else {
        setHotSearchData(null)
      }
    } catch (err) {
      console.error('Failed to fetch hot search data:', err)
      setError('加载热搜数据失败')
      setHotSearchData(null)
    } finally {
      setLoading(false)
    }
  }

  const displayTags = hotSearchData?.hotTags || hotSearchTags
  const displayRankingLists: RankingListType[] =
    hotSearchData?.rankingLists || rankingLists

  const getTabTitle = () => {
    if (currentCity && hotSearchData) {
      return `${currentCity}热搜`
    }
    if (currentCity) {
      return `${currentCity}热搜`
    }
    return '热搜推荐'
  }

  const handleTagSelect = (tag: string) => {
    onSelect({
      type: 'keyword',
      value: tag,
    })
  }

  const handleHotelSelect = (hotelName: string, hotelId?: string) => {
    onSelect({
      type: 'hotel',
      value: hotelName,
      hotelId,
    })
  }

  return (
    <View className="hot-search-tab">
      {loading && (
        <View className="loading-container">
          <Text className="loading-text">加载中...</Text>
        </View>
      )}

      {error && (
        <View className="error-container">
          <Text className="error-text">{error}</Text>
        </View>
      )}

      {!loading && !error && (
        <View className="hot-search-content">
          <View className="hot-search-header">
            <Text className="hot-search-title">{getTabTitle()}</Text>
          </View>

          <HotSearchItems items={displayTags} onSelect={handleTagSelect} />

          <ScrollView scrollX className="ranking-lists-scroll" enableFlex>
            {displayRankingLists.map((list, index) => (
              <View key={index} className="ranking-list-wrapper">
                <RankingList ranking={list} onSelect={handleHotelSelect} />
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  )
}
