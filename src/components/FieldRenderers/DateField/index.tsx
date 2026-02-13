import React from 'react'
import { View, Text } from '@tarojs/components'
import { FieldConfig, DateRange } from '@/types/query.types'
import dayjs from 'dayjs'
import './DateField.less'

interface DateFieldProps {
  config: FieldConfig
  value: DateRange
  onChange: (value: DateRange) => void
}

export const DateField: React.FC<DateFieldProps> = ({ config, value }) => {
  const { singleDay } = config.props || {}

  const formatDate = (dateStr: string) => {
    const date = dayjs(dateStr)
    const month = date.month() + 1
    const day = date.date()
    // Simplified weekday logic for demo
    const isToday = dayjs().isSame(date, 'day')
    const isTomorrow = dayjs().add(1, 'day').isSame(date, 'day')
    const weekday = isToday
      ? '今天'
      : isTomorrow
        ? '明天'
        : '周' + '日一二三四五六'.charAt(date.day())

    return {
      text: `${month}月${day}日`,
      sub: weekday,
    }
  }

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
