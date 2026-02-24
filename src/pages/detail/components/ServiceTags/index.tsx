import { View, Text, ScrollView } from '@tarojs/components'
import { getFacilityIcon } from '../../utils'
import './ServiceTags.less'

interface ServiceTagsProps {
  facilities: string[]
  onPolicyClick: () => void
}

export default function ServiceTags({ facilities, onPolicyClick }: ServiceTagsProps) {
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
