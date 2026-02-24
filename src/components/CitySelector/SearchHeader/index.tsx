import React from 'react'
import { View } from '@tarojs/components'
import { SearchBar } from 'antd-mobile'
import './SearchHeader.less'

interface SearchHeaderProps {
  onSearch?: (val: string) => void
  onCancel?: () => void
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  onSearch,
  onCancel,
}) => {
  return (
    <View className="city-search-header">
      <SearchBar
        placeholder="全球城市/区域/位置/酒店"
        onSearch={onSearch}
        onCancel={onCancel}
        showCancelButton={() => true} // Ensure cancel button is always visible
        style={{ '--background': '#f5f5f5' }}
      />
    </View>
  )
}
