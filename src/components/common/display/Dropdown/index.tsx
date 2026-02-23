import { View, Text } from '@tarojs/components'
import './Dropdown.less'

export interface DropdownOption {
  label: string
  value: string
}

export interface DropdownProps {
  visible: boolean
  options: DropdownOption[]
  onSelect: (value: string, label: string) => void
  title?: string
}

export default function Dropdown({
  visible,
  options,
  onSelect,
  title,
}: DropdownProps) {
  if (!visible) return null

  return (
    <View
      className="dropdown"
      onClick={(e) => e.stopPropagation()}
    >
      {options.map((option) => (
        <View
          key={option.value}
          className="dropdown-option"
          onClick={() => onSelect(option.value, option.label)}
        >
          <Text>{option.label}</Text>
        </View>
      ))}
    </View>
  )
}
