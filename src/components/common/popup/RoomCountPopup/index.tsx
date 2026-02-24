import React from 'react'
import { View, Text } from '@tarojs/components'
import { Popup } from 'antd-mobile'
import './RoomCountPopup.less'

interface RoomCountPopupProps {
  visible: boolean
  onClose: () => void
  count: number
  onConfirm: (count: number) => void
}

const roomCountOptions = [1, 2, 3, 4]

export const RoomCountPopup: React.FC<RoomCountPopupProps> = ({
  visible,
  onClose,
  count,
  onConfirm,
}) => {
  const handleSelect = (selectedCount: number) => {
    onConfirm(selectedCount)
  }

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="bottom"
      bodyStyle={{
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
      }}
      className="room-count-popup"
    >
      <View className="room-count-popup-container">
        <View className="popup-header">
          <Text className="header-title">选择房间数量</Text>
        </View>

        <View className="popup-content">
          <View className="count-options">
            {roomCountOptions.map((option) => (
              <View
                key={option}
                className={`count-btn${count === option ? ' selected' : ''}`}
                onClick={() => handleSelect(option)}
              >
                <Text className="btn-text">{option}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="popup-footer">
          <View className="btn-close" onClick={onClose}>
            <Text>关闭</Text>
          </View>
        </View>
      </View>
    </Popup>
  )
}
