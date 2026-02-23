import React, { useState, useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import { Popup } from 'antd-mobile'
import dayjs, { Dayjs } from 'dayjs'
import './CalendarPicker.less'

interface DateRange {
  start: string | null
  end: string | null
}

interface CalendarPickerProps {
  visible: boolean
  onClose: () => void
  onConfirm: (range: DateRange) => void
  defaultStartDate?: string
  defaultEndDate?: string
  minDate?: string
  maxDate?: string
  title?: string
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  visible,
  onClose,
  onConfirm,
  defaultStartDate,
  defaultEndDate,
  minDate,
  maxDate,
  title = '选择日期',
}) => {
  const today = dayjs()
  const [currentMonth, setCurrentMonth] = useState(dayjs())
  const [selectedDate, setSelectedDate] = useState<DateRange>({
    start: defaultStartDate || null,
    end: defaultEndDate || null,
  })

  const minDateDayjs = minDate ? dayjs(minDate) : today
  const maxDateDayjs = maxDate ? dayjs(maxDate) : today.add(1, 'year')

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  const calendarDays = useMemo(() => {
    const startOfMonth = currentMonth.startOf('month')
    const endOfMonth = currentMonth.endOf('month')
    const startDay = startOfMonth.day()
    const daysInMonth = endOfMonth.date()

    const days: Array<{ date: Dayjs | null; isCurrentMonth: boolean }> = []

    for (let i = 0; i < startDay; i++) {
      days.push({ date: null, isCurrentMonth: false })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: currentMonth.date(i),
        isCurrentMonth: true,
      })
    }

    const remainingDays = 7 - (days.length % 7)
    if (remainingDays < 7) {
      for (let i = 0; i < remainingDays; i++) {
        days.push({ date: null, isCurrentMonth: false })
      }
    }

    return days
  }, [currentMonth])

  const handlePrevMonth = () => {
    const prevMonth = currentMonth.subtract(1, 'month')
    if (prevMonth.isAfter(minDateDayjs.subtract(1, 'month'))) {
      setCurrentMonth(prevMonth)
    }
  }

  const handleNextMonth = () => {
    const nextMonth = currentMonth.add(1, 'month')
    if (nextMonth.isBefore(maxDateDayjs.add(1, 'month'))) {
      setCurrentMonth(nextMonth)
    }
  }

  const handleDateClick = (date: Dayjs) => {
    const dateStr = date.format('YYYY-MM-DD')

    if (date.isBefore(minDateDayjs, 'day')) return
    if (date.isAfter(maxDateDayjs, 'day')) return

    if (!selectedDate.start || (selectedDate.start && selectedDate.end)) {
      setSelectedDate({ start: dateStr, end: null })
    } else {
      const startDate = dayjs(selectedDate.start)
      if (date.isBefore(startDate, 'day')) {
        setSelectedDate({ start: dateStr, end: selectedDate.start })
      } else {
        setSelectedDate({ start: selectedDate.start, end: dateStr })
      }
    }
  }

  const getDateStatus = (date: Dayjs) => {
    const dateStr = date.format('YYYY-MM-DD')
    const isStart = selectedDate.start === dateStr
    const isEnd = selectedDate.end === dateStr
    let isBetween = false

    if (selectedDate.start && selectedDate.end) {
      const startDate = dayjs(selectedDate.start)
      const endDate = dayjs(selectedDate.end)
      isBetween =
        date.isAfter(startDate, 'day') && date.isBefore(endDate, 'day')
    }

    const isDisabled =
      date.isBefore(minDateDayjs, 'day') || date.isAfter(maxDateDayjs, 'day')
    const isToday = date.isSame(today, 'day')

    return { isStart, isEnd, isBetween, isDisabled, isToday }
  }

  const handleConfirm = () => {
    if (selectedDate.start && selectedDate.end) {
      onConfirm(selectedDate)
    }
    onClose()
  }

  const handleCancel = () => {
    setSelectedDate({
      start: defaultStartDate || null,
      end: defaultEndDate || null,
    })
    onClose()
  }

  const nightsCount = useMemo(() => {
    if (selectedDate.start && selectedDate.end) {
      return dayjs(selectedDate.end).diff(dayjs(selectedDate.start), 'day')
    }
    return 0
  }, [selectedDate])

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="bottom"
      bodyStyle={{
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        maxHeight: '80vh',
      }}
      className="calendar-picker-popup"
    >
      <View className="calendar-picker-container">
        <View className="calendar-header">
          <View className="header-title">{title}</View>
          {nightsCount > 0 && (
            <View className="nights-count">共{nightsCount}晚</View>
          )}
        </View>

        <View className="month-selector">
          <View className="month-arrow" onClick={handlePrevMonth}>
            <Text>‹</Text>
          </View>
          <Text className="month-text">{currentMonth.format('YYYY年M月')}</Text>
          <View className="month-arrow" onClick={handleNextMonth}>
            <Text>›</Text>
          </View>
        </View>

        <View className="week-header">
          {weekDays.map((day) => (
            <View key={day} className="week-day">
              <Text>{day}</Text>
            </View>
          ))}
        </View>

        <View className="calendar-grid">
          {calendarDays.map((item, index) => {
            if (!item.date) {
              return (
                <View key={`empty-${index}`} className="calendar-day empty">
                  <Text></Text>
                </View>
              )
            }

            const status = getDateStatus(item.date)
            let dayClass = 'calendar-day'
            if (status.isStart) dayClass += ' start'
            if (status.isEnd) dayClass += ' end'
            if (status.isBetween) dayClass += ' between'
            if (status.isDisabled) dayClass += ' disabled'
            if (status.isToday) dayClass += ' today'

            return (
              <View
                key={`day-${index}`}
                className={dayClass}
                onClick={() => !status.isDisabled && handleDateClick(item.date)}
              >
                <Text className="day-text">{item.date.date()}</Text>
                {status.isToday && <Text className="today-label">今天</Text>}
              </View>
            )
          })}
        </View>

        <View className="calendar-footer">
          <View className="btn-cancel" onClick={handleCancel}>
            <Text>取消</Text>
          </View>
          <View className="btn-confirm" onClick={handleConfirm}>
            <Text>确定</Text>
          </View>
        </View>
      </View>
    </Popup>
  )
}
