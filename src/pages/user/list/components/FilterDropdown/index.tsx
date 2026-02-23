import { View, Text } from '@tarojs/components'
import './FilterDropdown.less'

interface DropdownOption {
  label: string
  value: string
}

interface FilterDropdownProps {
  visible: boolean
  options: DropdownOption[]
  onSelect: (value: string, label: string) => void
  title?: string
}

export default function FilterDropdown({
  visible,
  options,
  onSelect,
  title,
}: FilterDropdownProps) {
  if (!visible) return null

  return (
    <View
      className="filter-dropdown"
      onClick={(e) => e.stopPropagation()}
    >
      {options.map((option) => (
        <View
          key={option.value}
          className="filter-dropdown-option"
          onClick={() => onSelect(option.value, option.label)}
        >
          <Text>{option.label}</Text>
        </View>
      ))}
    </View>
  )
}
