import { View, Text } from '@tarojs/components'

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
      style={{
        position: 'absolute',
        top: '100%',
        left: '0',
        right: '0',
        zIndex: 9999,
        backgroundColor: '#fff',
        borderRadius: '0 0 8px 8px',
        padding: '12px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {options.map((option) => (
        <View
          key={option.value}
          style={{
            padding: '8px',
            fontSize: '12px',
            color: '#333',
            cursor: 'pointer',
            backgroundColor: '#f8f8f8',
            borderRadius: '4px',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #e8e8e8',
          }}
          onClick={() => onSelect(option.value, option.label)}
        >
          <Text>{option.label}</Text>
        </View>
      ))}
    </View>
  )
}
