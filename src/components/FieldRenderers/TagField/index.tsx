import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { FieldConfig } from '@/types/query.types'
import { useQueryStore } from '@/store/useQueryStore'
import { getCityHotSearch } from '@/mock/index'
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
  const currentCity = useQueryStore(
    (state) => state.scenes[state.activeScene].location.city
  )
  const [items, setItems] = useState<string[]>([])

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await getCityHotSearch(currentCity)
        if (res.code === 200 && res.data) {
          setItems(res.data.slice(0, 4))
        }
      } catch (e) {
        console.error('Failed to fetch hot tags:', e)
        setItems(config.props?.items || [])
      }
    }
    fetchTags()
  }, [currentCity])

  const handleTagClick = (item: string) => {
    if (onChange) {
      onChange(item)
    }

    if (onSearch) {
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
