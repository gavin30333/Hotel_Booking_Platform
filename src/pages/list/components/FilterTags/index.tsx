import { View, Text, ScrollView } from '@tarojs/components'
import { ReactNode } from 'react'
import './FilterTags.less'

export interface FilterTagProps {
  label: string
  icon?: ReactNode
  onClick: () => void
  isActive?: boolean
  closable?: boolean
  onClose?: (e: any) => void
}

interface FilterTagsComponentProps {
  tags: FilterTagProps[]
}

export default function FilterTags({ tags }: FilterTagsComponentProps) {
  return (
    <View style={{ position: 'relative' }}>
      <View className="filter-tags">
        <ScrollView scrollX>
          {tags.map((tag, index) => (
            <View
              key={index}
              className={`filter-tag ${tag.isActive ? 'filter-tag-active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                tag.onClick()
              }}
            >
              <Text>{tag.label}</Text>
              {tag.icon && <Text className="arrow">{tag.icon}</Text>}
              {tag.closable && (
                <Text
                  className="filter-tag-close"
                  onClick={(e) => {
                    e.stopPropagation()
                    tag.onClose?.(e)
                  }}
                >
                  ×
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  )
}
