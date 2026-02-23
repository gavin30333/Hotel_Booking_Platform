import { View } from '@tarojs/components'
import CoreFilterHeader from '@/components/filter/CoreFilterHeader'
import './HotelListHeader.less'

interface HotelListHeaderProps {
  onSearch: (params: Record<string, unknown>) => void
  onDropdownStateChange: (isOpen: boolean) => void
  initialFilters: Record<string, unknown>
}

export default function HotelListHeader({
  onSearch,
  onDropdownStateChange,
  initialFilters,
}: HotelListHeaderProps) {
  return (
    <View className="hotel-list-header">
      <CoreFilterHeader
        onSearch={onSearch}
        onDropdownStateChange={onDropdownStateChange}
        initialFilters={initialFilters}
      />
    </View>
  )
}
