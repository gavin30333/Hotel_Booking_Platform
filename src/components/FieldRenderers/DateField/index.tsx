import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import dayjs from 'dayjs'
import { FieldConfig, DateRange } from '@/types/query.types'
import { formatDate } from '@/utils/dateFieldUtils'
import { CalendarPicker } from '@/components/common/form/CalendarPicker'
import './DateField.less'

interface DateFieldProps {
  config: FieldConfig
  value: DateRange
  onChange: (value: DateRange) => void
}

export const DateField: React.FC<DateFieldProps> = ({
  config,
  value,
  onChange,
}) => {
  const { singleDay } = config.props || {}
  const [isCalendarVisible, setIsCalendarVisible] = useState(false)

  const start = formatDate(value.startDate)
  const end = value.endDate ? formatDate(value.endDate) : null

  const handleOpenCalendar = () => {
    setIsCalendarVisible(true)
  }

  const handleCloseCalendar = () => {
    setIsCalendarVisible(false)
  }

  const handleDateConfirm = (range: {
    start: string | null
    end: string | null
  }) => {
    if (range.start && range.end) {
      const nights = dayjs(range.end).diff(dayjs(range.start), 'day')
      onChange({
        startDate: range.start,
        endDate: range.end,
        nights,
      })
    }
    setIsCalendarVisible(false)
  }

  return (
    <>
      <View className="field-row date-field" onClick={handleOpenCalendar}>
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

      <CalendarPicker
        visible={isCalendarVisible}
        onClose={handleCloseCalendar}
        onConfirm={handleDateConfirm}
        defaultStartDate={value.startDate}
        defaultEndDate={value.endDate}
        priceData={{
          '2026-02-23': 399,
          '2026-02-24': 499,
          '2026-02-25': 399,
          '2026-02-26': 599,
          '2026-02-27': 599,
          '2026-02-28': 499,
          '2026-02-29': 399,
          '2026-03-01': 499,
          '2026-03-02': 599,
        }}
        holidayData={{
          '2026-02-23': { type: 'holiday', name: '春节' },
          '2026-02-24': { type: 'rest' },
          '2026-03-01': { type: 'work' },
        }}
      />
    </>
  )
}
