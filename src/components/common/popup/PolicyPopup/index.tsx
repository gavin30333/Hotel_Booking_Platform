import React from 'react'
import { View, Text } from '@tarojs/components'
import { Popup, Button } from 'antd-mobile'
import {
  ClockCircleOutline,
  CloseCircleOutline,
  AddCircleOutline,
  CloseOutline,
} from 'antd-mobile-icons'
import './PolicyPopup.less'

interface IPolicies {
  checkIn?: string
  checkOut?: string
  cancellation?: string
  extraBed?: string
  pets?: string
}

interface PolicyPopupProps {
  visible: boolean
  onClose: () => void
  policies: IPolicies
  hotelName?: string
}

const policyConfig = [
  {
    key: 'checkIn',
    title: '入住时间',
    icon: ClockCircleOutline,
    defaultText: '14:00后入住',
  },
  {
    key: 'checkOut',
    title: '退房时间',
    icon: ClockCircleOutline,
    defaultText: '12:00前退房',
  },
  {
    key: 'cancellation',
    title: '取消政策',
    icon: CloseCircleOutline,
    defaultText: '入住当天18:00前可免费取消',
  },
  {
    key: 'extraBed',
    title: '加床政策',
    icon: AddCircleOutline,
    defaultText: '请咨询酒店前台',
  },
  {
    key: 'pets',
    title: '宠物政策',
    icon: CloseOutline,
    defaultText: '不允许携带宠物',
  },
]

export const PolicyPopup: React.FC<PolicyPopupProps> = ({
  visible,
  onClose,
  policies,
  hotelName,
}) => {
  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="bottom"
      bodyStyle={{
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        maxHeight: '70vh',
      }}
      className="policy-popup"
    >
      <View className="policy-popup-container">
        <View className="policy-header">
          <View className="header-left" onClick={onClose}>
            <CloseOutline fontSize={24} />
          </View>
          <View className="header-center">
            <Text className="header-title">酒店政策</Text>
            {hotelName && <Text className="header-subtitle">{hotelName}</Text>}
          </View>
          <View className="header-right" />
        </View>

        <View className="policy-content">
          {policyConfig.map((config) => {
            const IconComponent = config.icon
            const policyValue = policies[config.key as keyof IPolicies]

            return (
              <View key={config.key} className="policy-item">
                <View className="policy-icon">
                  <IconComponent color="#1890ff" fontSize={18} />
                </View>
                <View className="policy-info">
                  <Text className="policy-title">{config.title}</Text>
                  <Text className="policy-value">
                    {policyValue || config.defaultText}
                  </Text>
                </View>
              </View>
            )
          })}
        </View>

        <View className="policy-footer">
          <Button block color="primary" size="large" onClick={onClose}>
            关闭
          </Button>
        </View>
      </View>
    </Popup>
  )
}
