import React from 'react'
import { View, Text } from '@tarojs/components'
import { Popup } from 'antd-mobile'
import './ChildAgeSelectionPopup.less'

interface Props {
  visible: boolean
  onClose: () => void
  onSelect: (age: number) => void
  childIndex: number
  currentAge?: number
}

export const ChildAgeSelectionPopup: React.FC<Props> = ({
  visible,
  onClose,
  onSelect,
  childIndex,
  currentAge,
}) => {
  const ageOptions = [
    { label: '1岁以下', value: 0 },
    ...Array.from({ length: 17 }, (_, i) => ({
      label: `${i + 1}岁`,
      value: i + 1,
    })),
  ]

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
    >
      <View className="child-age-popup-container">
        <View className="popup-header">
          <View className="close-icon" onClick={onClose}>
            ×
          </View>
          <Text className="title">儿童{childIndex + 1} 年龄</Text>
          <View className="placeholder" />
        </View>

        <View className="popup-content">
          <View className="age-grid">
            {ageOptions.map((option) => (
              <View
                key={option.value}
                className={`age-item ${currentAge === option.value ? 'selected' : ''}`}
                onClick={() => onSelect(option.value)}
              >
                <Text>{option.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Popup>
  )
}
