import React from 'react'
import { View, Text } from '@tarojs/components'
import { FieldConfig, DateRange } from '@/types/query.types'
import { formatDate } from '@/utils/dateFieldUtils'
import './DateField.less'

interface DateFieldProps {
  config: FieldConfig
  value: DateRange
  onChange: (value: DateRange) => void
}

export const DateField: React.FC<DateFieldProps> = ({ config, value }) => {
  const { singleDay } = config.props || {}

  const start = formatDate(value.startDate)
  const end = value.endDate ? formatDate(value.endDate) : null

  return (
    <View className="field-row date-field">
      <View className="date-section">
        <View className="date-item">
          <Text className="date-text">{start.text}</Text>
          <Text className="sub-text">{start.sub}</Text>
        </View>
        {!singleDay && end && (
          <>
            <View className="separator">-</View>
            <View className="date-item">
              <Text className="date-text">{end.text}</Text>
              <Text className="sub-text">{end.sub}</Text>
            </View>
          </>
        )}
      </View>

      {!singleDay && (
        <View className="duration-section">
          <Text className="duration-text">共{value.nights}晚</Text>
        </View>
      )}
    </View>
  )
}
