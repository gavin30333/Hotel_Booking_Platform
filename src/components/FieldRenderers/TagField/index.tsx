import React from 'react'
import { View, Text } from '@tarojs/components'
import { FieldConfig } from '@/types/query.types'
import './TagField.less'

interface TagFieldProps {
  config: FieldConfig
  value?: string
  onChange?: (val: string) => void
  onSearch?: (val: string) => void
}

export const TagField: React.FC<TagFieldProps> = ({
  config,
  value,
  onChange,
  onSearch,
}) => {
  const items = config.props?.items || []

  const handleTagClick = (item: string) => {
    if (onChange) {
      onChange(item)
    }

    if (onSearch) {
      // Pass the selected item directly to onSearch to allow immediate searching with correct data
      onSearch(item)
    }
  }

  return (
    <View className="field-row tag-field">
      {items.map((item: string, index: number) => (
        <View
          key={index}
          className={`tag-item ${value === item ? 'selected' : ''}`}
          onClick={() => handleTagClick(item)}
        >
          <Text className="tag-text">{item}</Text>
        </View>
      ))}
    </View>
  )
}
