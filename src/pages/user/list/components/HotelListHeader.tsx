import { View } from '@tarojs/components'
import CoreFilterHeader from '@/components/filter/CoreFilterHeader'

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
    <View style={{ position: 'relative', zIndex: 100 }}>
      <CoreFilterHeader
        onSearch={onSearch}
        onDropdownStateChange={onDropdownStateChange}
        initialFilters={initialFilters}
      />
    </View>
  )
}
