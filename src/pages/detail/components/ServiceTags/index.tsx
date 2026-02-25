import { View, Text, ScrollView } from '@tarojs/components'
import { Button } from 'antd-mobile'
import { RightOutline } from 'antd-mobile-icons'
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
                  <IconComponent className="icon-svg" fontSize={18} />
                </View>
                <Text className="tag-text">{facility}</Text>
              </View>
            )
          })}
        </View>
      </ScrollView>
      <Button
        className="facility-policy"
        onClick={onPolicyClick}
        fill="none"
      >
        <Text className="policy-text">设施政策</Text>
        <RightOutline className="policy-arrow" />
      </Button>
    </View>
  )
}
