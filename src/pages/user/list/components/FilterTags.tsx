import { View, Text, ScrollView } from '@tarojs/components'

interface FilterTag {
  name: string
  key: string
  value: string | number | boolean
}

interface FilterTagsProps {
  showStayDurationPopover: boolean
  showBrandPopover: boolean
  showSortPopover: boolean
  stayDurationArrowUp: boolean
  brandArrowUp: boolean
  selectedFilters: string[]
  filterTags: FilterTag[]
  onStayDurationClick: () => void
  onBrandClick: () => void
  onSortClick: () => void
  onFilterTagClick: (filterName: string, filterValue: Record<string, unknown>) => void
  onRemoveFilter: (filterName: string, filterKey: string) => void
}

export default function FilterTags({
  showStayDurationPopover,
  showBrandPopover,
  showSortPopover,
  stayDurationArrowUp,
  brandArrowUp,
  selectedFilters,
  filterTags,
  onStayDurationClick,
  onBrandClick,
  onSortClick,
  onFilterTagClick,
  onRemoveFilter,
}: FilterTagsProps) {
  return (
    <View style={{ position: 'relative' }}>
      <View className="filter-tags">
        <ScrollView scrollX>
          <View
            className="filter-tag"
            onClick={(e) => {
              e.stopPropagation()
              onStayDurationClick()
            }}
          >
            <Text>入住时长</Text>
            <Text className="arrow">{stayDurationArrowUp ? '▲' : '▼'}</Text>
          </View>

          <View
            className="filter-tag"
            onClick={(e) => {
              e.stopPropagation()
              onBrandClick()
            }}
          >
            <Text>热门品牌</Text>
            <Text className="arrow">{brandArrowUp ? '▲' : '▼'}</Text>
          </View>

          {filterTags.map((tag) => (
            <View
              key={tag.name}
              className={`filter-tag ${selectedFilters.includes(tag.name) ? 'filter-tag-active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                onFilterTagClick(tag.name, { [tag.key]: tag.value })
              }}
            >
              <Text>{tag.name}</Text>
              {selectedFilters.includes(tag.name) && (
                <Text
                  className="filter-tag-close"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveFilter(tag.name, tag.key)
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
