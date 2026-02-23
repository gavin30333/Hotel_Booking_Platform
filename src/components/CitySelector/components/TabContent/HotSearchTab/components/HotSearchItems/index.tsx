import React from 'react'
import { View } from '@tarojs/components'
import { CityTag } from '@/components/common/display/CityTag'
import './HotSearchItems.less'

interface HotSearchItemsProps {
  items: string[]
  onSelect: (item: string) => void
}

export const HotSearchItems: React.FC<HotSearchItemsProps> = ({
  items,
  onSelect,
}) => {
  return (
    <View className="hot-search-items">
      {items.map((item) => (
        <CityTag key={item} text={item} onClick={() => onSelect(item)} />
      ))}
    </View>
  )
}
