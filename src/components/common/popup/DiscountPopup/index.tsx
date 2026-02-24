import React from 'react'
import { View, Text } from '@tarojs/components'
import { Popup } from 'antd-mobile'
import { FireFill } from 'antd-mobile-icons'
import './DiscountPopup.less'

interface IDiscount {
  name: string
  type: string
  value: number
  conditions: string
  description: string
  startDate: string
  endDate: string
  _id?: string
}

interface DiscountPopupProps {
  visible: boolean
  onClose: () => void
  discounts: IDiscount[]
  hotelName?: string
}

const getDiscountTypeText = (type: string, value: number) => {
  switch (type) {
    case 'percentage':
      return `${value}折`
    case 'fixed':
      return `立减${value}元`
    case 'special':
      return '专属优惠'
    default:
      return '优惠'
  }
}

export const DiscountPopup: React.FC<DiscountPopupProps> = ({
  visible,
  onClose,
  discounts,
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
      className="discount-popup"
    >
      <View className="discount-popup-container">
        <View className="discount-header">
          <Text className="header-title">优惠活动</Text>
          {hotelName && <Text className="header-subtitle">{hotelName}</Text>}
        </View>

        <View className="discount-content">
          {discounts.map((discount, index) => (
            <View key={discount._id || index} className="discount-item">
              <View className="discount-icon">
                <FireFill color="#ff7a45" fontSize={20} />
              </View>
              <View className="discount-info">
                <View className="discount-title-row">
                  <Text className="discount-name">{discount.name}</Text>
                  <Text className="discount-type">
                    {getDiscountTypeText(discount.type, discount.value)}
                  </Text>
                </View>
                <Text className="discount-description">{discount.description}</Text>
                <Text className="discount-conditions">条件：{discount.conditions}</Text>
                <Text className="discount-date">
                  有效期：{discount.startDate} 至 {discount.endDate}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className="discount-footer">
          <View className="btn-close" onClick={onClose}>
            <Text>关闭</Text>
          </View>
        </View>
      </View>
    </Popup>
  )
}
