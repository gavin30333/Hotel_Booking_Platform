import React from 'react'
import { View, Text } from '@tarojs/components'
import { InformationCircleOutline } from 'antd-mobile-icons'
import './LocationStatus.less'

interface LocationStatusProps {
  status?: 'loading' | 'success' | 'failed' | 'disabled'
  city?: string
  onClick?: () => void
}

export const LocationStatus: React.FC<LocationStatusProps> = ({
  status = 'disabled',
  city,
  onClick,
}) => {
  return (
    <View className="city-location-status" onClick={onClick}>
      <View className="status-icon">
        <InformationCircleOutline color="#1677ff" fontSize={16} />
      </View>
      <Text className="status-text">
        {status === 'disabled'
          ? '定位未开启'
          : status === 'loading'
            ? '正在定位...'
            : status === 'success'
              ? `当前定位：${city}`
              : '定位失败，点击重试'}
      </Text>
    </View>
  )
}
