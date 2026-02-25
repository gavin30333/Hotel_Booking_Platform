import { getCityHotSearch, getCityHotelRankings } from '@/mock/index'
import { HotSearchSelectResult } from '@/types/citySelector'
import React, { useState, useEffect } from 'react'
import { View, ScrollView, Text } from '@tarojs/components'
import { HotSearchItems } from './components/HotSearchItems'
import { RankingList } from './components/RankingList'
import './HotSearchTab.less'

interface RankingItem {
  hotelId: string
  name: string
  rank: number
  score?: string
  description?: string
  imageUrl?: string
}

interface RankingListData {
  title: string
  type: string
  items: RankingItem[]
}

interface HotSearchTabProps {
  currentCity?: string
  onSelect: (result: HotSearchSelectResult) => void
}

export const HotSearchTab: React.FC<HotSearchTabProps> = ({
  currentCity,
  onSelect,
}) => {
  const [hotTags, setHotTags] = useState<string[]>([])
  const [rankingLists, setRankingLists] = useState<RankingListData[]>([])
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
      const [hotSearchRes, rankingsRes] = await Promise.all([
        getCityHotSearch(city),
        getCityHotelRankings(city),
      ])

      if (hotSearchRes.code === 200) {
        setHotTags(hotSearchRes.data || [])
      }

      if (rankingsRes.code === 200 && rankingsRes.data) {
        const lists: RankingListData[] = []
        if (
          rankingsRes.data.luxuryHotels &&
          rankingsRes.data.luxuryHotels.length > 0
        ) {
          lists.push({
            title: '奢华酒店榜',
            type: 'luxury',
            items: rankingsRes.data.luxuryHotels.map((hotel, index) => ({
              hotelId: hotel.hotelId,
              name: hotel.name,
              rank: index + 1,
              score: hotel.score,
              description: hotel.desc,
              imageUrl: hotel.imageUrl,
            })),
          })
        }
        if (
          rankingsRes.data.familyHotels &&
          rankingsRes.data.familyHotels.length > 0
        ) {
          lists.push({
            title: '亲子酒店榜',
            type: 'family',
            items: rankingsRes.data.familyHotels.map((hotel, index) => ({
              hotelId: hotel.hotelId,
              name: hotel.name,
              rank: index + 1,
              score: hotel.score,
              description: hotel.desc,
              imageUrl: hotel.imageUrl,
            })),
          })
        }
        setRankingLists(lists)
      }
    } catch (err) {
      console.error('Failed to fetch hot search data:', err)
      setError('加载热搜数据失败')
      setHotTags([])
      setRankingLists([])
    } finally {
      setLoading(false)
    }
  }

  const getTabTitle = () => {
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

          {hotTags.length > 0 && (
            <HotSearchItems items={hotTags} onSelect={handleTagSelect} />
          )}

          {rankingLists.length > 0 && (
            <ScrollView scrollX className="ranking-lists-scroll" enableFlex>
              {rankingLists.map((list, index) => (
                <View key={index} className="ranking-list-wrapper">
                  <RankingList ranking={list} onSelect={handleHotelSelect} />
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  )
}
