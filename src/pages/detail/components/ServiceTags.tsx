import { View, Text, ScrollView } from '@tarojs/components'
import {
  GlobalOutline,
  TruckOutline,
  GiftOutline,
  ScanningFaceOutline,
  SmileOutline,
  SetOutline,
  ClockCircleOutline,
  FireFill,
} from 'antd-mobile-icons'

interface ServiceTagsProps {
  facilities: string[]
  onPolicyClick: () => void
}

export default function ServiceTags({ facilities, onPolicyClick }: ServiceTagsProps) {
  const getFacilityIcon = (facility: string) => {
    const facilityLower = facility.toLowerCase()
    if (
      facilityLower.includes('wifi') ||
      facilityLower.includes('网络') ||
      facilityLower.includes('无线')
    ) {
      return GlobalOutline
    }
    if (
      facilityLower.includes('停车') ||
      facilityLower.includes('车位') ||
      facilityLower.includes('车库')
    ) {
      return TruckOutline
    }
    if (
      facilityLower.includes('早餐') ||
      facilityLower.includes('餐厅') ||
      facilityLower.includes('餐饮')
    ) {
      return GiftOutline
    }
    if (
      facilityLower.includes('健身') ||
      facilityLower.includes('泳池') ||
      facilityLower.includes('运动')
    ) {
      return ScanningFaceOutline
    }
    if (
      facilityLower.includes('前台') ||
      facilityLower.includes('服务') ||
      facilityLower.includes('接待')
    ) {
      return SmileOutline
    }
    if (facilityLower.includes('空调') || facilityLower.includes('暖气')) {
      return SetOutline
    }
    if (facilityLower.includes('洗浴') || facilityLower.includes('淋浴')) {
      return ClockCircleOutline
    }
    return FireFill
  }

  return (
    <View className="service-tags-container">
      <ScrollView className="service-tags-scroll" scrollX>
        <View className="service-tags">
          {facilities.slice(0, 8).map((facility, index) => {
            const IconComponent = getFacilityIcon(facility)
            return (
              <View key={index} className="service-tag">
                <View className="tag-icon">
                  <IconComponent color="#1890ff" fontSize={20} />
                </View>
                <Text className="tag-text">{facility}</Text>
              </View>
            )
          })}
        </View>
      </ScrollView>
      <View
        className="facility-policy"
        onClick={onPolicyClick}
      >
        <Text className="policy-text">设施政策</Text>
      </View>
    </View>
  )
}
