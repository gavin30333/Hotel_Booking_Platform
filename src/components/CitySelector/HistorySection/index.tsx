import React from 'react'
import { View, Text } from '@tarojs/components'
import { DeleteOutline } from 'antd-mobile-icons'
import './HistorySection.less'

interface HistorySectionProps {
  cities: string[]
  onSelect: (city: string) => void
  onClear?: () => void
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  cities,
  onSelect,
  onClear,
}) => {
  if (cities.length === 0) return null

  return (
    <View className="city-history-section">
      <View className="section-header">
        <Text className="section-title">历史搜索</Text>
        {onClear && (
          <View className="clear-icon" onClick={onClear}>
            <DeleteOutline color="#999" />
          </View>
        )}
      </View>
      <View className="history-tags">
        {cities.map((city) => (
          <View
            key={city}
            className="history-tag"
            onClick={() => onSelect(city)}
          >
            <Text>{city}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
